<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/UsuarioController.php';

$controller = new UsuarioController();
$metodo = $_SERVER['REQUEST_METHOD'];
$datos = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($metodo) {
    // Solicitar el enlace de recuperación (público)
    case 'POST':
        try {
            $enlace = $controller->solicitarRecuperacion(trim((string) ($datos['correo'] ?? '')));
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
            break;
        }

        // Misma respuesta exista o no el correo, para no revelar qué cuentas están registradas
        $respuesta = ['mensaje' => 'Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Vence en 30 minutos.'];
        if ($enlace) {
            // Solo en modo desarrollo: el enlace se devuelve para mostrarlo en pantalla
            $respuesta['enlace_desarrollo'] = $enlace;
        }
        echo json_encode($respuesta);
        break;

    // Fijar la nueva contraseña con el token del enlace
    case 'PUT':
        try {
            $controller->restablecerPassword(
                (string) ($datos['token'] ?? ''),
                (string) ($datos['password'] ?? ''),
                (string) ($datos['confirmacion'] ?? '')
            );
            echo json_encode(['mensaje' => 'Tu contraseña se actualizó. Ya puedes iniciar sesión.']);
        } catch (InvalidArgumentException|RuntimeException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
