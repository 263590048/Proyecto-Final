<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiénes somos - TechStore</title>
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
            <a href="resenas.php">Reseñas</a>
            <a href="carrito.php">Carrito (<span id="contador-carrito">0</span>)</a>
            <a href="login.php" class="boton">Iniciar sesión</a>
        </nav>
    </header>

    <main>
        <section class="seccion-nosotros">
            <div class="encabezado-seccion">
                <h2>¿Quiénes somos?</h2>
            </div>
            <p class="nosotros-intro">En TechStore llevamos la mejor tecnología a cada rincón de Guatemala. Somos una tienda en línea especializada en celulares, laptops, audífonos y accesorios, comprometidos con ofrecer productos de calidad, precios justos y un servicio cercano a nuestros clientes.</p>
            <div class="nosotros-columnas">
                <div>
                    <h3>🎯 Misión</h3>
                    <p>Ofrecer a los guatemaltecos acceso fácil y confiable a tecnología de calidad, con un servicio ágil y cercano que se adapte a sus necesidades.</p>
                </div>
                <div>
                    <h3>🚀 Visión</h3>
                    <p>Ser la tienda de tecnología en línea líder en Guatemala, reconocida por la confianza de nuestros clientes y la calidad de nuestro servicio.</p>
                </div>
            </div>
        </section>

        <section class="seccion-contacto">
            <div class="mapa-ubicacion">
                <iframe
                    src="https://www.google.com/maps?q=6a+Avenida+12-34+Zona+10+Ciudad+de+Guatemala&output=embed"
                    width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
                    title="Ubicación de TechStore en Guatemala"></iframe>
            </div>

            <form class="formulario formulario-contacto" id="form-contacto">
                <h3 style="color: var(--azul-oscuro);">Escríbenos</h3>
                <label>
                    Nombre
                    <input type="text" name="nombre" required>
                </label>
                <label>
                    Correo
                    <input type="email" name="correo" required>
                </label>
                <label>
                    Mensaje
                    <textarea name="mensaje" rows="4" required></textarea>
                </label>
                <p class="mensaje-exito" id="mensaje-contacto"></p>
                <button type="submit" class="btn-acento">Enviar mensaje</button>
            </form>
        </section>
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
    <script src="assets/js/nosotros.js?v=<?php echo filemtime(__DIR__ . '/assets/js/nosotros.js'); ?>"></script>
</body>
</html>
