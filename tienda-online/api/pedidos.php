<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/PedidoController.php';

$controller = new PedidoController();
$metodo = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;
$idUsuario = isset($_GET['id_usuario']) ? (int) $_GET['id_usuario'] : null;

switch ($metodo) {
    case 'GET':
        if ($id) {
            $pedido = $controller->detalle($id);
            if (!$pedido) {
                http_response_code(404);
                echo json_encode(['error' => 'Pedido no encontrado']);
                break;
            }
            echo json_encode($pedido);
        } elseif ($idUsuario) {
            echo json_encode($controller->historial($idUsuario));
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar id o id_usuario']);
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        try {
            $nuevoId = $controller->crearPedido($datos);
            http_response_code(201);
            echo json_encode(['id_pedido' => $nuevoId]);
        } catch (InvalidArgumentException|RuntimeException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar id']);
            break;
        }
        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        try {
            $controller->actualizarEstado($id, $datos['estado'] ?? '');
            echo json_encode(['mensaje' => 'Estado del pedido actualizado']);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
