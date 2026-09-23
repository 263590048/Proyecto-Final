<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controller/PedidoController.php';

session_start();

function esAdministrador(): bool
{
    return ($_SESSION['tipo_usuario'] ?? null) === 'administrador';
}

$controller = new PedidoController();
$metodo = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

switch ($metodo) {
    case 'GET':
        if ($id) {
            $pedido = $controller->detalle($id);
            if (!$pedido) {
                http_response_code(404);
                echo json_encode(['error' => 'Pedido no encontrado']);
                break;
            }
            $esDueno = ($_SESSION['id_usuario'] ?? null) == $pedido['id_usuario'];
            if (!$esDueno && !esAdministrador()) {
                http_response_code(403);
                echo json_encode(['error' => 'No tienes acceso a este pedido']);
                break;
            }
            echo json_encode($pedido);
        } elseif (isset($_GET['todos'])) {
            // RF13: listado completo, para el panel de administración
            if (!esAdministrador()) {
                http_response_code(403);
                echo json_encode(['error' => 'Acceso restringido a administradores']);
                break;
            }
            echo json_encode($controller->listarTodos());
        } else {
            // RF12: historial del cliente autenticado
            if (empty($_SESSION['id_usuario'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Debes iniciar sesión para ver tus pedidos']);
                break;
            }
            echo json_encode($controller->historial((int) $_SESSION['id_usuario']));
        }
        break;

    case 'POST':
        // RF11: registrar pedido a partir del carrito del cliente autenticado
        if (empty($_SESSION['id_usuario'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Debes iniciar sesión para completar la compra']);
            break;
        }

        $datos = json_decode(file_get_contents('php://input'), true) ?? [];
        $datos['id_usuario'] = (int) $_SESSION['id_usuario'];

        try {
            $nuevoId = $controller->crearPedido($datos);
            http_response_code(201);
            echo json_encode(['id_pedido' => $nuevoId]);
        } catch (PagoRechazadoException $e) {
            // RF13: 402 Payment Required cuando la pasarela rechaza el cobro
            http_response_code(402);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (InvalidArgumentException|RuntimeException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // RF13: solo un administrador avanza el estado de un pedido (pagado, enviado, ...)
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
