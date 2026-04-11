<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();
handleOptions();
checkAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Pouze POST'], 405);
}

$body     = json_decode(file_get_contents('php://input'), true) ?? [];
$folder   = basename($body['folder'] ?? '');
$filename = basename($body['filename'] ?? '');

if (!$folder || !$filename) jsonResponse(['error' => 'Chybí folder nebo filename'], 400);

$dir  = PROJECTS_DIR . $folder;
$src  = $dir . DIRECTORY_SEPARATOR . $filename;
$dest = $dir . DIRECTORY_SEPARATOR . 'thumb.webp';

if (!is_dir($dir))   jsonResponse(['error' => 'Složka nenalezena'], 404);
if (!file_exists($src)) jsonResponse(['error' => 'Soubor nenalezen'], 404);

// Copy the file to thumb.webp (keep original in gallery)
if (!copy($src, $dest)) {
    jsonResponse(['error' => 'Kopírování selhalo'], 500);
}

invalidateCache();
jsonResponse(['success' => true, 'thumbnail' => 'references/' . $folder . '/thumb.webp']);
