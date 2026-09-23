<?php
require_once __DIR__ . '/../config/conexion.php';
require_once __DIR__ . '/Pago.php';

class Pedido
{
    private PDO $pdo;

    private const ESTADOS_VALIDOS = ['pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado'];

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    // RF11: registra el pedido junto con su detalle en una sola transacción.
    // El precio de cada línea se toma del producto en base de datos (no del cliente)
    // y se valida/descuenta el stock disponible para evitar sobreventa.
    // RF13: el cobro se hace dentro de la misma transacción; si el pago se rechaza,
    // se hace rollback y no queda ni el pedido ni el stock descontado.
    public function crear(array $datos): int
    {
        $idUsuario = (int) ($datos['id_usuario'] ?? 0);
        $items = $datos['items'] ?? [];
        $direccionEnvio = trim((string) ($datos['direccion_envio'] ?? ''));
        $telefonoContacto = trim((string) ($datos['telefono_contacto'] ?? ''));
        $metodoPago = (string) ($datos['metodo_pago'] ?? '');

        if ($idUsuario <= 0) {
            throw new InvalidArgumentException('Debe indicar id_usuario');
        }
        if (!is_array($items) || count($items) === 0) {
            throw new InvalidArgumentException('El pedido debe incluir al menos un producto');
        }
        if ($direccionEnvio === '') {
            throw new InvalidArgumentException('Debe indicar la dirección de envío');
        }
        if ($telefonoContacto !== '' && !preg_match('/^[\d\s+\-]{8,20}$/', $telefonoContacto)) {
            throw new InvalidArgumentException('El teléfono de contacto no es válido');
        }

        $this->pdo->beginTransaction();

        try {
            $stmtProducto = $this->pdo->prepare(
                'SELECT precio, precio_oferta, cantidad FROM productos WHERE id_producto = :id FOR UPDATE'
            );
            $stmtDescontar = $this->pdo->prepare(
                'UPDATE productos SET cantidad = cantidad - :cantidad WHERE id_producto = :id'
            );
            $stmtDetalle = $this->pdo->prepare(
                'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio)
                 VALUES (:id_pedido, :id_producto, :cantidad, :precio)'
            );

            $lineas = [];
            $total = 0.0;

            foreach ($items as $item) {
                $idProducto = (int) ($item['id_producto'] ?? 0);
                $cantidad = (int) ($item['cantidad'] ?? 0);

                if ($idProducto <= 0 || $cantidad <= 0) {
                    throw new InvalidArgumentException('Cada producto del pedido necesita id_producto y cantidad válidos');
                }

                $stmtProducto->execute(['id' => $idProducto]);
                $producto = $stmtProducto->fetch();

                if (!$producto) {
                    throw new InvalidArgumentException("El producto {$idProducto} no existe");
                }
                if ((int) $producto['cantidad'] < $cantidad) {
                    throw new RuntimeException("Stock insuficiente para el producto {$idProducto}");
                }

                $precioUnitario = (float) ($producto['precio_oferta'] ?? $producto['precio']);
                $total += $precioUnitario * $cantidad;

                $lineas[] = [
                    'id_producto' => $idProducto,
                    'cantidad' => $cantidad,
                    'precio' => $precioUnitario,
                ];
            }

            $pago = (new Pago())->procesar($metodoPago, $datos['tarjeta'] ?? [], $total);

            $stmtPedido = $this->pdo->prepare(
                'INSERT INTO pedidos (id_usuario, total, estado, metodo_pago, referencia_pago, direccion_envio, telefono_contacto)
                 VALUES (:id_usuario, :total, :estado, :metodo_pago, :referencia_pago, :direccion_envio, :telefono_contacto)'
            );
            $stmtPedido->execute([
                'id_usuario' => $idUsuario,
                'total' => $total,
                'estado' => $pago['estado'],
                'metodo_pago' => $metodoPago,
                'referencia_pago' => $pago['referencia'],
                'direccion_envio' => $direccionEnvio,
                'telefono_contacto' => $telefonoContacto !== '' ? $telefonoContacto : null,
            ]);
            $idPedido = (int) $this->pdo->lastInsertId();

            foreach ($lineas as $linea) {
                $stmtDetalle->execute([
                    'id_pedido' => $idPedido,
                    'id_producto' => $linea['id_producto'],
                    'cantidad' => $linea['cantidad'],
                    'precio' => $linea['precio'],
                ]);
                $stmtDescontar->execute([
                    'cantidad' => $linea['cantidad'],
                    'id' => $linea['id_producto'],
                ]);
            }

            $this->pdo->commit();
            return $idPedido;
        } catch (Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    // RF12: historial de pedidos de un usuario
    public function obtenerPorUsuario(int $idUsuario): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM pedidos WHERE id_usuario = :id_usuario ORDER BY fecha DESC'
        );
        $stmt->execute(['id_usuario' => $idUsuario]);
        return $stmt->fetchAll();
    }

    // RF13: todos los pedidos, para el panel de administración
    public function obtenerTodos(): array
    {
        $stmt = $this->pdo->query(
            'SELECT p.*, u.nombre, u.apellido, u.correo
             FROM pedidos p
             JOIN usuarios u ON u.id_usuario = p.id_usuario
             ORDER BY p.fecha DESC'
        );
        return $stmt->fetchAll();
    }

    // RF12: detalle de un pedido con sus productos
    public function obtenerPorId(int $idPedido): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM pedidos WHERE id_pedido = :id');
        $stmt->execute(['id' => $idPedido]);
        $pedido = $stmt->fetch();

        if (!$pedido) {
            return null;
        }

        $stmtItems = $this->pdo->prepare(
            'SELECT dp.id_producto, dp.cantidad, dp.precio, p.nombre, p.imagen
             FROM detalle_pedido dp
             JOIN productos p ON p.id_producto = dp.id_producto
             WHERE dp.id_pedido = :id_pedido'
        );
        $stmtItems->execute(['id_pedido' => $idPedido]);
        $pedido['items'] = $stmtItems->fetchAll();

        return $pedido;
    }

    // RF13: actualiza el estado del pedido (por ejemplo, tras confirmar el pago)
    public function actualizarEstado(int $idPedido, string $estado): bool
    {
        if (!in_array($estado, self::ESTADOS_VALIDOS, true)) {
            throw new InvalidArgumentException('Estado de pedido inválido');
        }

        $stmt = $this->pdo->prepare('UPDATE pedidos SET estado = :estado WHERE id_pedido = :id');
        return $stmt->execute(['estado' => $estado, 'id' => $idPedido]);
    }
}
