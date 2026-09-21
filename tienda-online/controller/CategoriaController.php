<?php
require_once __DIR__ . '/../model/Categoria.php';

class CategoriaController
{
    private Categoria $modelo;

    public function __construct()
    {
        $this->modelo = new Categoria();
    }

    public function listar(): array
    {
        return $this->modelo->obtenerTodas();
    }

    public function detalle(int $id): ?array
    {
        return $this->modelo->obtenerPorId($id);
    }

    // RF17
    public function crear(array $datos): int
    {
        if (empty($datos['nombre'])) {
            throw new InvalidArgumentException('El campo nombre es obligatorio');
        }

        return $this->modelo->crear($datos);
    }

    public function actualizar(int $id, array $datos): bool
    {
        if (empty($datos['nombre'])) {
            throw new InvalidArgumentException('El campo nombre es obligatorio');
        }

        return $this->modelo->actualizar($id, $datos);
    }

    public function eliminar(int $id): bool
    {
        return $this->modelo->eliminar($id);
    }
}
