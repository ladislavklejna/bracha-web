<?php
// ─── Ověření Firebase ID tokenu ────────────────────────────────
// Nahrazuje statický X-Api-Key: admin API teď důvěřuje jen
// platně podepsanému Firebase ID tokenu přihlášeného uživatele.
// Bez externích knihoven – RS256 podpis ověřen proti veřejným
// certifikátům Google (cachovaným lokálně).

define('FIREBASE_PROJECT_ID', 'arapro-3c152');
define('FIREBASE_CERTS_CACHE', __DIR__ . '/../cache/google_certs.json');
define('FIREBASE_CERTS_URL', 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
define('FIREBASE_CERTS_TTL', 3600);

class FirebaseAuthException extends Exception {}

function base64UrlDecode(string $data): string {
    $remainder = strlen($data) % 4;
    if ($remainder) $data .= str_repeat('=', 4 - $remainder);
    return base64_decode(strtr($data, '-_', '+/')) ?: '';
}

function fetchGoogleCerts(bool $forceRefresh = false): array {
    if (!$forceRefresh && file_exists(FIREBASE_CERTS_CACHE)) {
        $cached = json_decode(file_get_contents(FIREBASE_CERTS_CACHE), true);
        if (is_array($cached) && ($cached['fetchedAt'] ?? 0) + FIREBASE_CERTS_TTL > time()) {
            return $cached['certs'] ?? [];
        }
    }

    $json = null;
    if (function_exists('curl_init')) {
        $ch = curl_init(FIREBASE_CERTS_URL);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 5,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $json = curl_exec($ch);
        curl_close($ch);
    } else {
        $json = @file_get_contents(FIREBASE_CERTS_URL);
    }

    $certs = $json ? (json_decode($json, true) ?: []) : [];

    if (!empty($certs)) {
        @file_put_contents(FIREBASE_CERTS_CACHE, json_encode(['fetchedAt' => time(), 'certs' => $certs]));
        return $certs;
    }

    // Čerstvý fetch selhal (výpadek sítě) – použij starší cache, je lepší než nic
    if (file_exists(FIREBASE_CERTS_CACHE)) {
        $cached = json_decode(file_get_contents(FIREBASE_CERTS_CACHE), true);
        return $cached['certs'] ?? [];
    }

    return [];
}

// Vrací dekódovaný payload tokenu, nebo vyhodí FirebaseAuthException
function verifyFirebaseIdToken(string $idToken): array {
    $parts = explode('.', $idToken);
    if (count($parts) !== 3) throw new FirebaseAuthException('Neplatný formát tokenu');

    [$headerB64, $payloadB64, $sigB64] = $parts;
    $header  = json_decode(base64UrlDecode($headerB64), true);
    $payload = json_decode(base64UrlDecode($payloadB64), true);
    $sig     = base64UrlDecode($sigB64);

    if (!is_array($header) || !is_array($payload)) throw new FirebaseAuthException('Neplatný token');
    if (($header['alg'] ?? '') !== 'RS256') throw new FirebaseAuthException('Nepodporovaný algoritmus');

    $kid = $header['kid'] ?? '';
    if (!$kid) throw new FirebaseAuthException('Chybí kid');

    $certs = fetchGoogleCerts();
    if (!isset($certs[$kid])) {
        // Klíč mohl právě rotovat – jedno vynucené obnovení cache
        $certs = fetchGoogleCerts(true);
    }
    if (!isset($certs[$kid])) throw new FirebaseAuthException('Neznámý podpisový klíč');

    $publicKey = openssl_pkey_get_public($certs[$kid]);
    if (!$publicKey) throw new FirebaseAuthException('Neplatný certifikát');

    $signedData = $headerB64 . '.' . $payloadB64;
    $verified   = openssl_verify($signedData, $sig, $publicKey, OPENSSL_ALGO_SHA256);
    if ($verified !== 1) throw new FirebaseAuthException('Neplatný podpis tokenu');

    $now = time();
    if (($payload['exp'] ?? 0) < $now) throw new FirebaseAuthException('Token vypršel');
    if (($payload['iat'] ?? PHP_INT_MAX) > $now + 60) throw new FirebaseAuthException('Token z budoucnosti');
    if (($payload['aud'] ?? '') !== FIREBASE_PROJECT_ID) throw new FirebaseAuthException('Neplatný aud');
    if (($payload['iss'] ?? '') !== 'https://securetoken.google.com/' . FIREBASE_PROJECT_ID) throw new FirebaseAuthException('Neplatný iss');
    if (empty($payload['sub'])) throw new FirebaseAuthException('Chybí sub');

    return $payload;
}
