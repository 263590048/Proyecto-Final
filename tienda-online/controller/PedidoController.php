<?php
require_once __DIR__ . '/../model/Pedido.php';

class PedidoController
{
    private Pedido $modelo;

    public function __construct()
    {
        $this->modelo = new Pedido();
    }

    // TODO: crearPedido() -> RF11, historial() -> RF12, procesarPago() -> RF13
}
