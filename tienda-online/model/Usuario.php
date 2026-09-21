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

    public function obtenerPorId(int $id): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id_usuario, nombre, apellido, correo, telefono, direccion, tipo_usuario, creado_en
             FROM usuarios WHERE id_usuario = :id'
        );
        $stmt->execute(['id' => $id]);
        $usuario = $stmt->fetch();
        return $usuario ?: null;
    }

    // RF18: listar usuarios registrados (sin exponer la contraseña)
    public function obtenerTodos(): array
    {
        $stmt = $this->pdo->query(
            'SELECT id_usuario, nombre, apellido, correo, telefono, direccion, tipo_usuario, creado_en
             FROM usuarios ORDER BY creado_en DESC'
        );
        return $stmt->fetchAll();
    }

    // RF01: crea la cuenta con la contraseña hasheada
    public function registrar(array $datos): int
    {
        if ($this->obtenerPorCorreo($datos['correo'])) {
            throw new InvalidArgumentException('Ya existe una cuenta con ese correo');
        }

        $sql = 'INSERT INTO usuarios (nombre, apellido, correo, password, telefono, direccion, tipo_usuario)
                VALUES (:nombre, :apellido, :correo, :password, :telefono, :direccion, :tipo_usuario)';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'nombre' => $datos['nombre'],
            'apellido' => $datos['apellido'],
            'correo' => $datos['correo'],
            'password' => password_hash($datos['password'], PASSWORD_DEFAULT),
            'telefono' => $datos['telefono'] ?? null,
            'direccion' => $datos['direccion'] ?? null,
            'tipo_usuario' => $datos['tipo_usuario'] ?? 'cliente',
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    // RF02: valida las credenciales y devuelve el usuario sin la contraseña
    public function verificarCredenciales(string $correo, string $password): ?array
    {
        $usuario = $this->obtenerPorCorreo($correo);

        if (!$usuario || !password_verify($password, $usuario['password'])) {
            return null;
        }

        unset($usuario['password']);
        return $usuario;
    }

    // RF18: actualiza los datos de un usuario (uso desde el panel de administración)
    public function actualizar(int $id, array $datos): bool
    {
        $campos = ['nombre', 'apellido', 'correo', 'telefono', 'direccion', 'tipo_usuario'];
        $sets = [];
        $params = ['id' => $id];

        foreach ($campos as $campo) {
            if (array_key_exists($campo, $datos)) {
                $sets[] = "$campo = :$campo";
                $params[$campo] = $datos[$campo] !== '' ? $datos[$campo] : null;
            }
        }

        if (!empty($datos['password'])) {
            $sets[] = 'password = :password';
            $params['password'] = password_hash($datos['password'], PASSWORD_DEFAULT);
        }

        if (empty($sets)) {
            return false;
        }

        $sql = 'UPDATE usuarios SET ' . implode(', ', $sets) . ' WHERE id_usuario = :id';
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }

    // RF18: elimina un usuario
    public function eliminar(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM usuarios WHERE id_usuario = :id');
        return $stmt->execute(['id' => $id]);
    }
}
