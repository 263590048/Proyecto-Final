<?php
require_once __DIR__ . '/../model/Resena.php';

class ResenaController
{
    private Resena $modelo;

    public function __construct()
    {
        $this->modelo = new Resena();
    }

    public function crear(array $datos): int
    {
        return $this->modelo->crear($datos);
    }

    public function listarPorProducto(int $idProducto): array
    {
        return [
            'resenas' => $this->modelo->obtenerPorProducto($idProducto),
            'resumen' => $this->modelo->obtenerResumen($idProducto),
        ];
    }

    // Para que el frontend sepa si debe mostrar el formulario de reseña
    public function puedeResenar(int $idUsuario, int $idProducto): bool
    {
        return $this->modelo->usuarioComproProducto($idUsuario, $idProducto);
    }
}
