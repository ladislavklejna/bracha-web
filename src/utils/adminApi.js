import { auth } from '../firebase';

const BASE =
  process.env.REACT_APP_ADMIN_API_URL ||
  'https://www.arapro.cz/server/api';

const PORTFOLIO_CACHE_KEY = 'arapro_portfolio_v2';

function clearPortfolioCache() {
  try {
    localStorage.removeItem(PORTFOLIO_CACHE_KEY);
  } catch {}
}

// Admin API je chráněné Firebase ID tokenem přihlášeného uživatele
// (server ho ověřuje v server/api/firebase_auth.php), ne sdíleným klíčem.
async function authHeader() {
  const user = auth.currentUser;
  if (!user) throw new Error('Nejste přihlášeni');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function jsonHeaders() {
  return { 'Content-Type': 'application/json', ...(await authHeader()) };
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
  getProjects: async () =>
    request(`${BASE}/projects.php`, { headers: await jsonHeaders() }),

  createProject: async (data) =>
    mutate(`${BASE}/projects.php`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    }),

  updateProject: async (folder, data) =>
    mutate(`${BASE}/projects.php?folder=${encodeURIComponent(folder)}`, {
      method: 'PUT',
      headers: await jsonHeaders(),
      body: JSON.stringify(data),
    }),

  deleteProject: async (folder) =>
    mutate(`${BASE}/projects.php?folder=${encodeURIComponent(folder)}`, {
      method: 'DELETE',
      headers: await jsonHeaders(),
    }),

  // Ruční nastavení náhledu jedním souborem (thumb.webp)
  uploadPhoto: async (folder, file, isThumbnail = false) => {
    const fd = new FormData();
    fd.append('folder', folder);
    fd.append('photo', file, file.name);
    fd.append('thumbnail', isThumbnail ? '1' : '0');
    return mutate(`${BASE}/upload.php`, {
      method: 'POST',
      headers: await authHeader(),
      body: fd,
    });
  },

  // Skupinový upload jedné fotky + jejích responzivních variant (400w/800w/1200w)
  // v jednom requestu – server jim přidělí shodný číselný prefix a stem.
  uploadPhotoGroup: async (folder, files) => {
    const fd = new FormData();
    fd.append('folder', folder);
    for (const file of files) fd.append('photos[]', file, file.name);
    return mutate(`${BASE}/upload.php`, {
      method: 'POST',
      headers: await authHeader(),
      body: fd,
    });
  },

  setThumbnail: async (folder, filename) =>
    mutate(`${BASE}/set_thumbnail.php`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ folder, filename }),
    }),

  deletePhoto: async (folder, filename) =>
    mutate(
      `${BASE}/delete_photo.php?folder=${encodeURIComponent(folder)}&filename=${encodeURIComponent(filename)}`,
      { method: 'DELETE', headers: await jsonHeaders() }
    ),

  reorderPhotos: async (folder, filenames) =>
    mutate(`${BASE}/reorder.php`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ type: 'photos', folder, filenames }),
    }),

  reorderProjects: async (folderNames) =>
    mutate(`${BASE}/reorder.php`, {
      method: 'POST',
      headers: await jsonHeaders(),
      body: JSON.stringify({ type: 'projects', folderNames }),
    }),
};
