<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/ProductoController.php';

session_start();

function esAdministrador(): bool
{
    return ($_SESSION['tipo_usuario'] ?? null) === 'administrador';
}

$controller = new ProductoController();
$metodo = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

switch ($metodo) {
    case 'GET':
        // Consultar el catálogo es público, no requiere sesión.
        // Un producto inactivo solo lo ve el administrador.
        if ($id) {
            $producto = $controller->detalle($id);
            if (!$producto || ($producto['estado'] !== 'activo' && !esAdministrador())) {
                http_response_code(404);
                echo json_encode(['error' => 'Producto no encontrado']);
                break;
            }
            echo json_encode($producto);
        } else {
            // ?todos: el panel admin lista también los productos inactivos
            echo json_encode($controller->listar(isset($_GET['todos']) && esAdministrador()));
        }
        break;

    case 'POST':
        if (!esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso restringido a administradores']);
            break;
        }
        $datos = json_decode(file_get_contents('php://input'), true);
        $nuevoId = $controller->crear($datos);
        http_response_code(201);
        echo json_encode(['id_producto' => $nuevoId]);
        break;

    case 'PUT':
        if (!esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso restringido a administradores']);
            break;
        }
        $datos = json_decode(file_get_contents('php://input'), true);
        $controller->actualizar($id, $datos);
        echo json_encode(['mensaje' => 'Producto actualizado']);
        break;

    case 'DELETE':
        if (!esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso restringido a administradores']);
            break;
        }
        $controller->eliminar($id);
        echo json_encode(['mensaje' => 'Producto eliminado']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
