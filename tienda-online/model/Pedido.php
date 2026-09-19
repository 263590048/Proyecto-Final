<?php
require_once __DIR__ . '/../config/conexion.php';

class Pedido
{
    private PDO $pdo;

    public function __construct()
    {
        global $pdo;
        $this->pdo = $pdo;
    }

    // TODO: crear (RF11 - registra pedido + detalle_pedido en una transacción),
    //       obtenerPorUsuario (RF12 - historial de pedidos),
    //       actualizarEstado (usado tras el pago, RF13)
}
