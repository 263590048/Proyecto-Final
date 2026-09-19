<?php
require_once __DIR__ . '/../config/conexion.php';

class Usuario
{
    private PDO $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function obtenerPorCorreo(string $correo): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM usuarios WHERE correo = :correo');
        $stmt->execute(['correo' => $correo]);
        $usuario = $stmt->fetch();
        return $usuario ?: null;
    }

    // TODO: registrar (RF01), actualizar, eliminar, listar (RF18 - Administrar usuarios)
    // Recuerda usar password_hash() al guardar la contraseña y password_verify() al validar el login (RF02)
}
