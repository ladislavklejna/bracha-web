// Responsive breakpoints (px) – variants are generated only if original is wider
const RESPONSIVE_WIDTHS = [400, 800, 1200];
// Hard cap for regular photos
const MAX_FULL_WIDTH = 1920;
// Thumbnails are only ever shown as small grid tiles (max ~480 px CSS × 2× DPR = 960 px)
const THUMB_MAX_WIDTH = 800;
const THUMB_RESPONSIVE_WIDTHS = [400];

/**
 * Converts an image File to a single WebP File at original resolution (capped at 1920 px).
 * Kept for backwards-compat; prefer generateResponsiveWebP for uploads.
 */
export const convertToWebP = (file, quality = 0.88) =>
  generateResponsiveWebP(file, quality).then((variants) => variants[0]);

/**
 * Generates a full-size WebP + smaller responsive variants for a given image File.
 *
 * Naming convention:
 *   photo.webp          – full size (capped at MAX_FULL_WIDTH)
 *   photo_400w.webp     – 400 px wide variant  (only if original > 400 px)
 *   photo_800w.webp     – 800 px wide variant  (only if original > 800 px)
 *   photo_1200w.webp    – 1200 px wide variant (only if original > 1200 px)
 *
 * @param {File} file     - Input image (any format)
 * @param {number} quality - WebP quality 0–1 (default 0.82)
 * @returns {Promise<File[]>} Array of WebP Files: [fullSize, ...variants]
 */
export const generateResponsiveWebP = (file, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const ratio = origH / origW;

      // Thumbnails need much smaller caps – grid tiles are never wider than ~480 px CSS
      const isThumb = baseName.toLowerCase().startsWith('thumb');
      const maxFull = isThumb ? THUMB_MAX_WIDTH : MAX_FULL_WIDTH;
      const variants = isThumb ? THUMB_RESPONSIVE_WIDTHS : RESPONSIVE_WIDTHS;

      const jobs = [];

      // Full size (capped)
      const fullW = Math.min(origW, maxFull);
      jobs.push({ w: fullW, h: Math.round(fullW * ratio), name: `${baseName}.webp` });

      // Responsive variants – only if strictly narrower than original
      for (const w of variants) {
        if (w < origW) {
          jobs.push({ w, h: Math.round(w * ratio), name: `${baseName}_${w}w.webp` });
        }
      }

      Promise.allSettled(jobs.map(({ w, h, name }) => resizeToWebP(img, w, h, name, quality)))
        .then((results) => {
          const fulfilled = results
            .filter((r) => r.status === 'fulfilled')
            .map((r) => r.value);
          if (fulfilled.length === 0) {
            reject(new Error('Žádnou variantu se nepodařilo vytvořit'));
          } else {
            resolve(fulfilled);
          }
        });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Nepodařilo se načíst obrázek'));
    };

    img.src = url;
  });
};

/**
 * Returns true if the filename is a responsive variant (e.g. "photo_800w.webp").
 */
export const isResponsiveVariant = (name) => /_\d+w\.webp$/.test(name);

/**
 * Given a base photo path (e.g. "https://…/photo.webp") and the full photos array
 * for a project, returns a srcset string for use in <img srcSet="…">.
 * Returns null if no variants are found.
 */
export const buildSrcset = (basePath, allPhotos) => {
  const stem = basePath.replace(/\.webp$/, '');
  const variants = [];

  for (const photo of allPhotos) {
    const m = photo.path.match(/_(\d+)w\.webp$/);
    if (m && photo.path.startsWith(`${stem}_`)) {
      variants.push({ path: photo.path, width: parseInt(m[1], 10) });
    }
  }

  if (variants.length === 0) return null;

  variants.sort((a, b) => a.width - b.width);
  const parts = variants.map((v) => `${v.path} ${v.width}w`);
  parts.push(`${basePath} ${MAX_FULL_WIDTH}w`);
  return parts.join(', ');
};

/**
 * Picks the best-quality URL for a photo based on target pixel width.
 * Falls back to basePath if no variants exist.
 */
export const getOptimalUrl = (basePath, allPhotos, targetPx) => {
  const stem = basePath.replace(/\.webp$/, '');
  const variants = [];

  for (const photo of allPhotos) {
    const m = photo.path.match(/_(\d+)w\.webp$/);
    if (m && photo.path.startsWith(`${stem}_`)) {
      variants.push({ path: photo.path, width: parseInt(m[1], 10) });
    }
  }

  if (variants.length === 0) return basePath;
  variants.sort((a, b) => a.width - b.width);
  const best = variants.find((v) => v.width >= targetPx);
  return best ? best.path : basePath;
};

/* ─── Internal helper ─────────────────────────────────────────── */
function resizeToWebP(img, width, height, filename, quality) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error(`Konverze ${filename} selhala`)); return; }
        resolve(new File([blob], filename, { type: 'image/webp' }));
      },
      'image/webp',
      quality,
    );
  });
}
