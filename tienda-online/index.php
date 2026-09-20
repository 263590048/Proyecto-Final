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
            <div class="menu-carrito">
                <button class="btn-carrito-nav" onclick="toggleMenuCarrito(event)">Carrito (<span id="contador-carrito">0</span>)</button>
                <div class="panel-carrito-mini" id="panel-carrito-mini"></div>
            </div>
            <a href="login.php" class="boton">Iniciar sesión</a>
        </nav>
    </header>

    <main style="padding-bottom: 0;">
        <div style="border-radius: 12px; background: linear-gradient(120deg, #1a2a4a, #2b4577); color: #fff; padding: 3rem; margin-bottom: 2.5rem;">
            <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">La mejor tecnología, al mejor precio</h1>
            <p style="color: #c7d0e0;">Celulares, laptops, audífonos y más — envío a todo el país.</p>
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

        <section class="seccion-productos seccion-ofertas">
            <div class="encabezado-seccion">
                <h2>🔥 Ofertas del mes</h2>
                <a class="ver-mas" href="productos.php?filtro=ofertas">Ver todos ›</a>
            </div>
            <div class="carrusel-destacados">
                <div class="carrusel-pista" id="grid-ofertas">
                    <p>Cargando productos...</p>
                </div>
                <button class="carrusel-flecha carrusel-flecha-izq" onclick="moverCarruselOfertas(-1)" aria-label="Anterior">‹</button>
                <button class="carrusel-flecha carrusel-flecha-der" onclick="moverCarruselOfertas(1)" aria-label="Siguiente">›</button>
            </div>
        </section>

        <section class="seccion-productos seccion-destacados">
            <div class="encabezado-seccion">
                <h2>⭐ Productos destacados</h2>
                <a class="ver-mas" href="productos.php?filtro=destacados">Ver todos ›</a>
            </div>
            <div class="grid-destacados-fijo" id="grid-destacados">
                <p>Cargando productos...</p>
            </div>
        </section>

        <section class="seccion-productos seccion-nuevos">
            <div class="encabezado-seccion">
                <h2>🆕 Ingreso nuevo</h2>
                <a class="ver-mas" href="productos.php?filtro=nuevos">Ver todos ›</a>
            </div>
            <a href="productos.php?filtro=nuevos" class="banner-seccion">
                <img src="assets/img/banner_nuevos.png" alt="Nuevos ingresos: los mejores celulares, laptops y más recién llegados a TechStore">
            </a>
            <div class="lista-nuevos" id="grid-nuevos">
                <p>Cargando productos...</p>
            </div>
        </section>

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

    <script src="assets/js/cart-utils.js"></script>
    <script src="assets/js/inicio.js"></script>
</body>
</html>
