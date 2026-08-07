import { createClient } from '@supabase/supabase-js';
import { getMediaType } from '../utils/cmsMedia';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const MEDIA_BUCKET = 'website-media';
export const CMS_STORE_ID = 'main_cms_state';

export const SUPABASE_HOSTNAME = supabaseUrl ? new URL(supabaseUrl).hostname : 'NOT_CONFIGURED';

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
 * Recursive Storage File Discovery — Filters out directories and non-media entries
 */
export async function listStorageFilesRecursive(bucket, folderPath = '', seen = new Set()) {
  if (!isSupabaseConfigured || !supabase) return [];
  const fileAssets = [];

  try {
    const { data: items, error } = await supabase.storage
      .from(bucket)
      .list(folderPath, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error || !items) return fileAssets;

    for (const item of items) {
      if (!item.name || item.name === '.emptyFolderPlaceholder') continue;

      const currentPath = folderPath ? `${folderPath}/${item.name}` : item.name;

      // Check if item is a folder / prefix
      const isFolder = (!item.id && !item.metadata) || (!item.metadata?.mimetype && !item.name.includes('.'));

      if (isFolder) {
        if (!seen.has(currentPath)) {
          seen.add(currentPath);
          const subFiles = await listStorageFilesRecursive(bucket, currentPath, seen);
          fileAssets.push(...subFiles);
        }
      } else {
        const mime = item.metadata?.mimetype || '';
        const hasMediaExt = Boolean(item.name.match(/\.(mp4|webm|mov|m4v|ogg|png|jpe?g|webp|gif|avif|svg)$/i));
        const hasMediaMime = mime.startsWith('video/') || mime.startsWith('image/');

        // Skip folders or non-media files without extension or mime
        if (!hasMediaExt && !hasMediaMime) continue;

        if (seen.has(currentPath)) continue;
        seen.add(currentPath);

        const detectedType = getMediaType({ name: item.name, mimeType: mime, storagePath: currentPath });

        const { data: publicData } = supabase.storage
          .from(bucket)
          .getPublicUrl(currentPath);

        const publicUrl = publicData?.publicUrl || '';

        fileAssets.push({
          id: `media_${item.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
          source: 'supabase-storage',
          name: item.name,
          url: publicUrl,
          bucket: bucket,
          storagePath: currentPath,
          type: detectedType,
          mimeType: mime || (detectedType === 'video' ? 'video/mp4' : 'image/jpeg'),
          createdAt: item.created_at || new Date().toISOString(),
          fileSize: item.metadata?.size ? `${(item.metadata.size / (1024 * 1024)).toFixed(2)} MB` : 'Asset',
          aspectRatio: "16/9",
          fit: "contain",
          alt: item.name
        });
      }
    }
  } catch (err) {
    console.warn(`Storage list error for [${folderPath}]:`, err);
  }

  return fileAssets;
}

/**
 * Dynamically Load Discovered Media Library Assets directly from Supabase Storage
 */
export async function loadMediaLibraryFromStorage() {
  if (!isSupabaseConfigured || !supabase) return [];
  return await listStorageFilesRecursive(MEDIA_BUCKET, '');
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
