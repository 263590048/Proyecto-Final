<?php
require_once __DIR__ . '/../config/conexion.php';

class Resena
{
    private PDO $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    // RF07/RF14: solo puede reseñar quien ya compró el producto
    public function usuarioComproProducto(int $idUsuario, int $idProducto): bool
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) FROM detalle_pedido dp
             JOIN pedidos p ON p.id_pedido = dp.id_pedido
             WHERE p.id_usuario = :id_usuario AND dp.id_producto = :id_producto'
        );
        $stmt->execute(['id_usuario' => $idUsuario, 'id_producto' => $idProducto]);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function crear(array $datos): int
    {
        $idUsuario = (int) ($datos['id_usuario'] ?? 0);
        $idProducto = (int) ($datos['id_producto'] ?? 0);
        $calificacion = (int) ($datos['calificacion'] ?? 0);
        $comentario = $datos['comentario'] ?? null;

        if ($idUsuario <= 0 || $idProducto <= 0) {
            throw new InvalidArgumentException('Debe indicar id_usuario e id_producto');
        }
        if ($calificacion < 1 || $calificacion > 5) {
            throw new InvalidArgumentException('La calificación debe estar entre 1 y 5');
        }
        if (!$this->usuarioComproProducto($idUsuario, $idProducto)) {
            throw new RuntimeException('Solo puedes reseñar productos que hayas comprado');
        }

        $stmt = $this->pdo->prepare(
            'INSERT INTO resenas (id_usuario, id_producto, calificacion, comentario)
             VALUES (:id_usuario, :id_producto, :calificacion, :comentario)'
        );
        $stmt->execute([
            'id_usuario' => $idUsuario,
            'id_producto' => $idProducto,
            'calificacion' => $calificacion,
            'comentario' => $comentario,
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function obtenerPorProducto(int $idProducto): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT r.id_resena, r.id_usuario, r.id_producto, r.calificacion, r.comentario, r.fecha,
                    u.nombre, u.apellido
             FROM resenas r
             JOIN usuarios u ON u.id_usuario = r.id_usuario
             WHERE r.id_producto = :id_producto
             ORDER BY r.fecha DESC'
        );
        $stmt->execute(['id_producto' => $idProducto]);
        return $stmt->fetchAll();
    }

    // Todas las reseñas de la tienda, con el producto y su categoría (página resenas.php)
    public function obtenerTodas(): array
    {
        $stmt = $this->pdo->query(
            'SELECT r.id_resena, r.id_producto, r.calificacion, r.comentario, r.fecha,
                    u.nombre, u.apellido,
                    p.nombre AS producto, p.imagen, c.nombre AS categoria
             FROM resenas r
             JOIN usuarios u ON u.id_usuario = r.id_usuario
             JOIN productos p ON p.id_producto = r.id_producto
             JOIN categorias c ON c.id_categoria = p.id_categoria
             ORDER BY r.fecha DESC'
        );
        return $stmt->fetchAll();
    }

    // Promedio general y cuántas reseñas hay de cada calificación (5 a 1)
    public function obtenerResumenGeneral(): array
    {
        $stmt = $this->pdo->query(
            'SELECT calificacion, COUNT(*) AS cantidad FROM resenas GROUP BY calificacion'
        );
        $distribucion = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
        foreach ($stmt->fetchAll() as $fila) {
            $distribucion[(int) $fila['calificacion']] = (int) $fila['cantidad'];
        }

        $total = array_sum($distribucion);
        $suma = 0;
        foreach ($distribucion as $estrellas => $cantidad) {
            $suma += $estrellas * $cantidad;
        }

        return [
            'total' => $total,
            'promedio' => $total > 0 ? round($suma / $total, 1) : null,
            'distribucion' => $distribucion,
        ];
    }

    public function obtenerResumen(int $idProducto): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) AS total, AVG(calificacion) AS promedio
             FROM resenas WHERE id_producto = :id_producto'
        );
        $stmt->execute(['id_producto' => $idProducto]);
        $resumen = $stmt->fetch();

        return [
            'total' => (int) $resumen['total'],
            'promedio' => $resumen['promedio'] !== null ? round((float) $resumen['promedio'], 1) : null,
        ];
    }
}
