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

    // TODO: crear, actualizar, eliminar (RF17 - Administrar categorías)
}
