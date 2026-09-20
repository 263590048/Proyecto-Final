<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/WishlistController.php';

$controller = new WishlistController();
$metodo = $_SERVER['REQUEST_METHOD'];
$idUsuario = isset($_GET['id_usuario']) ? (int) $_GET['id_usuario'] : null;
$idProducto = isset($_GET['id_producto']) ? (int) $_GET['id_producto'] : null;

switch ($metodo) {
    case 'GET':
        if (!$idUsuario) {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar id_usuario']);
            break;
        }
        echo json_encode($controller->listar($idUsuario));
        break;

    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        try {
            $nuevoId = $controller->agregar($datos);
            http_response_code(201);
            echo json_encode(['id_wishlist' => $nuevoId]);
        } catch (InvalidArgumentException|RuntimeException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        if (!$idUsuario || !$idProducto) {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar id_usuario e id_producto']);
            break;
        }
        $controller->eliminar($idUsuario, $idProducto);
        echo json_encode(['mensaje' => 'Producto eliminado de la lista de deseos']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
