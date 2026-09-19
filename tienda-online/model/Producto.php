<?php
require_once __DIR__ . '/../config/conexion.php';

class Producto
{
    private PDO $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function obtenerTodos(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM productos WHERE estado = "activo"');
        return $stmt->fetchAll();
    }

    public function obtenerPorId(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM productos WHERE id_producto = :id');
        $stmt->execute(['id' => $id]);
        $producto = $stmt->fetch();
        return $producto ?: null;
    }

    private function normalizarDatos(array $datos): array
    {
        foreach (['precio_oferta', 'imagen2'] as $campo) {
            $datos[$campo] = $datos[$campo] ?? null;
            if ($datos[$campo] === '') {
                $datos[$campo] = null;
            }
        }
        return $datos;
    }

    public function crear(array $datos): int
    {
        $datos = $this->normalizarDatos($datos);

        $sql = 'INSERT INTO productos (id_categoria, nombre, descripcion, precio, precio_oferta, cantidad, imagen, imagen2, estado)
                VALUES (:id_categoria, :nombre, :descripcion, :precio, :precio_oferta, :cantidad, :imagen, :imagen2, :estado)';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($datos);
        return (int) $this->pdo->lastInsertId();
    }

    public function actualizar(int $id, array $datos): bool
    {
        $datos = $this->normalizarDatos($datos);

        $sql = 'UPDATE productos
                SET id_categoria = :id_categoria, nombre = :nombre, descripcion = :descripcion,
                    precio = :precio, precio_oferta = :precio_oferta, cantidad = :cantidad,
                    imagen = :imagen, imagen2 = :imagen2, estado = :estado
                WHERE id_producto = :id';
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($datos + ['id' => $id]);
    }

    public function eliminar(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM productos WHERE id_producto = :id');
        return $stmt->execute(['id' => $id]);
    }
}
