<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();
handleOptions();
checkAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Pouze POST'], 405);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$type = $body['type'] ?? '';

// ─── Reorder projects ──────────────────────────────────────────
if ($type === 'projects') {
    $folderNames = $body['folderNames'] ?? [];
    if (!is_array($folderNames)) jsonResponse(['error' => 'Chybí folderNames'], 400);

    // Sanitize
    $clean = array_map('basename', $folderNames);
    file_put_contents(ORDER_FILE, json_encode(array_values($clean), JSON_UNESCAPED_UNICODE));

    invalidateCache();
    jsonResponse(['success' => true]);
}

// ─── Reorder photos ───────────────────────────────────────────
if ($type === 'photos') {
    $folder    = basename($body['folder'] ?? '');
    $filenames = $body['filenames'] ?? [];

    if (!$folder) jsonResponse(['error' => 'Chybí folder'], 400);
    if (!is_array($filenames)) jsonResponse(['error' => 'Chybí filenames'], 400);

    $dir = PROJECTS_DIR . $folder;
    if (!is_dir($dir)) jsonResponse(['error' => 'Složka nenalezena'], 404);

    // Rename files to new numeric order using a temp prefix to avoid conflicts
    $tempPrefix = '_tmp_reorder_';

    // Step 1: rename all to temp names
    foreach ($filenames as $i => $name) {
        $src  = $dir . DIRECTORY_SEPARATOR . basename($name);
        $tmp  = $dir . DIRECTORY_SEPARATOR . $tempPrefix . $i . '_' . basename($name);
        if (file_exists($src)) rename($src, $tmp);
    }

    // Step 2: rename from temp to final numbered names
    foreach ($filenames as $i => $name) {
        $tmp  = $dir . DIRECTORY_SEPARATOR . $tempPrefix . $i . '_' . basename($name);
        $ext  = pathinfo($name, PATHINFO_EXTENSION);
        $base = preg_replace('/^\d+_/', '', pathinfo($name, PATHINFO_FILENAME)); // strip old prefix
        $final = $dir . DIRECTORY_SEPARATOR . sprintf('%03d_%s.%s', $i + 1, $base, $ext);
        if (file_exists($tmp)) rename($tmp, $final);
    }

    syncThumbnail($dir);
    invalidateCache();
    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Neznámý typ'], 400);
