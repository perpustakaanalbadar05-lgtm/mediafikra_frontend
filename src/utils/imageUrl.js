/**
 * Converts a relative image path from the API into a full URL.
 *
 * Supports:
 *  - /img/...      -> new system: files served directly by Apache from public/img/
 *  - /storage/...  -> legacy system: files in storage/app/public/ (needs symlink or fallback)
 *  - http(s)://... -> already absolute, returned as-is
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api')
    .replace('/api', '');

  return `${base}${path}`;
};
