<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/UsuarioController.php';

session_start();

function esAdministrador(): bool
{
    return ($_SESSION['tipo_usuario'] ?? null) === 'administrador';
}

$controller = new UsuarioController();
$metodo = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

switch ($metodo) {
    // RF18: listar/consultar usuarios (solo administradores)
    case 'GET':
        if (!esAdministrador()) {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso restringido a administradores']);
            break;
        }

        if ($id) {
            $usuario = $controller->detalle($id);
            if (!$usuario) {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
                break;
            }
            echo json_encode($usuario);
        } else {
            echo json_encode($controller->listar());
        }
        break;

    // RF01: registro público de una cuenta nueva
    // RF18: un administrador también crea usuarios desde el panel y puede elegir su tipo
    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        if (!esAdministrador()) {
            // El registro público siempre crea clientes, aunque se envíe otro tipo_usuario
            $datos['tipo_usuario'] = 'cliente';
        } elseif (!in_array($datos['tipo_usuario'] ?? 'cliente', ['cliente', 'administrador'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de usuario inválido']);
            break;
        }
        try {
            $nuevoId = $controller->registrar($datos);
            http_response_code(201);
            echo json_encode(['id_usuario' => $nuevoId]);
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // RF18: actualizar un usuario (solo administradores)
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
        $controller->actualizar($id, $datos);
        echo json_encode(['mensaje' => 'Usuario actualizado']);
        break;

    // RF18: eliminar un usuario (solo administradores)
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
        echo json_encode(['mensaje' => 'Usuario eliminado']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
