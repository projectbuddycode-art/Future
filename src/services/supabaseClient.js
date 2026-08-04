import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Centralized single Supabase client with persistent Auth session enabled
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Get Supabase Connection Status
 */
export async function getSupabaseStatus() {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      auth: false,
      storage: false,
      database: false,
      message: "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured in Vercel env. Using local engine fallback."
    };
  }

  try {
    const { data, error } = await supabase.from('site_cms_store').select('id').limit(1);
    return {
      connected: !error,
      auth: true,
      storage: true,
      database: !error,
      message: error ? error.message : "Connected to Supabase Production."
    };
  } catch (err) {
    return {
      connected: false,
      auth: false,
      storage: false,
      database: false,
      message: err.message
    };
  }
}

/**
 * Fetch Full CMS State from Supabase Database
 */
export async function fetchCMSDataFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('site_cms_store')
      .select('state')
      .eq('id', 'main_cms_state')
      .single();

    if (error || !data) return null;
    return data.state;
  } catch (e) {
    console.warn("Supabase fetch failed, using cached state:", e);
    return null;
  }
}

/**
 * Persist Full CMS State to Supabase Database
 */
export async function saveCMSDataToSupabase(state) {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from('site_cms_store')
      .upsert({ id: 'main_cms_state', state, updated_at: new Date().toISOString() });

    if (error) {
      console.warn("Supabase upsert warning:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("Supabase save failed:", e);
    return false;
  }
}

/**
 * Extract Metadata from Image File
 */
export function extractImageMetadata(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth || 1200;
      const height = img.naturalHeight || 675;
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(width, height);
      const aspectWidth = width / divisor;
      const aspectHeight = height / divisor;

      resolve({
        width,
        height,
        aspectRatio: `${aspectWidth}/${aspectHeight}`,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || 'image/jpeg',
        mediaType: 'image'
      });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      resolve({
        width: 1200,
        height: 675,
        aspectRatio: "16/9",
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || 'image/jpeg',
        mediaType: 'image'
      });
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}

/**
 * Extract Metadata from Video File
 */
export function extractVideoMetadata(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(width, height);
      const aspectWidth = width / divisor;
      const aspectHeight = height / divisor;

      resolve({
        width,
        height,
        duration: Math.round(video.duration || 0),
        aspectRatio: `${aspectWidth}/${aspectHeight}`,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || 'video/mp4',
        mediaType: 'video'
      });
      URL.revokeObjectURL(url);
    };

    video.onerror = () => {
      resolve({
        width: 1920,
        height: 1080,
        duration: 0,
        aspectRatio: "16/9",
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || 'video/mp4',
        mediaType: 'video'
      });
      URL.revokeObjectURL(url);
    };

    video.src = url;
  });
}

/**
 * Direct File Upload to Supabase Storage Bucket 'website-media'
 */
export async function uploadDirectFileToSupabase(file, folderPath = 'general', onProgress) {
  const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i);
  
  const meta = isVideo
    ? await extractVideoMetadata(file)
    : await extractImageMetadata(file);

  if (onProgress) onProgress(25, "Uploading to storage...");

  let publicUrl = "";
  const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `${folderPath}/${safeFilename}`;

  if (isSupabaseConfigured && supabase) {
    // Audit current session immediately before storage upload
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    console.log("STORAGE AUTH DEBUG", {
      session: session ? "YES" : "NO",
      user: user ? "YES" : "NO",
      userId: user?.id || "NONE",
      userEmail: user?.email || "NONE",
      sessionError: sessionError?.message || "NONE",
      userError: userError?.message || "NONE",
      bucket: "website-media"
    });

    if (!session || !user) {
      throw new Error("Supabase storage upload failed: Session is unauthenticated.");
    }

    // Verify Admin Database Record in public.admin_users using Auth UUID
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminRecord) {
      console.warn("CMS Admin Record Verification Failure:", adminError?.message);
      throw new Error("Your authenticated account is not registered as a CMS administrator.");
    }

    const { data, error } = await supabase.storage
      .from('website-media')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error("Supabase Storage Upload Error:", error);
      throw new Error(`Supabase Storage Error: ${error.message}`);
    }

    if (onProgress) onProgress(75, "Processing metadata...");

    const { data: publicData } = supabase.storage
      .from('website-media')
      .getPublicUrl(storagePath);

    publicUrl = publicData.publicUrl;
  } else {
    if (onProgress) onProgress(65, "Generating local asset payload...");
    
    publicUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  if (onProgress) onProgress(100, "Ready to Publish");

  return {
    id: `media_${Date.now()}`,
    name: file.name,
    url: publicUrl,
    storagePath,
    type: meta.mediaType,
    width: meta.width,
    height: meta.height,
    aspectRatio: meta.aspectRatio,
    fileSize: meta.fileSize,
    mimeType: meta.mimeType,
    fit: 'contain',
    focalPoint: { x: 50, y: 50 },
    alt: file.name,
    createdAt: new Date().toISOString()
  };
}
