// Utilidades del carrito compartidas entre páginas (RF08, RF09, RF10)
// El carrito se guarda en localStorage mientras no hay sesión de backend activa.
// Cada item: { id_producto, nombre, precio, imagen, cantidad }

const CARRITO_KEY = 'techstore_carrito';

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

// Menú desplegable de categorías en el header (compartido entre páginas)

const ICONOS_MENU_CATEGORIAS = {
    'Celulares': '📱',
    'Laptops': '💻',
    'Audífonos': '🎧',
    'Tablets': '🔲',
    'Smartwatches': '⌚',
    'Accesorios': '🔌'
};

async function cargarMenuCategorias() {
    const panel = document.getElementById('panel-categorias');
    if (!panel) return;

    try {
        const respuesta = await fetch('api/categorias.php');
        if (!respuesta.ok) throw new Error('La API respondió con error');
        const categorias = await respuesta.json();

        panel.innerHTML = categorias.map(categoria => `
            <a href="productos.php?categoria=${categoria.id_categoria}">
                <span>${ICONOS_MENU_CATEGORIAS[categoria.nombre] || '🛒'}</span> ${categoria.nombre}
            </a>
        `).join('');
    } catch (error) {
        panel.innerHTML = '<p class="panel-categorias-error">No se pudieron cargar las categorías.</p>';
        console.error(error);
    }
}

function toggleMenuCategorias(evento) {
    evento.stopPropagation();
    document.getElementById('panel-categorias')?.classList.toggle('abierto');
}

document.addEventListener('click', () => {
    document.getElementById('panel-categorias')?.classList.remove('abierto');
});

document.addEventListener('DOMContentLoaded', cargarMenuCategorias);
