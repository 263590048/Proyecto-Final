<?php
require_once __DIR__ . '/../model/Usuario.php';
require_once __DIR__ . '/../config/app.php';

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

    // RF03: genera el enlace de recuperación y lo envía por correo.
    // En modo desarrollo no se envía: se devuelve el enlace para mostrarlo en pantalla.
    public function solicitarRecuperacion(string $correo): ?string
    {
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Ingresa un correo electrónico válido');
        }

        $recuperacion = $this->modelo->crearTokenRecuperacion($correo);
        if (!$recuperacion) {
            return null; // el correo no está registrado; la API responde igual para no revelarlo
        }

        $enlace = URL_BASE . '/restablecer.php?token=' . $recuperacion['token'];

        if (MODO_DESARROLLO) {
            return $enlace;
        }

        $mensaje = "Hola {$recuperacion['nombre']},\n\n"
            . "Recibimos una solicitud para restablecer tu contraseña en TechStore.\n"
            . "Abre este enlace para elegir una nueva (vence en 30 minutos):\n\n$enlace\n\n"
            . "Si no fuiste tú, ignora este correo; tu contraseña no cambiará.";
        $cabeceras = 'From: TechStore <' . CORREO_REMITENTE . ">\r\n"
            . "Content-Type: text/plain; charset=UTF-8";
        mail($recuperacion['correo'], 'Recupera tu contraseña de TechStore', $mensaje, $cabeceras);

        return null;
    }

    // RF03
    public function restablecerPassword(string $token, string $password, string $confirmacion): void
    {
        if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
            throw new RuntimeException('El enlace no es válido o ya venció. Solicita uno nuevo.');
        }
        if (strlen($password) < 6) {
            throw new InvalidArgumentException('La contraseña debe tener al menos 6 caracteres');
        }
        if ($password !== $confirmacion) {
            throw new InvalidArgumentException('Las contraseñas no coinciden');
        }
        if (!$this->modelo->restablecerPassword($token, $password)) {
            throw new RuntimeException('El enlace no es válido o ya venció. Solicita uno nuevo.');
        }
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
