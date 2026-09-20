// Catálogo: consulta la API, aplica búsqueda y filtros (RF04, RF05, RF06)

let TODOS_LOS_PRODUCTOS = [];

// Secciones de la home ("Ver todos ›") que llegan al catálogo con ?filtro=... :
// cada una limita el listado a lo que esa sección realmente muestra, en vez
// de todo el catálogo (que solo se ve entrando por "Catálogo" o sin filtro).
const FILTROS_SECCION = {
    ofertas: { titulo: 'Ofertas que valen la pena' },
    destacados: { titulo: 'Los favoritos de TechStore' },
    nuevos: { titulo: 'Recién llegados' }
};

let FILTRO_SECCION_ACTUAL = null;
let IDS_FILTRO_SECCION = null;

async function cargarProductos() {
    const contenedor = document.getElementById('grid-productos');

    try {
        const [respuestaProductos, respuestaCategorias] = await Promise.all([
            fetch('api/productos.php'),
            fetch('api/categorias.php')
        ]);

        if (!respuestaProductos.ok || !respuestaCategorias.ok) {
            throw new Error('La API respondió con error');
        }

        TODOS_LOS_PRODUCTOS = await respuestaProductos.json();
        const categorias = await respuestaCategorias.json();

        llenarSelectCategorias(categorias);
        preseleccionarCategoriaDesdeUrl();
        preseleccionarBusquedaDesdeUrl();
        aplicarFiltroSeccionDesdeUrl();
        aplicarFiltros();
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudieron cargar los productos. Verifica que el servidor y la base de datos estén activos.</p>';
        console.error(error);
    }
}

function aplicarFiltroSeccionDesdeUrl() {
    const params = new URLSearchParams(window.location.search);
    const filtro = params.get('filtro');
    const grupoCategorias = document.querySelector('.filtro-grupo-categorias');

    if (!filtro || !FILTROS_SECCION[filtro]) {
        if (grupoCategorias) grupoCategorias.hidden = false;
        return;
    }

    if (grupoCategorias) grupoCategorias.hidden = true;

    FILTRO_SECCION_ACTUAL = filtro;

    if (filtro === 'destacados') {
        IDS_FILTRO_SECCION = new Set(seleccionarDestacadosPorCategoria(TODOS_LOS_PRODUCTOS, 2).map(p => p.id_producto));
    } else if (filtro === 'nuevos') {
        IDS_FILTRO_SECCION = new Set(seleccionarNuevos(TODOS_LOS_PRODUCTOS, 10).map(p => p.id_producto));
    }

    const titulo = document.getElementById('titulo-catalogo');
    if (titulo) titulo.textContent = FILTROS_SECCION[filtro].titulo;

    const aviso = document.getElementById('filtro-activo-info');
    if (aviso) {
        aviso.innerHTML = 'Mostrando solo esta sección. <a href="productos.php">Ver todo el catálogo ›</a>';
        aviso.style.display = 'block';
    }
}

function coincideFiltroSeccion(producto) {
    if (!FILTRO_SECCION_ACTUAL) return true;
    if (FILTRO_SECCION_ACTUAL === 'ofertas') return Boolean(producto.precio_oferta);
    return IDS_FILTRO_SECCION.has(producto.id_producto);
}

function preseleccionarCategoriaDesdeUrl() {
    const params = new URLSearchParams(window.location.search);
    const categoriaId = params.get('categoria');
    if (!categoriaId) return;

    const opcion = document.querySelector(`#filtro-categoria input[value="${categoriaId}"]`);
    if (opcion) opcion.checked = true;
}

function preseleccionarBusquedaDesdeUrl() {
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get('buscar');
    if (!busqueda) return;

    document.getElementById('buscador').value = busqueda;
}

function llenarSelectCategorias(categorias) {
    const contenedor = document.getElementById('filtro-categoria');
    if (!contenedor) return;

    contenedor.innerHTML = categorias.map(categoria => `
        <label class="opcion-categoria-filtro">
            <input type="checkbox" value="${categoria.id_categoria}">
            <span>${categoria.nombre}</span>
        </label>
    `).join('');
}

function renderizarProductos(productos) {
    const contenedor = document.getElementById('grid-productos');

    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron productos con esos criterios.</p>';
        return;
    }

    contenedor.innerHTML = productos.map(producto => `
        <div class="tarjeta-producto">
            <a href="producto.php?id=${producto.id_producto}">
                <div class="imagen-producto">${imagenProductoHtml(producto)}</div>
                <h3>${producto.nombre}</h3>
            </a>
            ${renderizarPrecioHtml(producto)}
            ${Number(producto.cantidad) > 0
                ? `<button onclick="agregarYAvisar(${producto.id_producto})">Agregar al carrito</button>`
                : `<p class="sin-stock">Sin stock</p>`}
        </div>
    `).join('');
}

function agregarYAvisar(idProducto) {
    const producto = TODOS_LOS_PRODUCTOS.find(p => p.id_producto === idProducto);
    if (!producto) return;
    agregarAlCarrito(producto);
}

function aplicarFiltros() {
    const texto = document.getElementById('buscador').value.trim().toLowerCase();
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('#filtro-categoria input:checked'))
        .map(opcion => String(opcion.value));
    const precioMax = document.getElementById('filtro-precio').value;
    const soloDisponibles = document.getElementById('filtro-disponible').checked;

    let resultado = TODOS_LOS_PRODUCTOS.filter(producto => {
        const coincideTexto = producto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(String(producto.id_categoria));
        const coincidePrecio = !precioMax || Number(producto.precio) <= Number(precioMax);
        const coincideDisponibilidad = !soloDisponibles || Number(producto.cantidad) > 0;

        return coincideTexto && coincideCategoria && coincidePrecio && coincideDisponibilidad && coincideFiltroSeccion(producto);
    });

    renderizarProductos(resultado);
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    document.getElementById('buscador').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-categoria').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-precio').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-disponible').addEventListener('change', aplicarFiltros);
});
