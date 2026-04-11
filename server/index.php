<?php

$projectsDirectory = '../public/references/';
$cacheFile = __DIR__ . '/cache/projects.json';
$cacheTime = 31536000; // server cache = 1 rok


function readProjects()
{
    global $projectsDirectory;

    $dirs = glob($projectsDirectory . '*', GLOB_ONLYDIR);
    if (!$dirs) return [];

    $projectMap = [];
    foreach ($dirs as $projectDirectory) {
        $projectName = basename($projectDirectory);
        if (str_starts_with($projectName, '_')) continue; // skip _order.json dir

        $photos = [];
        foreach (glob($projectDirectory . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE) as $photoPath) {
            $photoName = basename($photoPath);
            $relPath   = str_replace('../public/', '', $photoPath);
            $photos[]  = ['name' => $photoName, 'path' => $relPath];
        }
        // Sort photos by filename so numeric prefixes give correct order
        usort($photos, fn($a, $b) => strcmp($a['name'], $b['name']));

        $parts    = explode('-', $projectName);
        $id       = trim($parts[0] ?? '');
        $name     = trim($parts[1] ?? '');
        $location = trim($parts[2] ?? '');
        $actions  = [];
        for ($i = 3; $i < count($parts); $i++) {
            if (trim($parts[$i]) !== '') $actions[] = trim($parts[$i]);
        }

        $projectMap[$projectName] = [
            'id'       => $id,
            'name'     => $name,
            'location' => $location,
            'actions'  => $actions,
            'photos'   => $photos,
        ];
    }

    // Respect admin ordering if _order.json exists
    $orderFile = $projectsDirectory . '_order.json';
    if (file_exists($orderFile)) {
        $order   = json_decode(file_get_contents($orderFile), true) ?? [];
        $ordered = [];
        foreach ($order as $fn) {
            if (isset($projectMap[$fn])) {
                $ordered[] = $projectMap[$fn];
                unset($projectMap[$fn]);
            }
        }
        // Zbývající bez záznamu v _order.json – nejnovější první
        $remaining = array_values($projectMap);
        usort($remaining, fn($a, $b) => (int)$b['id'] <=> (int)$a['id']);
        foreach ($remaining as $p) { $ordered[] = $p; }
        return $ordered;
    }

    // Žádný _order.json – nejnovější první podle ID
    $result = array_values($projectMap);
    usort($result, fn($a, $b) => (int)$b['id'] <=> (int)$a['id']);
    return $result;
}

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Pomocná funkce: nejnovější mtime ze složky projektů (rekurzivně přes podadresáře)
function getProjectsMtime() {
    global $projectsDirectory;
    $mtime = file_exists($projectsDirectory) ? filemtime($projectsDirectory) : 0;
    foreach (glob($projectsDirectory . '*', GLOB_ONLYDIR) as $dir) {
        $mtime = max($mtime, filemtime($dir));
    }
    return $mtime;
}

// Lehký endpoint: jen datum změny (klient ověřuje bez stahování dat)
if (isset($_GET['modified'])) {
    echo json_encode(['modified' => getProjectsMtime()]);
    exit;
}

// HTTP cache – říkej prohlížeči, ať vždy revaliduje (my řídíme cache přes mtime)
header("Cache-Control: no-cache");

// SERVER CACHE (soubor) – platí dokud se nezmění mtime složky
$projectsMtime = getProjectsMtime();
if (file_exists($cacheFile) && filemtime($cacheFile) >= $projectsMtime) {
    echo file_get_contents($cacheFile);
    exit;
}

// pokud cache neexistuje → vygeneruj data
$data = json_encode(readProjects());

// vytvoř složku cache pokud neexistuje
if (!is_dir(dirname($cacheFile))) {
    mkdir(dirname($cacheFile), 0777, true);
}

// ulož do cache
file_put_contents($cacheFile, $data);

// vrať data
echo $data;