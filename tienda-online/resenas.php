<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reseñas - TechStore</title>
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
        <h2 style="color: var(--azul-oscuro); margin-bottom: 1.5rem;">Reseñas de nuestros clientes</h2>

        <div class="layout-resenas">
            <aside class="resumen-resenas" id="resumen-resenas">
                <p>Cargando resumen...</p>
            </aside>

            <section class="contenido-resenas">
                <div class="filtros-resenas">
                    <input type="search" id="buscar-resena" placeholder="Buscar por producto o comentario...">
                    <select id="filtro-categoria-resena" aria-label="Filtrar por categoría">
                        <option value="">Categoría: todas</option>
                    </select>
                    <select id="filtro-calificacion-resena" aria-label="Filtrar por calificación">
                        <option value="">Estrellas: todas</option>
                        <option value="5">5 estrellas</option>
                        <option value="4">4 estrellas</option>
                        <option value="3">3 estrellas</option>
                        <option value="2">2 estrellas</option>
                        <option value="1">1 estrella</option>
                    </select>
                    <select id="orden-resenas" aria-label="Ordenar reseñas">
                        <option value="recientes">Más recientes</option>
                        <option value="mejor">Mejor calificadas</option>
                        <option value="peor">Peor calificadas</option>
                    </select>
                </div>

                <p class="conteo-resenas" id="conteo-resenas"></p>
                <div id="lista-resenas">
                    <p>Cargando reseñas...</p>
                </div>
            </section>
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
    <script src="assets/js/resenas.js?v=<?php echo filemtime(__DIR__ . '/assets/js/resenas.js'); ?>"></script>
</body>
</html>
