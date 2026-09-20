<?php
require_once __DIR__ . '/../model/Wishlist.php';

class WishlistController
{
    private Wishlist $modelo;

    public function __construct()
    {
        $this->modelo = new Wishlist();
    }

    public function agregar(array $datos): int
    {
        return $this->modelo->agregar($datos);
    }

    public function eliminar(int $idUsuario, int $idProducto): bool
    {
        return $this->modelo->eliminar($idUsuario, $idProducto);
    }

    public function listar(int $idUsuario): array
    {
        return $this->modelo->obtenerPorUsuario($idUsuario);
    }
}
