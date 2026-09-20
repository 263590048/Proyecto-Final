<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/ResenaController.php';

$controller = new ResenaController();
$metodo = $_SERVER['REQUEST_METHOD'];
$idProducto = isset($_GET['id_producto']) ? (int) $_GET['id_producto'] : null;

switch ($metodo) {
    case 'GET':
        if (!$idProducto) {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar id_producto']);
            break;
        }
        echo json_encode($controller->listarPorProducto($idProducto));
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        try {
            $nuevoId = $controller->crear($datos);
            http_response_code(201);
            echo json_encode(['id_resena' => $nuevoId]);
        } catch (InvalidArgumentException|RuntimeException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
