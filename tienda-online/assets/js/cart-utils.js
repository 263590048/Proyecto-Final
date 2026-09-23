// Utilidades del carrito compartidas entre páginas (RF08, RF09, RF10)
// El carrito se guarda en localStorage mientras no hay sesión de backend activa.
// Cada item: { id_producto, nombre, precio, imagen, cantidad }

const CARRITO_KEY = 'techstore_carrito';

// Devuelve el HTML del precio, tachando el precio original si hay oferta activa
function renderizarPrecioHtml(producto) {
    if (producto.precio_oferta) {
        return `
            <span class="badge-oferta">OFERTA</span>
            <p class="precio">
                Q${Number(producto.precio_oferta).toFixed(2)}
                <span class="precio-anterior">Q${Number(producto.precio).toFixed(2)}</span>
            </p>
        `;
    }
    return `<p class="precio">Q${Number(producto.precio).toFixed(2)}</p>`;
}

// Imagen del producto: usa el archivo real si existe, o el ícono de respaldo si falta o no carga
const CARPETA_IMAGENES_PRODUCTOS = 'assets/img/productos/';

function imagenProductoHtml(producto) {
    if (!producto.imagen) return '📦';

    const principal = `<img class="img-principal" src="${CARPETA_IMAGENES_PRODUCTOS}${producto.imagen}" alt="${producto.nombre}" onerror="manejarErrorImagenProducto(this)">`;

    if (!producto.imagen2) return principal;

    // Segunda foto: se muestra al pasar el mouse por encima (ver CSS .imagen-producto:hover)
    const secundaria = `<img class="img-secundaria" src="${CARPETA_IMAGENES_PRODUCTOS}${producto.imagen2}" alt="" aria-hidden="true" onerror="this.remove()">`;
    return principal + secundaria;
}

function manejarErrorImagenProducto(img) {
    const contenedor = img.parentElement;
    img.remove();
    contenedor.textContent = '📦';
}

// Tarjeta de producto reutilizada en los carruseles del inicio
function renderizarTarjetaProductoHtml(producto) {
    const disponible = Number(producto.cantidad) > 0;

    return `
        <div class="tarjeta-producto">
            <a href="producto.php?id=${producto.id_producto}">
                <div class="imagen-producto">${imagenProductoHtml(producto)}</div>
                <h3>${producto.nombre}</h3>
            </a>
            ${renderizarPrecioHtml(producto)}
            ${disponible
                ? `<button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>`
                : `<p class="sin-stock">Sin stock</p>`}
        </div>
    `;
}

// Selección compartida entre inicio.js (secciones de la home) y productos.js
// (catálogo filtrado desde "Ver todos ›" de cada sección)
function seleccionarDestacadosPorCategoria(productos, cantidadPorCategoria) {
    const porCategoria = {};

    for (const producto of productos) {
        const idCategoria = producto.id_categoria;
        if (!porCategoria[idCategoria]) porCategoria[idCategoria] = [];
        if (porCategoria[idCategoria].length < cantidadPorCategoria) {
            porCategoria[idCategoria].push(producto);
        }
    }

    return Object.values(porCategoria).flat();
}

function seleccionarNuevos(productos, cantidad) {
    return [...productos].sort((a, b) => b.id_producto - a.id_producto).slice(0, cantidad);
}

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
    } catch {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id_producto === producto.id_producto);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    mostrarToast(`✓ ${producto.nombre} agregado al carrito`);
}

function mostrarToast(mensaje) {
    let toast = document.getElementById('toast-carrito');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-carrito';
        toast.className = 'toast-carrito';
        document.body.appendChild(toast);
    }

    toast.textContent = mensaje;
    toast.classList.add('visible');

    clearTimeout(toast._temporizador);
    toast._temporizador = setTimeout(() => {
        toast.classList.remove('visible');
    }, 2500);
}

function actualizarCantidad(idProducto, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.id_producto === idProducto);
    if (!item) return;

    item.cantidad += delta;
    const carritoFiltrado = item.cantidad <= 0
        ? carrito.filter(i => i.id_producto !== idProducto)
        : carrito;

    guardarCarrito(carritoFiltrado);
}

function eliminarDelCarrito(idProducto) {
    const carrito = obtenerCarrito().filter(i => i.id_producto !== idProducto);
    guardarCarrito(carrito);
}

function vaciarCarrito() {
    if (!confirm('¿Vaciar todo el carrito?')) return;
    guardarCarrito([]);
}

// Usado tras registrar un pedido con éxito: vacía sin pedir confirmación
function vaciarCarritoSinConfirmar() {
    guardarCarrito([]);
}

function calcularTotal(carrito) {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function contarItems(carrito) {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = contarItems(obtenerCarrito());
    }
}

document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);

// Mini-carrito desplegable en el header (compartido entre páginas)

function renderizarMiniCarrito() {
    const panel = document.getElementById('panel-carrito-mini');
    if (!panel) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        panel.innerHTML = '<p class="mini-carrito-vacio">Tu carrito está vacío.</p>';
        return;
    }

    const total = calcularTotal(carrito);

    panel.innerHTML = `
        <div class="mini-carrito-items">
            ${carrito.map(item => `
                <div class="mini-carrito-item">
                    <div class="imagen-producto">${imagenProductoHtml(item)}</div>
                    <div class="mini-carrito-info">
                        <span class="mini-carrito-nombre">${item.nombre}</span>
                        <div class="mini-carrito-controles">
                            <button onclick="cambiarCantidadMini(${item.id_producto}, -1)" aria-label="Restar">−</button>
                            <span>${item.cantidad}</span>
                            <button onclick="cambiarCantidadMini(${item.id_producto}, 1)" aria-label="Sumar">+</button>
                        </div>
                    </div>
                    <div class="mini-carrito-precio">
                        Q${(item.precio * item.cantidad).toFixed(2)}
                        <button class="mini-carrito-quitar" onclick="quitarDelCarritoMini(${item.id_producto})">Quitar</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="mini-carrito-total">
            <span>Total</span>
            <strong>Q${total.toFixed(2)}</strong>
        </div>
        <div class="mini-carrito-acciones">
            <button class="btn-peligro-solido" onclick="vaciarCarritoMini()">Vaciar carrito</button>
            <a href="carrito.php" class="btn-acento mini-carrito-boton">Finalizar compra</a>
        </div>
    `;
}

function cambiarCantidadMini(idProducto, delta) {
    actualizarCantidad(idProducto, delta);
    renderizarMiniCarrito();
}

function quitarDelCarritoMini(idProducto) {
    eliminarDelCarrito(idProducto);
    renderizarMiniCarrito();
}

function vaciarCarritoMini() {
    vaciarCarrito();
    renderizarMiniCarrito();
}

function toggleMenuCarrito(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    renderizarMiniCarrito();
    document.getElementById('panel-carrito-mini')?.classList.toggle('abierto');
}

document.getElementById('panel-carrito-mini')?.addEventListener('click', evento => evento.stopPropagation());

document.addEventListener('click', () => {
    document.getElementById('panel-carrito-mini')?.classList.remove('abierto');
});

// Menú desplegable de categorías en el header (compartido entre páginas)

const CLASES_MENU_CATEGORIAS = {
    'Celulares': 'movil',
    'Laptops': 'laptop',
    'Audífonos': 'audio',
    'Tablets': 'tablet',
    'Smartwatches': 'reloj',
    'Accesorios': 'accesorios'
};

async function cargarMenuCategorias() {
    const panel = document.getElementById('panel-categorias');
    if (!panel) return;

    try {
        const respuesta = await fetch('api/categorias.php');
        if (!respuesta.ok) throw new Error('La API respondió con error');
        const categorias = await respuesta.json();

        panel.innerHTML = `
            <div class="panel-categorias-titulo">
                <strong>Explora por categoría</strong>
                <span>Encuentra justo lo que buscas</span>
            </div>
            <div class="panel-categorias-grid">
                ${categorias.map(categoria => `
                    <a href="productos.php?categoria=${categoria.id_categoria}" class="categoria-menu-item">
                        <span class="menu-categoria-icono ${CLASES_MENU_CATEGORIAS[categoria.nombre] || 'general'}" aria-hidden="true"></span>
                        <span><strong>${categoria.nombre}</strong><small>${categoria.descripcion || 'Ver productos'}</small></span>
                    </a>
                `).join('')}
            </div>
            <a href="productos.php" class="ver-catalogo-menu">Ver todo el catálogo <span aria-hidden="true">→</span></a>
        `;
    } catch (error) {
        panel.innerHTML = '<p class="panel-categorias-error">No se pudieron cargar las categorías.</p>';
        console.error(error);
    }
}

function toggleMenuCategorias(evento) {
    evento.stopPropagation();
    const panel = document.getElementById('panel-categorias');
    const estaAbierto = panel?.classList.toggle('abierto');
    evento.currentTarget?.setAttribute('aria-expanded', String(Boolean(estaAbierto)));
}

document.addEventListener('click', () => {
    document.getElementById('panel-categorias')?.classList.remove('abierto');
    document.querySelector('.btn-categorias')?.setAttribute('aria-expanded', 'false');
});

document.addEventListener('DOMContentLoaded', cargarMenuCategorias);

// Estado de sesión en el header (compartido entre páginas)

async function actualizarEstadoSesion() {
    const enlaceSesion = document.querySelector('nav a.boton');
    if (!enlaceSesion) return;

    try {
        const respuesta = await fetch('api/auth.php');
        if (!respuesta.ok) return; // no hay sesión activa: se deja "Iniciar sesión"

        const usuario = await respuesta.json();
        const destino = usuario.tipo_usuario === 'administrador' ? 'admin.php' : 'mis-pedidos.php';

        enlaceSesion.textContent = `Hola, ${usuario.nombre}`;
        enlaceSesion.setAttribute('href', destino);

        const enlaceSalir = document.createElement('a');
        enlaceSalir.href = '#';
        enlaceSalir.textContent = 'Salir';
        enlaceSalir.addEventListener('click', cerrarSesion);
        enlaceSesion.insertAdjacentElement('beforebegin', enlaceSalir);

        if (usuario.tipo_usuario !== 'administrador') {
            const enlaceDeseos = document.createElement('a');
            enlaceDeseos.href = 'lista-deseos.php';
            enlaceDeseos.textContent = '♡ Mi lista';
            enlaceSesion.insertAdjacentElement('beforebegin', enlaceDeseos);
        }
    } catch (error) {
        console.error(error);
    }
}

async function cerrarSesion(evento) {
    evento.preventDefault();
    try {
        await fetch('api/auth.php', { method: 'DELETE' });
    } finally {
        window.location.href = 'index.php';
    }
}

document.addEventListener('DOMContentLoaded', actualizarEstadoSesion);
