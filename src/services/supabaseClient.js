import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
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
      message: "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured. Using local fallback engine."
    };
  }

  try {
    const { data, error } = await supabase.from('media_assets').select('id').limit(1);
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
 * Falls back to DataURL/Blob storage if Supabase credentials are missing
 */
export async function uploadDirectFileToSupabase(file, folderPath = 'general', onProgress) {
  const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i);
  
  // 1. Extract metadata
  const meta = isVideo
    ? await extractVideoMetadata(file)
    : await extractImageMetadata(file);

  // Simulate progress steps
  if (onProgress) onProgress(25, "Uploading to storage...");

  let publicUrl = "";
  const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `${folderPath}/${safeFilename}`;

  if (isSupabaseConfigured && supabase) {
    // Supabase Upload
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
    // Fallback DataURL generator for local offline preview/testing
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
