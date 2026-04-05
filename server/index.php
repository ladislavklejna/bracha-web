<?php

$projectsDirectory = '../public/references/';
$cacheFile = __DIR__ . '/cache/projects.json';
$cacheTime = 31536000; // server cache = 1 rok


function readProjects()
{
    global $projectsDirectory;

    $projects = [];

    foreach (glob($projectsDirectory . '*', GLOB_ONLYDIR) as $projectDirectory) {
        $projectName = basename($projectDirectory);

        $photos = [];

        foreach (glob($projectDirectory . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE) as $photoPath) {
            $photoName = basename($photoPath);
            $photoPath = str_replace('../public/', '', $photoPath);

            $photos[] = [
                'name' => $photoName,
                'path' => $photoPath
            ];
        }

        $parts = explode('-', $projectName);
        $id = trim($parts[0] ?? '');
        $name = trim($parts[1] ?? '');
        $location = trim($parts[2] ?? '');

        $actions = [];
        for ($i = 3; $i < count($parts); $i++) {
            $actions[] = trim($parts[$i]);
        }

        $projects[] = [
            'id' => $id,
            'name' => $name,
            'location' => $location,
            'actions' => $actions,
            'photos' => $photos
        ];
    }

    return $projects;
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