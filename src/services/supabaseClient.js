import { createClient } from '@supabase/supabase-js';
import { getMediaType } from '../utils/cmsMedia';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const MEDIA_BUCKET = 'website-media';
export const CMS_STORE_ID = 'main_cms_state';

// Extract configured project hostname for diagnostics
export const SUPABASE_HOSTNAME = supabaseUrl ? new URL(supabaseUrl).hostname : 'NOT_CONFIGURED';

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
 * Get Supabase Connection & Bucket Verification Status
 */
export async function getSupabaseStatus() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      auth: false,
      storage: false,
      database: false,
      hostname: SUPABASE_HOSTNAME,
      bucketFound: false,
      message: "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured."
    };
  }

  try {
    const { data: dbData, error: dbError } = await supabase
      .from('site_cms_store')
      .select('id')
      .eq('id', CMS_STORE_ID)
      .limit(1);

    const dbSuccess = !dbError;

    let storageSuccess = false;
    let storageMessage = "Bucket 'website-media' verified ✓";

    try {
      const { data: files, error: bucketReadErr } = await supabase.storage
        .from(MEDIA_BUCKET)
        .list('', { limit: 1 });

      if (!bucketReadErr) {
        storageSuccess = true;
      } else {
        storageMessage = "Storage bucket website-media was not found in the configured Supabase project.";
      }
    } catch (sErr) {
      storageMessage = sErr.message || "Storage bucket website-media check failed.";
    }

    return {
      connected: dbSuccess && storageSuccess,
      auth: true,
      storage: storageSuccess,
      database: dbSuccess,
      hostname: SUPABASE_HOSTNAME,
      bucketFound: storageSuccess,
      message: dbError ? dbError.message : (!storageSuccess ? storageMessage : "Connected to Supabase Production.")
    };
  } catch (err) {
    return {
      connected: false,
      auth: false,
      storage: false,
      database: false,
      hostname: SUPABASE_HOSTNAME,
      bucketFound: false,
      message: err.message
    };
  }
}

/**
 * Dynamically Load Discovered Media Library Assets directly from Supabase Storage
 * Generates URLs ONLY via supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath)
 */
export async function loadMediaLibraryFromStorage() {
  if (!isSupabaseConfigured || !supabase) return [];

  const foldersToScan = ['', 'home/hero-bg', 'home/workingSystem', 'general', 'home', 'services', 'systems', 'about'];
  const discoveredAssets = [];
  const seenPaths = new Set();

  for (const folder of foldersToScan) {
    try {
      const { data: files, error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (error || !files) continue;

      for (const file of files) {
        if (!file.name || file.name === '.emptyFolderPlaceholder') continue;

        const storagePath = folder ? `${folder}/${file.name}` : file.name;
        if (seenPaths.has(storagePath)) continue;
        seenPaths.add(storagePath);

        const mime = file.metadata?.mimetype || '';
        const detectedType = getMediaType({ name: file.name, mimeType: mime, storagePath });

        const { data: publicData } = supabase.storage
          .from(MEDIA_BUCKET)
          .getPublicUrl(storagePath);

        const publicUrl = publicData?.publicUrl || '';

        discoveredAssets.push({
          id: `media_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
          source: 'supabase-storage',
          name: file.name,
          url: publicUrl,
          bucket: MEDIA_BUCKET,
          storagePath: storagePath,
          type: detectedType,
          mimeType: mime || (detectedType === 'video' ? 'video/mp4' : 'image/jpeg'),
          createdAt: file.created_at || new Date().toISOString(),
          fileSize: file.metadata?.size ? `${(file.metadata.size / (1024 * 1024)).toFixed(2)} MB` : 'Asset',
          aspectRatio: "16/9",
          fit: "contain",
          alt: file.name
        });
      }
    } catch (err) {
      console.warn(`Storage list error for folder [${folder}]:`, err);
    }
  }

  return discoveredAssets;
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
 * Write CMS State to Supabase Database via UPDATE with Deep Merge & Verification
 */
export async function saveCMSDataToSupabase(state) {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { data: currentRow, error: fetchErr } = await supabase
      .from('site_cms_store')
      .select('id, state, updated_at')
      .eq('id', CMS_STORE_ID)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error(`PUBLISH DEBUG — DB fetch failed:`, fetchErr);
      throw new Error(`STAGE: CMS FETCH | TABLE: site_cms_store | OPERATION: SELECT | CODE: ${fetchErr.code || 'UNKNOWN'} | MESSAGE: ${fetchErr.message}`);
    }

    const cleanInputState = JSON.parse(JSON.stringify(state));
    const existingState = currentRow?.state || {};

    const nextState = {
      ...existingState,
      ...cleanInputState,
      siteSettings: { ...(existingState.siteSettings || {}), ...(cleanInputState.siteSettings || {}) },
      pages: { ...(existingState.pages || {}), ...(cleanInputState.pages || {}) },
      media: { ...(existingState.media || {}), ...(cleanInputState.media || {}) },
      sectionMedia: { ...(existingState.sectionMedia || {}), ...(cleanInputState.sectionMedia || {}) },
      mediaAssets: cleanInputState.mediaAssets || existingState.mediaAssets || [],
      projects: cleanInputState.projects || existingState.projects || [],
      backgroundHistory: cleanInputState.backgroundHistory || existingState.backgroundHistory || [],
      lastUpdated: new Date().toISOString()
    };

    const finalCleanState = JSON.parse(JSON.stringify(nextState));

    const { data: updatedRow, error: updateErr } = await supabase
      .from('site_cms_store')
      .update({
        state: finalCleanState,
        updated_at: new Date().toISOString()
      })
      .eq('id', CMS_STORE_ID)
      .select('id, state, updated_at')
      .single();

    if (updateErr) {
      console.error(`PUBLISH DEBUG — DB update failed:`, updateErr);
      throw new Error(`STAGE: CMS UPDATE | TABLE: site_cms_store | OPERATION: UPDATE | CODE: ${updateErr.code || 'UNKNOWN'} | MESSAGE: ${updateErr.message}`);
    }

    if (!updatedRow || updatedRow.id !== CMS_STORE_ID) {
      throw new Error(`STAGE: CMS UPDATE | TABLE: site_cms_store | OPERATION: UPDATE | CODE: NO_ROW_UPDATED | MESSAGE: Zero rows updated for ID ${CMS_STORE_ID}`);
    }

    const { data: verifiedRow, error: verifyErr } = await supabase
      .from('site_cms_store')
      .select('id, state, updated_at')
      .eq('id', CMS_STORE_ID)
      .single();

    if (verifyErr || !verifiedRow) {
      throw new Error(`STAGE: FRESH VERIFICATION | TABLE: site_cms_store | OPERATION: SELECT | CODE: ${verifyErr?.code || 'NO_DATA'} | MESSAGE: ${verifyErr?.message || 'Verification SELECT returned no data'}`);
    }

    return verifiedRow.state;
  } catch (e) {
    console.error("Supabase save operation exception:", e);
    throw e;
  }
}

/**
 * Subscribe to Live Postgres Changes on site_cms_store
 */
export function subscribeToCMSRealtime(onStateChange) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('project-buddy-public-cms')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'site_cms_store',
        filter: `id=eq.${CMS_STORE_ID}`
      },
      (payload) => {
        if (payload?.new?.state) {
          onStateChange(payload.new.state);
        }
      }
    )
    .subscribe();

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch (e) {}
  };
}

/**
 * Direct File Upload to Supabase Storage Bucket 'website-media'
 */
export async function uploadDirectFileToSupabase(file, folderPath = 'general', onProgress) {
  const isVideo = file.type.startsWith('video/') || Boolean(file.name.match(/\.(mp4|webm|mov|m4v)$/i));

  if (onProgress) onProgress(25, "Uploading to storage...");

  let publicUrl = "";
  const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `${folderPath}/${safeFilename}`;

  if (isSupabaseConfigured && supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    if (!session || !user) {
      throw new Error("Supabase storage upload failed: Session is unauthenticated.");
    }

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

    if (onProgress) onProgress(75, "Generating public URL...");

    const { data: publicData } = supabase.storage
      .from(MEDIA_BUCKET)
      .getPublicUrl(storagePath);

    publicUrl = publicData?.publicUrl || '';
  } else {
    if (onProgress) onProgress(65, "Generating local asset payload...");
    
    publicUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  if (onProgress) onProgress(100, "Ready to Publish");

  const detectedType = getMediaType({ name: file.name, mimeType: file.type });

  return {
    id: `media_${Date.now()}`,
    source: 'supabase-storage',
    name: file.name,
    url: publicUrl,
    bucket: MEDIA_BUCKET,
    storagePath,
    type: detectedType,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    mimeType: file.type || (detectedType === 'video' ? 'video/mp4' : 'image/jpeg'),
    fit: 'contain',
    alt: file.name,
    createdAt: new Date().toISOString()
  };
}
