// Catálogo: consulta la API, aplica búsqueda y filtros (RF04, RF05, RF06)

let TODOS_LOS_PRODUCTOS = [];

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
        aplicarFiltros();
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudieron cargar los productos. Verifica que el servidor y la base de datos estén activos.</p>';
        console.error(error);
    }
}

function preseleccionarCategoriaDesdeUrl() {
    const params = new URLSearchParams(window.location.search);
    const categoriaId = params.get('categoria');
    if (!categoriaId) return;

    const select = document.getElementById('filtro-categoria');
    if (select.querySelector(`option[value="${categoriaId}"]`)) {
        select.value = categoriaId;
    }
}

function preseleccionarBusquedaDesdeUrl() {
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get('buscar');
    if (!busqueda) return;

    document.getElementById('buscador').value = busqueda;
}

function llenarSelectCategorias(categorias) {
    const select = document.getElementById('filtro-categoria');
    if (!select) return;

    categorias.forEach(categoria => {
        const opcion = document.createElement('option');
        opcion.value = categoria.id_categoria;
        opcion.textContent = categoria.nombre;
        select.appendChild(opcion);
    });
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
    const categoriaId = document.getElementById('filtro-categoria').value;
    const precioMax = document.getElementById('filtro-precio').value;
    const soloDisponibles = document.getElementById('filtro-disponible').checked;

    let resultado = TODOS_LOS_PRODUCTOS.filter(producto => {
        const coincideTexto = producto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = !categoriaId || String(producto.id_categoria) === categoriaId;
        const coincidePrecio = !precioMax || Number(producto.precio) <= Number(precioMax);
        const coincideDisponibilidad = !soloDisponibles || Number(producto.cantidad) > 0;

        return coincideTexto && coincideCategoria && coincidePrecio && coincideDisponibilidad;
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
