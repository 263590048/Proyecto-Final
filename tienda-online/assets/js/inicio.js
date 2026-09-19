// Página de inicio: ofertas del mes (carrusel), destacados (grilla fija) e ingreso nuevo (lista) (RF04)

async function cargarSeccionesProductos() {
    try {
        const respuesta = await fetch('api/productos.php');
        if (!respuesta.ok) throw new Error('La API respondió con error');
        const productos = await respuesta.json();

        renderizarCarrusel('grid-ofertas', productos.filter(producto => producto.precio_oferta));
        renderizarGrillaFija('grid-destacados', seleccionarDestacadosPorCategoria(productos, 2).slice(0, 4));
        renderizarListaNuevos('grid-nuevos', [...productos].sort((a, b) => b.id_producto - a.id_producto).slice(0, 5));
    } catch (error) {
        ['grid-destacados', 'grid-ofertas', 'grid-nuevos'].forEach(id => {
            const contenedor = document.getElementById(id);
            if (contenedor) contenedor.innerHTML = '<p>No se pudieron cargar los productos.</p>';
        });
        console.error(error);
    }
}

function renderizarCarrusel(idContenedor, productos) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos para mostrar por ahora.</p>';
        return;
    }

    contenedor.innerHTML = productos.map(renderizarTarjetaProductoHtml).join('');
}

function renderizarGrillaFija(idContenedor, productos) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos para mostrar por ahora.</p>';
        return;
    }

    contenedor.innerHTML = productos.map(renderizarTarjetaProductoHtml).join('');
}

function renderizarListaNuevos(idContenedor, productos) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos para mostrar por ahora.</p>';
        return;
    }

    contenedor.innerHTML = productos.map(producto => `
        <div class="item-nuevo">
            <div class="imagen-producto">${imagenProductoHtml(producto)}</div>
            <div class="info-nuevo">
                <span class="etiqueta-nuevo">NUEVO</span>
                <h3>${producto.nombre}</h3>
                ${renderizarPrecioHtml(producto)}
            </div>
            ${Number(producto.cantidad) > 0
                ? `<button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar</button>`
                : `<p class="sin-stock">Sin stock</p>`}
        </div>
    `).join('');
}

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

function moverCarruselOfertas(direccion) {
    const pista = document.getElementById('grid-ofertas');
    if (!pista) return;

    const tarjeta = pista.querySelector('.tarjeta-producto');
    const distancia = tarjeta ? tarjeta.offsetWidth + 24 : 240;
    pista.scrollBy({ left: distancia * direccion, behavior: 'smooth' });
}

let intervaloCarrusel = null;

function iniciarAutoAvanceCarrusel() {
    detenerAutoAvanceCarrusel();
    intervaloCarrusel = setInterval(() => {
        const pista = document.getElementById('grid-ofertas');
        if (!pista) return;

        const llegoAlFinal = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 5;
        if (llegoAlFinal) {
            pista.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            moverCarruselOfertas(1);
        }
    }, 4000);
}

function detenerAutoAvanceCarrusel() {
    if (intervaloCarrusel) {
        clearInterval(intervaloCarrusel);
        intervaloCarrusel = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarSeccionesProductos();

    const carrusel = document.querySelector('.seccion-ofertas .carrusel-destacados');
    if (carrusel) {
        carrusel.addEventListener('mouseenter', detenerAutoAvanceCarrusel);
        carrusel.addEventListener('mouseleave', iniciarAutoAvanceCarrusel);
        iniciarAutoAvanceCarrusel();
    }
});
