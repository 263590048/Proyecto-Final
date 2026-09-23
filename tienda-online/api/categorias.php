<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/CategoriaController.php';

session_start();

function esAdministrador(): bool
{
    return ($_SESSION['tipo_usuario'] ?? null) === 'administrador';
}

$controller = new CategoriaController();
$metodo = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

switch ($metodo) {
    case 'GET':
        // Consultar categorías es público, no requiere sesión
        if ($id) {
            $categoria = $controller->detalle($id);
            if (!$categoria) {
                http_response_code(404);
                echo json_encode(['error' => 'Categoría no encontrada']);
                break;
            }
            echo json_encode($categoria);
        } else {
            echo json_encode($controller->listar());
        }
        break;

    // RF17: administrar categorías (solo administradores)
    case 'POST':
        if (!esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso restringido a administradores']);
            break;
        }
        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        try {
            $nuevoId = $controller->crear($datos);
            http_response_code(201);
            echo json_encode(['id_categoria' => $nuevoId]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (!esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso restringido a administradores']);
            break;
        }
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar id']);
            break;
        }
        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        try {
            $controller->actualizar($id, $datos);
            echo json_encode(['mensaje' => 'Categoría actualizada']);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        if (!esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso restringido a administradores']);
            break;
        }
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar id']);
            break;
        }
        $controller->eliminar($id);
        echo json_encode(['mensaje' => 'Categoría eliminada']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
