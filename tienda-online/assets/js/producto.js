// Detalle de un producto (RF07)

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

    contenedor.innerHTML = `
        <div style="display: flex; gap: 2.5rem; flex-wrap: wrap; background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); padding: 2rem;">
            <div class="imagen-producto" style="width: 320px; height: 320px; font-size: 4rem;">📦</div>
            <div style="flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 1rem;">
                <h2 style="color: var(--azul-oscuro);">${producto.nombre}</h2>
                <p style="color: var(--texto-suave);">${producto.descripcion ?? ''}</p>
                <p class="precio" style="font-size: 1.6rem;">Q${Number(producto.precio).toFixed(2)}</p>
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

document.addEventListener('DOMContentLoaded', cargarDetalle);
