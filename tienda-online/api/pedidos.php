<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/PedidoController.php';

$controller = new PedidoController();
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'POST':
        // TODO: leer php://input, llamar $controller->crearPedido(), responder JSON -> RF11
        http_response_code(501);
        echo json_encode(['error' => 'Pendiente de implementar']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
