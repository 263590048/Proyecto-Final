<?php
require_once __DIR__ . '/../config/conexion.php';

class Wishlist
{
    private PDO $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    private function existe(int $idUsuario, int $idProducto): bool
    {
        $stmt = $this->pdo->prepare(
            'SELECT id_wishlist FROM wishlist WHERE id_usuario = :id_usuario AND id_producto = :id_producto'
        );
        $stmt->execute(['id_usuario' => $idUsuario, 'id_producto' => $idProducto]);
        return (bool) $stmt->fetchColumn();
    }

    public function agregar(array $datos): int
    {
        $idUsuario = (int) ($datos['id_usuario'] ?? 0);
        $idProducto = (int) ($datos['id_producto'] ?? 0);

        if ($idUsuario <= 0 || $idProducto <= 0) {
            throw new InvalidArgumentException('Debe indicar id_usuario e id_producto');
        }

        if ($this->existe($idUsuario, $idProducto)) {
            throw new RuntimeException('El producto ya está en la lista de deseos');
        }

        $stmt = $this->pdo->prepare(
            'INSERT INTO wishlist (id_usuario, id_producto) VALUES (:id_usuario, :id_producto)'
        );
        $stmt->execute(['id_usuario' => $idUsuario, 'id_producto' => $idProducto]);

        return (int) $this->pdo->lastInsertId();
    }

    public function eliminar(int $idUsuario, int $idProducto): bool
    {
        $stmt = $this->pdo->prepare(
            'DELETE FROM wishlist WHERE id_usuario = :id_usuario AND id_producto = :id_producto'
        );
        return $stmt->execute(['id_usuario' => $idUsuario, 'id_producto' => $idProducto]);
    }

    public function obtenerPorUsuario(int $idUsuario): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT w.id_wishlist, p.id_producto, p.nombre, p.precio, p.precio_oferta, p.imagen, p.estado
             FROM wishlist w
             JOIN productos p ON p.id_producto = w.id_producto
             WHERE w.id_usuario = :id_usuario'
        );
        $stmt->execute(['id_usuario' => $idUsuario]);
        return $stmt->fetchAll();
    }
}
