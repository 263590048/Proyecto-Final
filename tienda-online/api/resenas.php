<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/ResenaController.php';

session_start();

function esAdministrador(): bool
{
    return ($_SESSION['tipo_usuario'] ?? null) === 'administrador';
}

$controller = new ResenaController();
$metodo = $_SERVER['REQUEST_METHOD'];
$idProducto = isset($_GET['id_producto']) ? (int) $_GET['id_producto'] : null;

switch ($metodo) {
    case 'GET':
        // Listar reseñas es público, no requiere sesión
        if (!$idProducto) {
            // Sin id_producto: todas las reseñas de la tienda (página resenas.php)
            echo json_encode($controller->listarTodas());
            break;
        }
        $datos = $controller->listarPorProducto($idProducto);
        $datos['puede_resenar'] = !empty($_SESSION['id_usuario'])
            && $controller->puedeResenar((int) $_SESSION['id_usuario'], $idProducto);
        echo json_encode($datos);
        break;

    case 'POST':
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Debes iniciar sesión para dejar una reseña']);
            break;
        }

        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        $datos['id_usuario'] = (int) $_SESSION['id_usuario'];

        try {
            $nuevoId = $controller->crear($datos);
            http_response_code(201);
            echo json_encode(['id_resena' => $nuevoId]);
        } catch (InvalidArgumentException|RuntimeException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // Moderación: solo un administrador elimina reseñas
    case 'DELETE':
        if (!esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso restringido a administradores']);
            break;
        }
        $idResena = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if (!$idResena) {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar id']);
            break;
        }
        if (!$controller->eliminar($idResena)) {
            http_response_code(404);
            echo json_encode(['error' => 'Reseña no encontrada']);
            break;
        }
        echo json_encode(['mensaje' => 'Reseña eliminada']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
