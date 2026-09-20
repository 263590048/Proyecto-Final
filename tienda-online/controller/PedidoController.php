<?php
require_once __DIR__ . '/../model/Pedido.php';

class PedidoController
{
    private Pedido $modelo;

    public function __construct()
    {
        $this->modelo = new Pedido();
    }

    public function crearPedido(array $datos): int
    {
        return $this->modelo->crear($datos);
    }

    public function historial(int $idUsuario): array
    {
        return $this->modelo->obtenerPorUsuario($idUsuario);
    }

    public function detalle(int $idPedido): ?array
    {
        return $this->modelo->obtenerPorId($idPedido);
    }

    public function actualizarEstado(int $idPedido, string $estado): bool
    {
        return $this->modelo->actualizarEstado($idPedido, $estado);
    }
}
