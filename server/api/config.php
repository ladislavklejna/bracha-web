<?php
// ─── Konfigurace admin API ─────────────────────────────────────
// Změňte API_KEY na náhodný dlouhý řetězec a stejnou hodnotu
// uložte do .env jako REACT_APP_ADMIN_API_KEY=...
define('API_KEY', 'ladalenkahaninelibabidedemia1990199620182023');

define('PROJECTS_DIR', __DIR__ . '/../../public/references' . DIRECTORY_SEPARATOR);
define('ORDER_FILE',   PROJECTS_DIR . '_order.json');
define('CACHE_FILE',   __DIR__ . '/../cache/projects.json');

// ─── CORS ─────────────────────────────────────────────────────
function setCorsHeaders(): void {
    $origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = ['http://localhost:3000', 'https://www.arapro.cz', 'https://arapro.cz'];
    if (in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Api-Key');
    header('Content-Type: application/json; charset=UTF-8');
}

// ─── Auth ──────────────────────────────────────────────────────
function checkAuth(): void {
    $key = $_SERVER['HTTP_X_API_KEY'] ?? '';
    if ($key !== API_KEY) {
        http_response_code(401);
        echo json_encode(['error' => 'Neautorizováno'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// ─── OPTIONS preflight ─────────────────────────────────────────
function handleOptions(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ─── Cache invalidation ────────────────────────────────────────
function invalidateCache(): void {
    if (file_exists(CACHE_FILE)) {
        unlink(CACHE_FILE);
    }
}

// ─── Sync thumbnail = první fotka v galerii ───────────────────
// Volat po každém reorderu, uploadu nebo smazání fotky.
function syncThumbnail(string $dir): void {
    $photos = glob($dir . DIRECTORY_SEPARATOR . '*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);
    if ($photos === false) return;

    // Odfiltruj thumb.*
    $gallery = array_filter($photos, fn($f) => !preg_match('/[\\/\\\\]thumb\.(webp|jpg|jpeg|png)$/i', $f));
    sort($gallery); // abecední pořadí = číselné díky prefixům 001_, 002_…

    $thumb = $dir . DIRECTORY_SEPARATOR . 'thumb.webp';

    if (empty($gallery)) {
        if (file_exists($thumb)) unlink($thumb);
        return;
    }

    copy(reset($gallery), $thumb);
}

// ─── JSON response helper ──────────────────────────────────────
function jsonResponse(mixed $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
