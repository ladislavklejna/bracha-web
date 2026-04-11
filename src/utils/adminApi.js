const BASE =
  process.env.REACT_APP_ADMIN_API_URL ||
  'https://www.arapro.cz/server/api';
const KEY = process.env.REACT_APP_ADMIN_API_KEY || '';

const PORTFOLIO_CACHE_KEY = 'arapro_portfolio_v2';

const jsonHeaders = {
  'Content-Type': 'application/json',
  'X-Api-Key': KEY,
};

function clearPortfolioCache() {
  try {
    localStorage.removeItem(PORTFOLIO_CACHE_KEY);
  } catch {}
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Požadavek vypršel (timeout 10 s)');
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Mutace – po úspěchu vždy smaže localStorage cache portfolia
async function mutate(url, options = {}) {
  const data = await request(url, options);
  clearPortfolioCache();
  return data;
}

export const adminApi = {
  getProjects: () =>
    request(`${BASE}/projects.php`, { headers: jsonHeaders }),

  createProject: (data) =>
    mutate(`${BASE}/projects.php`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  updateProject: (folder, data) =>
    mutate(`${BASE}/projects.php?folder=${encodeURIComponent(folder)}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  deleteProject: (folder) =>
    mutate(`${BASE}/projects.php?folder=${encodeURIComponent(folder)}`, {
      method: 'DELETE',
      headers: jsonHeaders,
    }),

  uploadPhoto: (folder, file, isThumbnail = false) => {
    const fd = new FormData();
    fd.append('folder', folder);
    fd.append('photo', file, file.name);
    fd.append('thumbnail', isThumbnail ? '1' : '0');
    return mutate(`${BASE}/upload.php`, {
      method: 'POST',
      headers: { 'X-Api-Key': KEY },
      body: fd,
    });
  },

  setThumbnail: (folder, filename) =>
    mutate(`${BASE}/set_thumbnail.php`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ folder, filename }),
    }),

  deletePhoto: (folder, filename) =>
    mutate(
      `${BASE}/delete_photo.php?folder=${encodeURIComponent(folder)}&filename=${encodeURIComponent(filename)}`,
      { method: 'DELETE', headers: jsonHeaders }
    ),

  reorderPhotos: (folder, filenames) =>
    mutate(`${BASE}/reorder.php`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ type: 'photos', folder, filenames }),
    }),

  reorderProjects: (folderNames) =>
    mutate(`${BASE}/reorder.php`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ type: 'projects', folderNames }),
    }),
};
