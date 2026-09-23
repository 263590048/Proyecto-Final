// Lista de deseos del cliente autenticado (RF15)

async function cargarListaDeseos() {
    const contenedor = document.getElementById('lista-deseos');

    try {
        const respuesta = await fetch('api/wishlist.php');

        if (respuesta.status === 401) {
            window.location.href = 'login.php';
            return;
        }
        if (!respuesta.ok) throw new Error('Error al cargar la lista de deseos');

        const productos = await respuesta.json();

        if (productos.length === 0) {
            contenedor.innerHTML = '<p>Todavía no has guardado productos. <a href="productos.php" style="color: var(--acento);">Ver catálogo</a></p>';
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
                    ? `<button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>`
                    : `<p class="sin-stock">Sin stock</p>`}
                <button class="btn-peligro" onclick="quitarDeListaDeseos(${producto.id_producto})">Quitar de mi lista</button>
            </div>
        `).join('');
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudo cargar tu lista de deseos.</p>';
        console.error(error);
    }
}

async function quitarDeListaDeseos(idProducto) {
    try {
        await fetch(`api/wishlist.php?id_producto=${idProducto}`, { method: 'DELETE' });
        cargarListaDeseos();
    } catch (error) {
        alert('No se pudo quitar el producto de tu lista de deseos.');
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', cargarListaDeseos);
