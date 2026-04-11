<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();
handleOptions();
checkAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(['error' => 'Pouze DELETE'], 405);
}

$folder   = basename($_GET['folder'] ?? '');
$filename = basename($_GET['filename'] ?? '');

if (!$folder || !$filename) jsonResponse(['error' => 'Chybí folder nebo filename'], 400);

// Prevent deleting thumbnail via this endpoint
if (preg_match('/^thumb\.(webp|jpg|jpeg|png)$/i', $filename)) {
    jsonResponse(['error' => 'Náhled smažte přes nahrání nového'], 400);
}

$path = PROJECTS_DIR . $folder . DIRECTORY_SEPARATOR . $filename;
if (!file_exists($path)) jsonResponse(['error' => 'Soubor nenalezen'], 404);

unlink($path);
syncThumbnail(PROJECTS_DIR . $folder);
invalidateCache();
jsonResponse(['success' => true]);
