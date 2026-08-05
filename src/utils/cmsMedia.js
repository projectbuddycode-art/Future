/**
 * Project Buddy CMS Media Normalizer & Resolver
 * Single canonical media normalizer for types, URLs, version query strings, and asset equality.
 */

export function getMediaType(asset = {}) {
  if (!asset) return "image";

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

  return asset.type === "video" ? "video" : "image";
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

  return `${url}${url.includes("?") ? "&" : "?"}cmsv=${encodeURIComponent(version)}`;
}

export function isSameAsset(a, b) {
  if (!a || !b) return false;

  const aPath = a.storagePath || a.path || a.url;
  const bPath = b.storagePath || b.path || b.url;

  return Boolean(aPath && bPath && aPath === bPath);
}
