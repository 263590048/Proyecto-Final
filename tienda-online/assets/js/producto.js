// Detalle de un producto (RF07)

let IMAGENES_PRODUCTO_ACTUAL = [];
let INDICE_IMAGEN_ACTUAL = 0;

async function cargarDetalle() {
    const contenedor = document.getElementById('detalle-producto');
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        contenedor.innerHTML = '<p>Producto no especificado.</p>';
        return;
    }

    try {
        const respuesta = await fetch(`api/productos.php?id=${id}`);
        if (!respuesta.ok) {
            contenedor.innerHTML = '<p>Producto no encontrado.</p>';
            return;
        }
        const producto = await respuesta.json();
        renderizarDetalle(producto);
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudo cargar el producto.</p>';
        console.error(error);
    }
}

function renderizarDetalle(producto) {
    const contenedor = document.getElementById('detalle-producto');
    IMAGENES_PRODUCTO_ACTUAL = [producto.imagen, producto.imagen2].filter(Boolean);
    INDICE_IMAGEN_ACTUAL = 0;

    const hayVarias = IMAGENES_PRODUCTO_ACTUAL.length > 1;

    const flechasHtml = hayVarias
        ? `
            <button type="button" class="carrusel-flecha carrusel-flecha-izq" onclick="moverImagenPrincipal(-1)" aria-label="Anterior">‹</button>
            <button type="button" class="carrusel-flecha carrusel-flecha-der" onclick="moverImagenPrincipal(1)" aria-label="Siguiente">›</button>
        `
        : '';

    const miniaturasHtml = hayVarias
        ? `<div class="miniaturas-producto">
            ${IMAGENES_PRODUCTO_ACTUAL.map((archivo, indice) => `
                <button type="button" class="miniatura ${indice === 0 ? 'activa' : ''}" onclick="irAImagen(${indice})">
                    <img src="${CARPETA_IMAGENES_PRODUCTOS}${archivo}" alt="Vista ${indice + 1} de ${producto.nombre}" onerror="manejarErrorImagenProducto(this)">
                </button>
            `).join('')}
           </div>`
        : '';

    contenedor.innerHTML = `
        <div style="display: flex; gap: 2.5rem; flex-wrap: wrap; background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); padding: 2rem;">
            <div>
                <div class="imagen-producto-principal">
                    <div class="imagen-producto" id="imagen-principal" style="width: 320px; height: 320px; font-size: 4rem;">${imagenProductoHtml(producto)}</div>
                    ${flechasHtml}
                </div>
                ${miniaturasHtml}
            </div>
            <div style="flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 1rem;">
                <h2 style="color: var(--azul-oscuro);">${producto.nombre}</h2>
                <p style="color: var(--texto-suave);">${producto.descripcion ?? ''}</p>
                <div style="font-size: 1.6rem;">${renderizarPrecioHtml(producto)}</div>
                <p style="font-size: 0.85rem; color: ${producto.cantidad > 0 ? '#16a34a' : '#d33'};">
                    ${producto.cantidad > 0 ? `Disponible (${producto.cantidad} en stock)` : 'Sin stock'}
                </p>
                <button ${producto.cantidad <= 0 ? 'disabled' : ''} onclick='agregarAlCarrito(${JSON.stringify(producto)})'>
                    Agregar al carrito
                </button>
            </div>
        </div>
    `;
}

function moverImagenPrincipal(direccion) {
    const total = IMAGENES_PRODUCTO_ACTUAL.length;
    INDICE_IMAGEN_ACTUAL = (INDICE_IMAGEN_ACTUAL + direccion + total) % total;
    actualizarImagenPrincipal();
}

function irAImagen(indice) {
    INDICE_IMAGEN_ACTUAL = indice;
    actualizarImagenPrincipal();
}

function actualizarImagenPrincipal() {
    const principal = document.getElementById('imagen-principal');
    const archivo = IMAGENES_PRODUCTO_ACTUAL[INDICE_IMAGEN_ACTUAL];
    principal.innerHTML = `<img src="${CARPETA_IMAGENES_PRODUCTOS}${archivo}" alt="" onerror="manejarErrorImagenProducto(this)">`;

    document.querySelectorAll('.miniatura').forEach((miniatura, indice) => {
        miniatura.classList.toggle('activa', indice === INDICE_IMAGEN_ACTUAL);
    });
}

document.addEventListener('DOMContentLoaded', cargarDetalle);
