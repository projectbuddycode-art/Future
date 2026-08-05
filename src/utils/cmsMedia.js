/**
 * Project Buddy CMS Media Normalizer & Resolver v4.0
 * Supports both Supabase Storage assets & Manual URL entries.
 * Eliminates URL parameter mutation for raw public playback compatibility.
 */

export function getMediaType(asset = {}) {
  if (!asset) return "image";

  if (asset.mediaType === "video" || asset.type === "video") return "video";
  if (asset.mediaType === "image" || asset.type === "image") return "image";

  const mime = String(
    asset.mimeType ||
    asset.mimetype ||
    asset.metadata?.mimetype ||
    asset.metadata?.contentType ||
    ""
  ).toLowerCase();

  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";

  const value = String(
    asset.storagePath ||
    asset.path ||
    asset.name ||
    asset.url ||
    asset.src ||
    ""
  ).toLowerCase().split("?")[0];

  if (/\.(mp4|webm|mov|m4v|ogg)$/i.test(value)) return "video";
  if (/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(value)) return "image";

  return "image";
}

export function getMediaUrl(asset = {}) {
  if (!asset) return "";
  return asset.url || asset.publicUrl || asset.src || "";
}

export function getVersionedMediaUrl(asset = {}) {
  return getMediaUrl(asset);
}

export function isSameAsset(a, b) {
  if (!a || !b) return false;

  const aPath = a.storagePath || a.path;
  const bPath = b.storagePath || b.path;

  if (aPath && bPath) return aPath === bPath;

  const cleanUrl = (asset) => {
    const u = getMediaUrl(asset);
    return u ? u.split("?")[0].trim() : "";
  };

  const aUrl = cleanUrl(a);
  const bUrl = cleanUrl(b);

  return Boolean(aUrl && bUrl && aUrl === bUrl);
}
