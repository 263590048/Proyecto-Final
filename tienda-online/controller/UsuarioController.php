<?php
require_once __DIR__ . '/../model/Usuario.php';

class UsuarioController
{
    private Usuario $modelo;

    public function __construct()
    {
        $this->modelo = new Usuario();
    }

    // RF01
    public function registrar(array $datos): int
    {
        foreach (['nombre', 'apellido', 'correo', 'password'] as $campo) {
            if (empty($datos[$campo])) {
                throw new InvalidArgumentException("El campo $campo es obligatorio");
            }
        }

        if (strlen($datos['password']) < 6) {
            throw new InvalidArgumentException('La contraseña debe tener al menos 6 caracteres');
        }

        return $this->modelo->registrar($datos);
    }

    // RF02
    public function login(string $correo, string $password): array
    {
        $usuario = $this->modelo->verificarCredenciales($correo, $password);

        if (!$usuario) {
            throw new RuntimeException('Correo o contraseña incorrectos');
        }

        return $usuario;
    }

    // RF18
    public function listar(): array
    {
        return $this->modelo->obtenerTodos();
    }

    public function detalle(int $id): ?array
    {
        return $this->modelo->obtenerPorId($id);
    }

    public function actualizar(int $id, array $datos): bool
    {
        return $this->modelo->actualizar($id, $datos);
    }

    public function eliminar(int $id): bool
    {
        return $this->modelo->eliminar($id);
    }
}
