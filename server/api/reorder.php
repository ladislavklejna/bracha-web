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

function findVariantsFor(array $entries, string $stem): array {
    $out = [];
    foreach ($entries as $entry) {
        if (preg_match('/^' . preg_quote($stem, '/') . '_(\d+)w\.(jpg|jpeg|png|gif|webp)$/i', $entry, $m)) {
            $out[] = ['name' => $entry, 'width' => $m[1], 'ext' => $m[2]];
        }
    }
    return $out;
}

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
// $filenames obsahuje jen "base" fotky (bez _NNNw variant a bez thumb.*).
// Každá base fotka musí táhnout své responzivní varianty s sebou se stejným
// novým prefixem, jinak se rozbije párování base↔varianta na klientovi.
if ($type === 'photos') {
    $folder    = basename($body['folder'] ?? '');
    $filenames = $body['filenames'] ?? [];

    if (!$folder) jsonResponse(['error' => 'Chybí folder'], 400);
    if (!is_array($filenames)) jsonResponse(['error' => 'Chybí filenames'], 400);

    $dir = PROJECTS_DIR . $folder;
    if (!is_dir($dir)) jsonResponse(['error' => 'Složka nenalezena'], 404);

    $entries = scandir($dir) ?: [];

    $tempPrefix = '_tmp_reorder_';
    $moves      = []; // [tmpPath, finalPath]

    // Step 1: rename base + jeho varianty na dočasné názvy (aby nekolidovaly)
    foreach ($filenames as $i => $name) {
        $name = basename($name);
        $src  = $dir . DIRECTORY_SEPARATOR . $name;
        if (!file_exists($src)) continue;

        $ext     = pathinfo($name, PATHINFO_EXTENSION);
        $oldStem = pathinfo($name, PATHINFO_FILENAME);
        $newBase = preg_replace('/^\d+_/', '', $oldStem); // strip old numeric prefix
        $newPrefix = sprintf('%03d', $i + 1);

        $variants = findVariantsFor($entries, $oldStem);

        $tmpBase = $dir . DIRECTORY_SEPARATOR . $tempPrefix . $i . '_base.' . $ext;
        if (rename($src, $tmpBase)) {
            $moves[] = [$tmpBase, $dir . DIRECTORY_SEPARATOR . $newPrefix . '_' . $newBase . '.' . $ext];
        }

        foreach ($variants as $vIdx => $v) {
            $srcV = $dir . DIRECTORY_SEPARATOR . $v['name'];
            $tmpV = $dir . DIRECTORY_SEPARATOR . $tempPrefix . $i . '_v' . $vIdx . '.' . $v['ext'];
            if (rename($srcV, $tmpV)) {
                $moves[] = [$tmpV, $dir . DIRECTORY_SEPARATOR . $newPrefix . '_' . $newBase . '_' . $v['width'] . 'w.' . $v['ext']];
            }
        }
    }

    // Step 2: rename from temp to final numbered names
    foreach ($moves as [$tmp, $final]) {
        if (file_exists($tmp)) rename($tmp, $final);
    }

    syncThumbnail($dir);
    invalidateCache();
    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Neznámý typ'], 400);
