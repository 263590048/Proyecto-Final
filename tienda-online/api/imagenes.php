<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/ProductoController.php';

session_start();

function esAdministrador(): bool
{
    return ($_SESSION['tipo_usuario'] ?? null) === 'administrador';
}

$controller = new ProductoController();

// RF16: subir la imagen de un producto (multipart/form-data, campo "imagen"); solo administradores
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

if (!esAdministrador()) {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso restringido a administradores']);
    exit;
}

try {
    $ruta = $controller->subirImagen($_FILES['imagen'] ?? []);
    http_response_code(201);
    echo json_encode(['imagen' => $ruta]);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} catch (RuntimeException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
