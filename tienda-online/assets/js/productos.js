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
            ${popularidadHtml(producto)}
            ${Number(producto.cantidad) > 0
                ? `<button onclick="agregarYAvisar(${producto.id_producto})">Agregar al carrito</button>`
                : `<p class="sin-stock">Sin stock</p>`}
        </div>
    `).join('');
}

// Popularidad visible en la tarjeta: promedio de reseñas (RF06)
function popularidadHtml(producto) {
    const partes = [];
    if (producto.total_resenas > 0) {
        partes.push(`⭐ ${Number(producto.promedio_calificacion).toFixed(1)} (${producto.total_resenas})`);
    }
    return partes.length ? `<p class="popularidad-producto">${partes.join(' · ')}</p>` : '';
}

// Precio que paga el cliente: el de oferta si existe
function precioEfectivo(producto) {
    return Number(producto.precio_oferta || producto.precio);
}

const ORDENES_CATALOGO = {
    vendidos: (a, b) => Number(b.vendidos) - Number(a.vendidos),
    calificacion: (a, b) => Number(b.promedio_calificacion ?? 0) - Number(a.promedio_calificacion ?? 0)
        || b.total_resenas - a.total_resenas,
    'precio-asc': (a, b) => precioEfectivo(a) - precioEfectivo(b),
    'precio-desc': (a, b) => precioEfectivo(b) - precioEfectivo(a)
};

function agregarYAvisar(idProducto) {
    const producto = TODOS_LOS_PRODUCTOS.find(p => p.id_producto === idProducto);
    if (!producto) return;
    agregarAlCarrito(producto);
}

function aplicarFiltros() {
    const texto = document.getElementById('buscador').value.trim().toLowerCase();
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('#filtro-categoria input:checked'))
        .map(opcion => String(opcion.value));
    const precioMin = document.getElementById('filtro-precio-min').value;
    const precioMax = document.getElementById('filtro-precio').value;
    const calificacionMin = Number(document.getElementById('filtro-calificacion').value);
    const orden = document.getElementById('orden-productos').value;
    const soloDisponibles = document.getElementById('filtro-disponible').checked;

    let resultado = TODOS_LOS_PRODUCTOS.filter(producto => {
        const coincideTexto = producto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(String(producto.id_categoria));
        const coincidePrecio = (!precioMin || precioEfectivo(producto) >= Number(precioMin))
            && (!precioMax || precioEfectivo(producto) <= Number(precioMax));
        const coincideCalificacion = !calificacionMin || Number(producto.promedio_calificacion ?? 0) >= calificacionMin;
        const coincideDisponibilidad = !soloDisponibles || Number(producto.cantidad) > 0;

        return coincideTexto && coincideCategoria && coincidePrecio && coincideCalificacion
            && coincideDisponibilidad && coincideFiltroSeccion(producto);
    });

    if (ORDENES_CATALOGO[orden]) {
        resultado = [...resultado].sort(ORDENES_CATALOGO[orden]);
    }

    renderizarProductos(resultado);
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    document.getElementById('buscador').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-categoria').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-precio-min').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-precio').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-calificacion').addEventListener('change', aplicarFiltros);
    document.getElementById('orden-productos').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-disponible').addEventListener('change', aplicarFiltros);
});
