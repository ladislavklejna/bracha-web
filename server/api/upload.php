<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();
handleOptions();
checkAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Pouze POST'], 405);
}

// Přípona se odvozuje VÝHRADNĚ z ověřeného obsahu souboru (finfo), nikdy
// z jména dodaného klientem – jinak lze nahrát např. "shell.php" s validní
// obrázkovou hlavičkou (polyglot) a spustit ho na serveru.
const EXT_MAP = [
    'image/webp' => 'webp',
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/gif'  => 'gif',
];

function detectExt(string $tmpName): ?string {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($tmpName);
    return EXT_MAP[$mime] ?? null;
}

$folder      = basename($_POST['folder'] ?? '');
$isThumbnail = ($_POST['thumbnail'] ?? '0') === '1';

if (!$folder) jsonResponse(['error' => 'Chybí folder'], 400);

$dir = PROJECTS_DIR . $folder;
if (!is_dir($dir)) jsonResponse(['error' => 'Složka nenalezena'], 404);

// ─── Jeden soubor = ruční nastavení náhledu (thumb.webp) ───────
if ($isThumbnail) {
    if (!isset($_FILES['photo'])) jsonResponse(['error' => 'Chybí soubor'], 400);
    $file = $_FILES['photo'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['error' => 'Chyba uploadu: ' . $file['error']], 400);
    }
    $ext = detectExt($file['tmp_name']);
    if ($ext === null) jsonResponse(['error' => 'Nepodporovaný formát souboru'], 400);

    $dest = $dir . DIRECTORY_SEPARATOR . 'thumb.webp';
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        jsonResponse(['error' => 'Uložení náhledu selhalo'], 500);
    }
    invalidateCache();
    jsonResponse(['success' => true, 'filename' => 'thumb.webp', 'path' => 'references/' . $folder . '/thumb.webp']);
}

// ─── Skupinový upload: originál + jeho responzivní varianty ────
// Klient posílá pole "photos[]" obsahující originál (photo.webp) a jeho
// varianty (photo_400w.webp, photo_800w.webp, …) v jednom requestu, aby
// všechny dostaly STEJNÝ číselný prefix a shodný "stem" (jinak se rozbije
// párování base↔varianta na klientovi – viz imageUtils.js).
if (isset($_FILES['photos'])) {
    $names     = (array) ($_FILES['photos']['name'] ?? []);
    $tmpNames  = (array) ($_FILES['photos']['tmp_name'] ?? []);
    $errors    = (array) ($_FILES['photos']['error'] ?? []);
    $count     = count($names);

    if ($count === 0) jsonResponse(['error' => 'Chybí soubory'], 400);

    $items = [];
    foreach ($names as $i => $origName) {
        if (($errors[$i] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            jsonResponse(['error' => 'Chyba uploadu: ' . $errors[$i]], 400);
        }
        $ext = detectExt($tmpNames[$i]);
        if ($ext === null) jsonResponse(['error' => 'Nepodporovaný formát souboru'], 400);

        $stem   = pathinfo($origName, PATHINFO_FILENAME);
        $suffix = '';
        if (preg_match('/(_\d+w)$/', $stem, $m)) {
            $suffix = $m[1];
            $stem   = substr($stem, 0, -strlen($m[1]));
        }
        $items[] = ['tmp' => $tmpNames[$i], 'ext' => $ext, 'stem' => $stem, 'suffix' => $suffix];
    }

    // Základ jména odvoď z první "plné" varianty (bez _NNNw přípony), fallback na první soubor
    $baseStem = null;
    foreach ($items as $it) {
        if ($it['suffix'] === '') { $baseStem = $it['stem']; break; }
    }
    if ($baseStem === null) $baseStem = $items[0]['stem'];
    $base = preg_replace('/[^a-z0-9_-]/i', '_', $baseStem) ?: 'foto';

    // Prefix se počítá JEDNOU za celou skupinu – jen z "plných" fotek (bez variant a bez thumb)
    $existing = glob($dir . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE) ?: [];
    $regulars = array_filter($existing, function ($f) {
        $n = basename($f);
        if (preg_match('/^thumb\.(webp|jpg|jpeg|png)$/i', $n)) return false;
        if (preg_match('/_\d+w\.(webp|jpg|jpeg|png)$/i', $n)) return false;
        return true;
    });
    $next = count($regulars) + 1;

    // Zajisti unikátnost celé skupiny (podle jména plného souboru)
    $mainExt = null;
    foreach ($items as $it) { if ($it['suffix'] === '') { $mainExt = $it['ext']; break; } }
    $mainExt ??= $items[0]['ext'];

    $suffixNum = 1;
    while (file_exists($dir . DIRECTORY_SEPARATOR . sprintf('%03d_%s.%s', $next, $base, $mainExt))) {
        $base = preg_replace('/[^a-z0-9_-]/i', '_', $baseStem) . '_' . $suffixNum++;
    }

    $saved = [];
    foreach ($items as $it) {
        $filename = sprintf('%03d_%s%s.%s', $next, $base, $it['suffix'], $it['ext']);
        $dest     = $dir . DIRECTORY_SEPARATOR . $filename;
        if (!move_uploaded_file($it['tmp'], $dest)) {
            jsonResponse(['error' => 'Uložení souboru selhalo'], 500);
        }
        $saved[] = ['filename' => $filename, 'path' => 'references/' . $folder . '/' . $filename];
    }

    syncThumbnail($dir);
    invalidateCache();
    jsonResponse(['success' => true, 'files' => $saved]);
}

jsonResponse(['error' => 'Chybí soubor'], 400);
