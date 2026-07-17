<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();
handleOptions();
checkAuth();

// ─── Helpers ──────────────────────────────────────────────────

function parseFolder(string $folderName): array {
    $parts    = explode('-', $folderName);
    $id       = trim($parts[0] ?? '');
    $name     = trim($parts[1] ?? '');
    $location = trim($parts[2] ?? '');
    $actions  = [];
    for ($i = 3; $i < count($parts); $i++) {
        if (trim($parts[$i]) !== '') $actions[] = trim($parts[$i]);
    }
    return compact('id', 'name', 'location', 'actions');
}

// Whitelist: písmena (vč. diakritiky), čísla, mezera, podtržítko, pomlčka.
// Odstraňuje mj. "/", "\" a "." – takže "../.." se sestavit nedá a
// buildFolderName() nemůže vytvořit/přejmenovat mimo PROJECTS_DIR.
function sanitizeSegment(string $s): string {
    $s = preg_replace('/[^\p{L}\p{N} _-]/u', '', $s) ?? '';
    return preg_replace('/\s+/', ' ', trim($s)) ?? '';
}

function buildFolderName(string $id, string $name, string $location, array $actions): string {
    $parts = [$id, sanitizeSegment($name), sanitizeSegment($location)];
    foreach ($actions as $a) {
        $clean = sanitizeSegment((string) $a);
        if ($clean !== '') $parts[] = $clean;
    }
    return implode('-', $parts);
}

function getPhotos(string $dir, string $folderName): array {
    $photos = [];
    foreach (glob($dir . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE) as $path) {
        $name = basename($path);
        // Skip thumbnails – handled separately
        if (preg_match('/^thumb\.(webp|jpg|jpeg|png)$/i', $name)) continue;
        $photos[] = ['name' => $name, 'path' => 'references/' . $folderName . '/' . $name];
    }
    usort($photos, fn($a, $b) => strcmp($a['name'], $b['name']));
    return $photos;
}

function getThumbnail(string $dir, string $folderName): ?string {
    foreach (['thumb.webp', 'thumb.jpg', 'thumb.jpeg', 'thumb.png'] as $t) {
        if (file_exists($dir . DIRECTORY_SEPARATOR . $t)) {
            return 'references/' . $folderName . '/' . $t;
        }
    }
    return null;
}

function loadOrder(): array {
    if (!file_exists(ORDER_FILE)) return [];
    return json_decode(file_get_contents(ORDER_FILE), true) ?? [];
}

function saveOrder(array $order): void {
    file_put_contents(ORDER_FILE, json_encode(array_values($order), JSON_UNESCAPED_UNICODE));
}

function listProjects(): array {
    $dirs = glob(PROJECTS_DIR . '*', GLOB_ONLYDIR);
    if ($dirs === false) return [];

    $map = [];
    foreach ($dirs as $d) {
        $fn = basename($d);
        if (str_starts_with($fn, '_')) continue; // skip _order etc.
        $map[$fn] = $d;
    }

    // Apply order
    $order   = loadOrder();
    $ordered = [];
    foreach ($order as $fn) {
        if (isset($map[$fn])) { $ordered[] = $map[$fn]; unset($map[$fn]); }
    }
    // Zbývající projekty (nejsou v _order.json) – nejnovější první
    $remaining = array_values($map);
    usort($remaining, fn($a, $b) => (int) basename($b) <=> (int) basename($a));
    foreach ($remaining as $d) { $ordered[] = $d; }

    $projects = [];
    foreach ($ordered as $dir) {
        $fn      = basename($dir);
        $parsed  = parseFolder($fn);
        $projects[] = [
            'folderName' => $fn,
            'id'         => $parsed['id'],
            'name'       => $parsed['name'],
            'location'   => $parsed['location'],
            'actions'    => $parsed['actions'],
            'thumbnail'  => getThumbnail($dir, $fn),
            'photos'     => getPhotos($dir, $fn),
        ];
    }
    return $projects;
}

// ─── Router ───────────────────────────────────────────────────

switch ($_SERVER['REQUEST_METHOD']) {

    // GET – list all projects
    case 'GET':
        jsonResponse(listProjects());

    // POST – create project
    case 'POST':
        $body     = json_decode(file_get_contents('php://input'), true) ?? [];
        $name     = trim($body['name'] ?? '');
        $location = trim($body['location'] ?? '');
        $actions  = (array) ($body['actions'] ?? []);

        if ($name === '' || sanitizeSegment($name) === '') jsonResponse(['error' => 'Název je povinný'], 400);

        // Generate next ID
        $ids = [];
        foreach (glob(PROJECTS_DIR . '*', GLOB_ONLYDIR) as $d) {
            $p = explode('-', basename($d));
            if (is_numeric($p[0])) $ids[] = (int) $p[0];
        }
        $newId = empty($ids) ? 1 : max($ids) + 1;

        $fn     = buildFolderName((string) $newId, $name, $location, $actions);
        $newDir = PROJECTS_DIR . $fn;

        if (!mkdir($newDir, 0755, true)) {
            jsonResponse(['error' => 'Nepodařilo se vytvořit složku'], 500);
        }

        // Prepend to order – newest first
        $order   = loadOrder();
        array_unshift($order, $fn);
        saveOrder($order);
        invalidateCache();

        jsonResponse(['folderName' => $fn, 'id' => (string) $newId, 'name' => $name, 'location' => $location, 'actions' => $actions], 201);

    // PUT – update project metadata (may rename folder)
    case 'PUT':
        $folder = basename($_GET['folder'] ?? '');
        if (!$folder) jsonResponse(['error' => 'Chybí parametr folder'], 400);

        $oldDir = PROJECTS_DIR . $folder;
        if (!is_dir($oldDir)) jsonResponse(['error' => 'Složka nenalezena'], 404);

        $body     = json_decode(file_get_contents('php://input'), true) ?? [];
        $parsed   = parseFolder($folder);
        $name     = trim($body['name'] ?? $parsed['name']);
        $location = trim($body['location'] ?? $parsed['location']);
        $actions  = (array) ($body['actions'] ?? $parsed['actions']);

        $newFn  = buildFolderName($parsed['id'], $name, $location, $actions);
        $newDir = PROJECTS_DIR . $newFn;

        if ($oldDir !== $newDir) {
            if (is_dir($newDir)) jsonResponse(['error' => 'Složka s tímto názvem již existuje'], 409);
            if (!rename($oldDir, $newDir)) jsonResponse(['error' => 'Přejmenování selhalo'], 500);

            // Update order file
            $order = loadOrder();
            $order = array_map(fn($f) => $f === $folder ? $newFn : $f, $order);
            saveOrder($order);
        }

        invalidateCache();
        jsonResponse(['folderName' => $newFn, 'id' => $parsed['id'], 'name' => $name, 'location' => $location, 'actions' => $actions]);

    // DELETE – remove project and all its files
    case 'DELETE':
        $folder = basename($_GET['folder'] ?? '');
        if (!$folder) jsonResponse(['error' => 'Chybí parametr folder'], 400);

        $dir = PROJECTS_DIR . $folder;
        if (!is_dir($dir)) jsonResponse(['error' => 'Složka nenalezena'], 404);

        $failed = [];
        foreach (glob($dir . '/*') as $file) {
            if (is_file($file) && !unlink($file)) {
                $failed[] = basename($file);
            }
        }
        if (!empty($failed)) {
            jsonResponse(['error' => 'Nepodařilo se smazat soubory: ' . implode(', ', $failed)], 500);
        }
        if (!rmdir($dir)) {
            jsonResponse(['error' => 'Nepodařilo se smazat složku projektu'], 500);
        }

        // Remove from order
        $order = array_values(array_filter(loadOrder(), fn($f) => $f !== $folder));
        saveOrder($order);
        invalidateCache();

        jsonResponse(['success' => true]);

    default:
        jsonResponse(['error' => 'Metoda není podporována'], 405);
}
