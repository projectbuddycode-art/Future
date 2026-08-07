/**
 * Project Buddy CMS Media Normalizer & Resolver v5.0 — Realtime Production Engine
 * Supports Supabase Storage assets & Manual URL entries with instant version cache-busting.
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
  const url = getMediaUrl(asset);
  if (!url) return "";

  const version =
    asset.updatedAt ||
    asset.updated_at ||
    asset.version ||
    asset.createdAt ||
    "";

  if (!version) return url;

  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(version)}`;
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

/**
 * Universal CMS Slot Resolver
 * Checks cmsState.media and cmsState.sectionMedia for slotId or colon alias, returning fallback if absent.
 */
export function resolveCmsMedia(cmsState, slotId, fallback = null) {
  if (!cmsState) return fallback;

  const colonAlias = slotId.includes('.')
    ? slotId.replace(/\./g, ':')
    : slotId.replace(/:/g, '.');

  const directMedia = cmsState.media?.[slotId] || cmsState.media?.[colonAlias];
  if (directMedia && (directMedia.url || directMedia.src)) {
    return directMedia;
  }

  const sectionMedia = cmsState.sectionMedia?.[slotId] || cmsState.sectionMedia?.[colonAlias];
  if (sectionMedia && (sectionMedia.url || sectionMedia.src)) {
    return sectionMedia;
  }

  return fallback;
}
