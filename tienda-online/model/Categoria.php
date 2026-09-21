<?php
require_once __DIR__ . '/../config/conexion.php';

class Categoria
{
    private PDO $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function obtenerTodas(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM categorias');
        return $stmt->fetchAll();
    }

    public function obtenerPorId(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM categorias WHERE id_categoria = :id');
        $stmt->execute(['id' => $id]);
        $categoria = $stmt->fetch();
        return $categoria ?: null;
    }

    // RF17: administrar categorías
    public function crear(array $datos): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO categorias (nombre, descripcion) VALUES (:nombre, :descripcion)'
        );
        $stmt->execute([
            'nombre' => $datos['nombre'],
            'descripcion' => $datos['descripcion'] ?? null,
        ]);
        return (int) $this->pdo->lastInsertId();
    }

    public function actualizar(int $id, array $datos): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE categorias SET nombre = :nombre, descripcion = :descripcion WHERE id_categoria = :id'
        );
        return $stmt->execute([
            'nombre' => $datos['nombre'],
            'descripcion' => $datos['descripcion'] ?? null,
            'id' => $id,
        ]);
    }

    public function eliminar(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM categorias WHERE id_categoria = :id');
        return $stmt->execute(['id' => $id]);
    }
}
