<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finalizar compra - TechStore</title>
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo filemtime(__DIR__ . '/assets/css/style.css'); ?>">
</head>
<body>
    <header>
        <div class="header-izquierda">
            <a href="index.php" class="logo"><img src="assets/img/logo.png" alt="TechStore" class="logo-img"></a>
            <div class="menu-categorias">
                <button class="btn-categorias" onclick="toggleMenuCategorias(event)">☰ Categorías</button>
                <div class="panel-categorias" id="panel-categorias"></div>
            </div>
        </div>

        <form class="buscador-header" action="productos.php" method="get">
            <input type="search" name="buscar" placeholder="Buscar productos...">
            <button type="submit" aria-label="Buscar">🔍</button>
        </form>

        <nav>
            <a href="index.php">Inicio</a>
            <a href="productos.php">Catálogo</a>
            <div class="menu-carrito">
                <button class="btn-carrito-nav" onclick="toggleMenuCarrito(event)">Carrito (<span id="contador-carrito">0</span>)</button>
                <div class="panel-carrito-mini" id="panel-carrito-mini"></div>
            </div>
            <a href="login.php" class="boton">Iniciar sesión</a>
        </nav>
    </header>

    <main>
        <h2 style="color: var(--azul-oscuro); margin-bottom: 1.5rem;">Finalizar compra</h2>

        <div class="layout-carrito">
            <form class="formulario formulario-checkout" id="form-checkout" novalidate>
                <fieldset>
                    <legend>Datos de envío</legend>
                    <label>
                        Dirección de envío
                        <input type="text" name="direccion_envio" id="direccion_envio" required maxlength="255"
                               placeholder="Ej. 6a Avenida 12-34, Zona 10, Guatemala">
                    </label>
                    <label>
                        Teléfono de contacto
                        <input type="tel" name="telefono_contacto" id="telefono_contacto" maxlength="20"
                               pattern="[0-9 +\-]{8,20}" placeholder="Ej. 5555 1234">
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Método de pago</legend>
                    <label class="opcion-pago">
                        <input type="radio" name="metodo_pago" value="tarjeta" checked>
                        💳 Tarjeta de crédito o débito
                    </label>
                    <label class="opcion-pago">
                        <input type="radio" name="metodo_pago" value="transferencia">
                        🏦 Transferencia bancaria
                    </label>
                    <label class="opcion-pago">
                        <input type="radio" name="metodo_pago" value="contra_entrega">
                        💵 Pago contra entrega
                    </label>
                </fieldset>

                <fieldset id="datos-tarjeta">
                    <legend>Datos de la tarjeta</legend>
                    <label>
                        Nombre del titular
                        <input type="text" name="titular" autocomplete="cc-name" maxlength="100">
                    </label>
                    <label>
                        Número de tarjeta
                        <input type="text" name="numero" id="numero-tarjeta" inputmode="numeric" autocomplete="cc-number"
                               maxlength="23" placeholder="1234 5678 9012 3456">
                    </label>
                    <div class="fila-campos">
                        <label>
                            Mes
                            <select name="mes" id="mes-vencimiento" autocomplete="cc-exp-month"></select>
                        </label>
                        <label>
                            Año
                            <select name="anio" id="anio-vencimiento" autocomplete="cc-exp-year"></select>
                        </label>
                        <label>
                            CVV
                            <input type="password" name="cvv" inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="123">
                        </label>
                    </div>
                    <p class="ayuda-pago">Pago simulado para la demostración: no se realiza ningún cargo real y
                        solo se guardan los últimos 4 dígitos de la tarjeta.</p>
                </fieldset>

                <p class="ayuda-pago oculto" id="info-transferencia">Al confirmar te mostraremos los datos de la cuenta
                    para realizar la transferencia. Tu pedido quedará pendiente hasta verificar el pago.</p>
                <p class="ayuda-pago oculto" id="info-contra-entrega">Pagarás en efectivo o con tarjeta al recibir tu pedido.</p>

                <p class="mensaje-error" id="mensaje-error"></p>
            </form>

            <div class="resumen-pedido">
                <h3 style="color: var(--azul-oscuro);">Resumen del pedido</h3>
                <div id="resumen-items"></div>
                <div class="fila"><span>Subtotal</span><span id="subtotal">Q0.00</span></div>
                <div class="fila"><span>Envío</span><span>Gratis</span></div>
                <div class="total"><span>Total</span><span id="total">Q0.00</span></div>
                <button type="submit" form="form-checkout" id="btn-pagar" class="btn-acento">Pagar y confirmar pedido</button>
                <a href="carrito.php" class="volver-carrito">← Volver al carrito</a>
            </div>
        </div>
    </main>

    <footer class="footer-tienda">
        <div class="footer-contenido">
            <div class="footer-col">
                <a href="index.php" class="logo"><img src="assets/img/logo.png" alt="TechStore" class="logo-img"></a>
                <p>Tu tienda de tecnología en Guatemala: celulares, laptops, audífonos y más.</p>
                <div class="footer-redes">
                    <a href="https://facebook.com/techstoregt" target="_blank" rel="noopener" aria-label="Facebook"><img src="assets/img/redes/facebook.png" alt="Facebook"></a>
                    <a href="https://instagram.com/techstoregt" target="_blank" rel="noopener" aria-label="Instagram"><img src="assets/img/redes/instagram.png" alt="Instagram"></a>
                    <a href="https://wa.me/50223456789" target="_blank" rel="noopener" aria-label="WhatsApp"><img src="assets/img/redes/whatsapp.png" alt="WhatsApp"></a>
                    <a href="https://tiktok.com/@techstoregt" target="_blank" rel="noopener" aria-label="TikTok"><img src="assets/img/redes/tiktok.png" alt="TikTok"></a>
                </div>
            </div>

            <div class="footer-col">
                <h4>Enlaces</h4>
                <a href="index.php">Inicio</a>
                <a href="productos.php">Catálogo</a>
                <a href="resenas.php">Reseñas</a>
                <a href="carrito.php">Carrito</a>
                <a href="nosotros.php">Quiénes somos</a>
                <a href="login.php">Iniciar sesión</a>
            </div>

            <div class="footer-col">
                <h4>Contacto</h4>
                <p>📍 6a Avenida 12-34, Zona 10, Ciudad de Guatemala</p>
                <p>📞 +502 2345 6789</p>
                <p>✉️ contacto@techstore.gt</p>
            </div>
        </div>

        <div class="footer-inferior">&copy; 2026 TechStore. Todos los derechos reservados.</div>
    </footer>

    <script src="assets/js/cart-utils.js?v=<?php echo filemtime(__DIR__ . '/assets/js/cart-utils.js'); ?>"></script>
    <script src="assets/js/checkout.js?v=<?php echo filemtime(__DIR__ . '/assets/js/checkout.js'); ?>"></script>
</body>
</html>
