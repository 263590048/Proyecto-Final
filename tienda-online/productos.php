<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo - TechStore</title>
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
            <a href="productos.php" class="activo">Catálogo</a>
            <div class="menu-carrito">
                <button class="btn-carrito-nav" onclick="toggleMenuCarrito(event)">Carrito (<span id="contador-carrito">0</span>)</button>
                <div class="panel-carrito-mini" id="panel-carrito-mini"></div>
            </div>
            <a href="login.php" class="boton">Iniciar sesión</a>
        </nav>
    </header>

    <main>
        <h2 id="titulo-catalogo" style="margin-bottom: 1rem; color: var(--azul-oscuro);">Catálogo de productos</h2>
        <p id="filtro-activo-info" class="filtro-activo-info" style="display: none;"></p>

        <input type="search" id="buscador" class="buscador" placeholder="Buscar productos...">

        <div class="layout-catalogo">
            <aside class="filtros">
                <h3>Filtros</h3>
                <fieldset class="filtro-grupo-categorias">
                    <legend>Categorías</legend>
                    <p class="ayuda-filtro">Selecciona una o varias categorías.</p>
                    <div class="lista-categorias-filtro" id="filtro-categoria"></div>
                </fieldset>
                <label>
                    Ordenar por
                    <select id="orden-productos">
                        <option value="">Relevancia</option>
                        <option value="vendidos">Más vendidos</option>
                        <option value="calificacion">Mejor calificados</option>
                        <option value="precio-asc">Precio: menor a mayor</option>
                        <option value="precio-desc">Precio: mayor a menor</option>
                    </select>
                </label>
                <fieldset class="filtro-rango-precio">
                    <legend>Rango de precio (Q)</legend>
                    <div class="campos-rango">
                        <input type="number" id="filtro-precio-min" placeholder="Mín." min="0" aria-label="Precio mínimo">
                        <span>–</span>
                        <input type="number" id="filtro-precio" placeholder="Máx." min="0" aria-label="Precio máximo">
                    </div>
                </fieldset>
                <label>
                    Calificación
                    <select id="filtro-calificacion">
                        <option value="">Cualquiera</option>
                        <option value="4">4 ★ o más</option>
                        <option value="3">3 ★ o más</option>
                    </select>
                </label>
                <label class="opcion-check-filtro">
                    <input type="checkbox" id="filtro-disponible">
                    Solo disponibles
                </label>
            </aside>

            <div class="contenido-catalogo">
                <div class="grid-productos" id="grid-productos">
                    <p>Cargando productos...</p>
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
    <script src="assets/js/productos.js?v=<?php echo filemtime(__DIR__ . '/assets/js/productos.js'); ?>"></script>
</body>
</html>
