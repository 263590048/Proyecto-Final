<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../model/Categoria.php';

$modelo = new Categoria();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($modelo->obtenerTodas());
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
