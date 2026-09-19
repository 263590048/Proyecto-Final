<?php
require_once __DIR__ . '/../model/Usuario.php';

class UsuarioController
{
    private Usuario $modelo;

    public function __construct()
    {
        $this->modelo = new Usuario();
    }

    // TODO: registrar() -> RF01, login() -> RF02, recuperarPassword() -> RF03
}
