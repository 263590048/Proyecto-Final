<?php
require_once __DIR__ . '/../model/Producto.php';
require_once __DIR__ . '/../model/Imagen.php';

class ProductoController
{
    private Producto $modelo;

    public function __construct()
    {
        $this->modelo = new Producto();
    }

    public function listar(): array
    {
        return $this->modelo->obtenerTodos();
    }

    public function detalle(int $id): ?array
    {
        return $this->modelo->obtenerPorId($id);
    }

    public function crear(array $datos): int
    {
        return $this->modelo->crear($datos);
    }

    public function actualizar(int $id, array $datos): bool
    {
        return $this->modelo->actualizar($id, $datos);
    }

    public function eliminar(int $id): bool
    {
        return $this->modelo->eliminar($id);
    }

    public function subirImagen(array $archivo): string
    {
        return (new Imagen())->guardar($archivo);
    }
}
