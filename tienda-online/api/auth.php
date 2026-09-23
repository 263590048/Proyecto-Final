<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/UsuarioController.php';

session_start();

$controller = new UsuarioController();
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    // RF02: inicia sesión con correo y contraseña
    case 'POST':
        $datos = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($datos['correo']) || empty($datos['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Debe indicar correo y password']);
            break;
        }

        try {
            $usuario = $controller->login($datos['correo'], $datos['password']);
            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['tipo_usuario'] = $usuario['tipo_usuario'];
            echo json_encode($usuario);
        } catch (RuntimeException $e) {
            http_response_code(401);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    // Devuelve el usuario de la sesión activa (para que el frontend sepa si hay alguien logueado)
    case 'GET':
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['error' => 'No hay sesión activa']);
            break;
        }
        $usuario = $controller->detalle((int) $_SESSION['id_usuario']);
        if (!$usuario) {
            // La cuenta se eliminó mientras la sesión seguía abierta
            $_SESSION = [];
            session_destroy();
            http_response_code(401);
            echo json_encode(['error' => 'No hay sesión activa']);
            break;
        }
        echo json_encode($usuario);
        break;

    // RF02: cierra sesión
    case 'DELETE':
        $_SESSION = [];
        session_destroy();
        echo json_encode(['mensaje' => 'Sesión cerrada']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
