<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechStore</title>
    <link rel="stylesheet" href="assets/css/style.css">
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
            <a href="index.php" class="activo">Inicio</a>
            <a href="productos.php">Catálogo</a>
            <a href="carrito.php">Carrito (<span id="contador-carrito">0</span>)</a>
            <a href="login.php" class="boton">Iniciar sesión</a>
        </nav>
    </header>

    <main>
        <div style="border-radius: 12px; background: linear-gradient(120deg, #1a2a4a, #2b4577); color: #fff; padding: 3rem; margin-bottom: 2.5rem;">
            <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">La mejor tecnología, al mejor precio</h1>
            <p style="color: #c7d0e0;">Celulares, laptops, audífonos y más — envío a todo el país.</p>
        </div>

        <div class="franja-confianza">
            <div class="item-confianza">
                <span>🚚</span>
                <div>
                    <strong>Envío a todo el país</strong>
                    <p>Recíbelo donde estés</p>
                </div>
            </div>
            <div class="item-confianza">
                <span>🛡️</span>
                <div>
                    <strong>Garantía incluida</strong>
                    <p>Compra con confianza</p>
                </div>
            </div>
            <div class="item-confianza">
                <span>💳</span>
                <div>
                    <strong>Pago seguro</strong>
                    <p>Tus datos protegidos</p>
                </div>
            </div>
            <div class="item-confianza">
                <span>🎧</span>
                <div>
                    <strong>Soporte dedicado</strong>
                    <p>Te ayudamos cuando lo necesites</p>
                </div>
            </div>
        </div>

        <div class="franja-promos">
            <div class="promo-item">
                <span>♻️</span>
                <div>
                    <h3>Programa Trade-In</h3>
                    <p>Entrega tu equipo usado como parte de pago.</p>
                </div>
            </div>
            <div class="promo-item">
                <span>💳</span>
                <div>
                    <h3>Compra a cuotas</h3>
                    <p>Aceptamos VisaCuotas en tu compra.</p>
                </div>
            </div>
            <div class="promo-item">
                <span>🚛</span>
                <div>
                    <h3>Pago contra entrega</h3>
                    <p>Disponible a nivel nacional.</p>
                </div>
            </div>
        </div>

        <div class="encabezado-seccion">
            <h2>Productos destacados</h2>
            <a class="ver-mas" href="productos.php">Ver todos ›</a>
        </div>
        <div class="carrusel-destacados">
            <div class="carrusel-pista" id="grid-destacados">
                <p>Cargando productos...</p>
            </div>
            <button class="carrusel-flecha carrusel-flecha-izq" onclick="moverCarrusel(-1)" aria-label="Anterior">‹</button>
            <button class="carrusel-flecha carrusel-flecha-der" onclick="moverCarrusel(1)" aria-label="Siguiente">›</button>
        </div>

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
                    <a href="https://facebook.com/techstoregt" target="_blank" rel="noopener" aria-label="Facebook">📘</a>
                    <a href="https://instagram.com/techstoregt" target="_blank" rel="noopener" aria-label="Instagram">📷</a>
                    <a href="https://wa.me/50223456789" target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>
                    <a href="https://tiktok.com/@techstoregt" target="_blank" rel="noopener" aria-label="TikTok">🎵</a>
                </div>
            </div>

            <div class="footer-col">
                <h4>Enlaces</h4>
                <a href="index.php">Inicio</a>
                <a href="productos.php">Catálogo</a>
                <a href="carrito.php">Carrito</a>
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

    <script src="assets/js/cart-utils.js"></script>
    <script src="assets/js/inicio.js"></script>
</body>
</html>
