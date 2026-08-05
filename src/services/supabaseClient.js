import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const MEDIA_BUCKET = 'website-media';
export const CMS_STORE_ID = 'main_cms_state';

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
 * Get Supabase Connection & Bucket Status
 */
export async function getSupabaseStatus() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      auth: false,
      storage: false,
      database: false,
      message: "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured."
    };
  }

  try {
    // 1. Database Connectivity Check on site_cms_store
    const { data: dbData, error: dbError } = await supabase
      .from('site_cms_store')
      .select('id')
      .eq('id', CMS_STORE_ID)
      .limit(1);

    const dbSuccess = !dbError;

    // 2. Storage Bucket Verification for website-media
    let storageSuccess = false;
    let storageMessage = "Bucket 'website-media' verified ✓";

    try {
      const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
      if (!listErr && buckets && buckets.some(b => b.name === MEDIA_BUCKET)) {
        storageSuccess = true;
      } else {
        // Fallback read test on website-media bucket
        const { error: bucketReadErr } = await supabase.storage.from(MEDIA_BUCKET).list('', { limit: 1 });
        if (!bucketReadErr) {
          storageSuccess = true;
        } else {
          storageMessage = bucketReadErr?.message || listErr?.message || "Bucket website-media not found";
        }
      }
    } catch (sErr) {
      storageMessage = sErr.message;
    }

    return {
      connected: dbSuccess && storageSuccess,
      auth: true,
      storage: storageSuccess,
      database: dbSuccess,
      message: dbError ? dbError.message : (!storageSuccess ? storageMessage : "Connected to Supabase Production.")
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
      .select('id, state, updated_at')
      .eq('id', CMS_STORE_ID)
      .single();

    if (error || !data) {
      console.warn("Supabase CMS fetch error:", error);
      return null;
    }
    return data.state;
  } catch (e) {
    console.warn("Supabase fetch exception:", e);
    return null;
  }
}

/**
 * Write CMS State to Supabase Database via UPSERT
 */
export async function saveCMSDataToSupabase(state) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || "NONE";
  const authenticated = user ? "YES" : "NO";

  try {
    // Clean input state object to eliminate non-serializable fields
    const cleanInputState = JSON.parse(JSON.stringify(state));

    // Fetch existing cloud state to ensure deep JSON key preservation
    const existingCloudData = await fetchCMSDataFromSupabase();

    const mergedState = existingCloudData ? {
      ...existingCloudData,
      ...cleanInputState,
      siteSettings: { ...(existingCloudData.siteSettings || {}), ...(cleanInputState.siteSettings || {}) },
      pages: { ...(existingCloudData.pages || {}), ...(cleanInputState.pages || {}) },
      sectionMedia: { ...(existingCloudData.sectionMedia || {}), ...(cleanInputState.sectionMedia || {}) },
      mediaAssets: cleanInputState.mediaAssets || existingCloudData.mediaAssets || [],
      projects: cleanInputState.projects || existingCloudData.projects || [],
      backgroundHistory: cleanInputState.backgroundHistory || existingCloudData.backgroundHistory || [],
      lastUpdated: new Date().toISOString()
    } : cleanInputState;

    const finalCleanState = JSON.parse(JSON.stringify(mergedState));

    const { error } = await supabase
      .from('site_cms_store')
      .upsert(
        { id: CMS_STORE_ID, state: finalCleanState, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

    if (error) {
      console.log(`CMS WRITE DEBUG
table: site_cms_store
operation: UPSERT
authenticated: ${authenticated}
user id: ${userId}
error code: ${error.code || "NONE"}
error message: ${error.message || "NONE"}
error details: ${error.details || "NONE"}
error hint: ${error.hint || "NONE"}`);

      throw new Error(`Supabase write failed on table [site_cms_store] during [UPSERT]. Code: ${error.code || 'UNKNOWN'}. Message: ${error.message || 'No message'}. Details: ${error.details || 'None'}. Hint: ${error.hint || 'None'}`);
    }

    console.log(`CMS WRITE DEBUG
table: site_cms_store
operation: UPSERT
authenticated: ${authenticated}
user id: ${userId}
error code: NONE
error message: NONE
error details: NONE
error hint: NONE`);

    return finalCleanState;
  } catch (e) {
    console.error("Supabase save operation exception:", e);
    throw e;
  }
}

/**
 * Inspect All Rows in site_cms_store
 */
export async function inspectCMSStoreRows() {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase.from('site_cms_store').select('id, updated_at');
    if (error || !data) return [];
    return data;
  } catch (e) {
    return [];
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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!session || !user) {
      throw new Error("Supabase storage upload failed: Session is unauthenticated.");
    }

    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminRecord) {
      console.warn("CMS Admin Record Verification Failure:", adminError?.message);
      throw new Error("Your authenticated account is not registered as a CMS administrator.");
    }

    // Direct Upload strictly to MEDIA_BUCKET ('website-media')
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
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
      .from(MEDIA_BUCKET)
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
