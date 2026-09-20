<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechStore</title>
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
            <a href="index.php" class="activo">Inicio</a>
            <a href="productos.php">Catálogo</a>
            <div class="menu-carrito">
                <button class="btn-carrito-nav" onclick="toggleMenuCarrito(event)">Carrito (<span id="contador-carrito">0</span>)</button>
                <div class="panel-carrito-mini" id="panel-carrito-mini"></div>
            </div>
            <a href="login.php" class="boton">Iniciar sesión</a>
        </nav>
    </header>

    <main class="inicio">
        <section class="hero-inicio" aria-labelledby="titulo-principal">
            <div class="hero-contenido">
                <p class="hero-etiqueta">Tecnología que te acompaña</p>
                <h1 id="titulo-principal">Encuentra el equipo ideal para tu día a día.</h1>
                <p class="hero-descripcion">Celulares, laptops, accesorios y más, con ofertas reales y envío a todo Guatemala.</p>
                <div class="hero-acciones">
                    <a class="btn btn-hero" href="productos.php">Explorar catálogo <span aria-hidden="true">→</span></a>
                    <a class="enlace-hero" href="productos.php?filtro=ofertas">Ver ofertas del mes</a>
                </div>
                <div class="hero-datos" aria-label="Beneficios de comprar en TechStore">
                    <div><strong>+100</strong><span>productos disponibles</span></div>
                    <div><strong>Pago seguro</strong><span>en cada compra</span></div>
                </div>
            </div>
            <div class="hero-visual" aria-hidden="true">
                <div class="hero-resplandor"></div>
                <div class="hero-producto hero-producto-secundario"><img src="assets/img/productos/airpods_pro2.png" alt=""></div>
                <div class="hero-producto hero-producto-principal"><img src="assets/img/productos/iphone15.webp" alt=""></div>
                <span class="hero-chip chip-envio">🚚 Envío nacional</span>
                <span class="hero-chip chip-oferta">Ofertas semanales</span>
            </div>
        </section>

        <section class="accesos-categorias" aria-label="Comprar por categoría">
            <a href="productos.php?categoria=1"><span class="acceso-icono">📱</span><span>Celulares</span><small>Ver modelos</small></a>
            <a href="productos.php?categoria=2"><span class="acceso-icono">💻</span><span>Laptops</span><small>Para estudiar y trabajar</small></a>
            <a href="productos.php?categoria=3"><span class="acceso-icono">🎧</span><span>Audio</span><small>Escucha mejor</small></a>
            <a href="productos.php?categoria=5"><span class="acceso-icono">⌚</span><span>Wearables</span><small>Siempre conectado</small></a>
        </section>

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
                <div class="titulo-seccion">
                    <p>Precios especiales</p>
                    <h2>Ofertas que valen la pena</h2>
                    <span>Encuentra tecnología a un mejor precio por tiempo limitado.</span>
                </div>
                <a class="ver-mas" href="productos.php?filtro=ofertas">Ver ofertas <span aria-hidden="true">→</span></a>
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
                <div class="titulo-seccion">
                    <p>Elegidos para ti</p>
                    <h2>Los favoritos de TechStore</h2>
                    <span>Una selección de equipos que destacan por su calidad y rendimiento.</span>
                </div>
                <a class="ver-mas" href="productos.php?filtro=destacados">Ver selección <span aria-hidden="true">→</span></a>
            </div>
            <div class="grid-destacados-fijo" id="grid-destacados">
                <p>Cargando productos...</p>
            </div>
        </section>

        <section class="seccion-productos seccion-nuevos">
            <div class="encabezado-seccion">
                <div class="titulo-seccion">
                    <p>Lo más reciente</p>
                    <h2>Recién llegados</h2>
                    <span>Descubre los nuevos productos que ya están disponibles.</span>
                </div>
                <a class="ver-mas" href="productos.php?filtro=nuevos">Ver novedades <span aria-hidden="true">→</span></a>
            </div>
            <a href="productos.php?filtro=nuevos" class="banner-seccion">
                <img src="assets/img/banner_nuevos.png" alt="Nuevos ingresos: los mejores celulares, laptops y más recién llegados a TechStore">
            </a>
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

    <script src="assets/js/cart-utils.js?v=<?php echo filemtime(__DIR__ . '/assets/js/cart-utils.js'); ?>"></script>
    <script src="assets/js/inicio.js?v=<?php echo filemtime(__DIR__ . '/assets/js/inicio.js'); ?>"></script>
</body>
</html>
