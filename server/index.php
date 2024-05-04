<?php

// Adresa složky s projekty
$projectsDirectory = '../public/references/';

// Funkce pro čtení názvů podsložek a cest k fotkám
function readProjects()
{
    global $projectsDirectory;

    $projects = [];

    // Procházíme obsah složky s projekty
    foreach (glob($projectsDirectory . '*', GLOB_ONLYDIR) as $projectDirectory) {
        $projectName = basename($projectDirectory); // Název podsložky

        // Inicializujeme pole pro fotky v projektu
        $photos = [];

        // Procházíme obsah podsložky s fotkami
        foreach (glob($projectDirectory . '/*.{jpg,jpeg,png,gif}', GLOB_BRACE) as $photoPath) {
            $photoName = basename($photoPath); // Název fotky
            // Odstraníme část cesty "../public/"
            $photoPath = str_replace('../public/', '', $photoPath);
            $photos[] = ['name' => $photoName, 'path' => $photoPath]; // Přidáme fotku do pole
        }

        // Rozdělíme název projektu na jednotlivé části podle oddělovačů
        $parts = explode('-', $projectName);
        $id = trim($parts[0]);
        $name = trim($parts[1]);
        $location = trim($parts[2]);
        $length = count($parts);
        $actions = [];

        // Loop prochází indexy pole od 3 do délky pole - 1
        for ($i = 3; $i < $length; $i++) {
            // Přidání každého prvku s indexem větším než 3 do pole $actions
            $actions[] = trim($parts[$i]);
        }


        // Přidáme název projektu, ID, ukony a pole s fotkami do výsledného pole
        $projectData = ['id' => $id, 'name' => $name, 'location' => $location, 'actions' => $actions, 'photos' => $photos];
        $projects[] = $projectData;
    }

    return $projects;
}

/// Nastavení CORS hlaviček pro povolení přístupu z libovolného zdroje
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Volání funkce a vrácení výsledku jako JSON
header('Content-Type: application/json');
echo json_encode(readProjects());
// echo (readProjects());
