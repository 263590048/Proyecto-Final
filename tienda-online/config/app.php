<?php
// Configuración general de la aplicación (separada de la conexión a la base de datos)

// URL pública del sitio, sin "/" al final. Se usa para armar enlaces que salen de la
// aplicación (por ejemplo, el de recuperar contraseña) sin depender del header Host.
// En producción: la URL del hosting, por ejemplo 'https://techstore.example.com'.
const URL_BASE = 'http://localhost/Tienda%20en%20Linea%20-%20Proyecto%20Final/tienda-online';

// En desarrollo (XAMPP) no hay servidor de correo: el enlace de recuperación se muestra en
// pantalla en lugar de enviarse. En producción debe ser false para que se envíe por correo.
const MODO_DESARROLLO = true;

// Remitente de los correos de la tienda
const CORREO_REMITENTE = 'no-responder@techstore.gt';
