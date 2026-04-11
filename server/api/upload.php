<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();
handleOptions();
checkAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Pouze POST'], 405);
}

$folder      = basename($_POST['folder'] ?? '');
$isThumbnail = ($_POST['thumbnail'] ?? '0') === '1';

if (!$folder) jsonResponse(['error' => 'Chybí folder'], 400);
if (!isset($_FILES['photo'])) jsonResponse(['error' => 'Chybí soubor'], 400);

$dir = PROJECTS_DIR . $folder;
if (!is_dir($dir)) jsonResponse(['error' => 'Složka nenalezena'], 404);

$file = $_FILES['photo'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['error' => 'Chyba uploadu: ' . $file['error']], 400);
}

// Validate MIME type
$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);
$allowed  = ['image/webp', 'image/jpeg', 'image/png', 'image/gif'];
if (!in_array($mimeType, $allowed, true)) {
    jsonResponse(['error' => 'Nepodporovaný formát souboru'], 400);
}

if ($isThumbnail) {
    // Save as thumb.webp (overwrite existing)
    $dest = $dir . DIRECTORY_SEPARATOR . 'thumb.webp';
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        jsonResponse(['error' => 'Uložení náhledu selhalo'], 500);
    }
    invalidateCache();
    jsonResponse(['success' => true, 'filename' => 'thumb.webp', 'path' => 'references/' . $folder . '/thumb.webp']);
}

// Regular photo – assign next numeric prefix
$existing = glob($dir . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE) ?: [];
$regulars = array_filter($existing, fn($f) => !preg_match('/[\\/\\\\]thumb\.(webp|jpg|jpeg|png)$/i', $f));
$next     = count($regulars) + 1;

$ext      = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'webp';
$base     = preg_replace('/[^a-z0-9_-]/i', '_', pathinfo($file['name'], PATHINFO_FILENAME));
$filename = sprintf('%03d_%s.%s', $next, $base, $ext);
$dest     = $dir . DIRECTORY_SEPARATOR . $filename;

// Ensure unique filename
$counter = 1;
while (file_exists($dest)) {
    $filename = sprintf('%03d_%s_%d.%s', $next, $base, $counter++, $ext);
    $dest     = $dir . DIRECTORY_SEPARATOR . $filename;
}

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    jsonResponse(['error' => 'Uložení souboru selhalo'], 500);
}

syncThumbnail($dir);
invalidateCache();
jsonResponse([
    'success'  => true,
    'filename' => $filename,
    'path'     => 'references/' . $folder . '/' . $filename,
]);
