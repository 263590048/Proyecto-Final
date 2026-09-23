// Página de carrito: listar, modificar cantidad, eliminar y calcular totales (RF08, RF09, RF10)

function renderizarCarrito() {
    const contenedor = document.getElementById('items-carrito');
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. <a href="productos.php" style="color: var(--acento);">Ver catálogo</a></p>';
        document.getElementById('btn-finalizar').disabled = true;
    } else {
        contenedor.innerHTML = carrito.map(item => `
            <div class="item-carrito">
                <div class="imagen-producto">${imagenProductoHtml(item)}</div>
                <div class="info">
                    <div class="nombre">${item.nombre}</div>
                    <div class="precio-unitario">Q${item.precio.toFixed(2)} c/u</div>
                </div>
                <div class="controles-cantidad">
                    <button onclick="cambiarCantidad(${item.id_producto}, -1)">−</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${item.id_producto}, 1)">+</button>
                </div>
                <div class="subtotal-item">Q${(item.precio * item.cantidad).toFixed(2)}</div>
                <button class="quitar" onclick="quitarDelCarrito(${item.id_producto})">Quitar</button>
            </div>
        `).join('');
        document.getElementById('btn-finalizar').disabled = false;
    }

    const total = calcularTotal(carrito);
    document.getElementById('subtotal').textContent = `Q${total.toFixed(2)}`;
    document.getElementById('total').textContent = `Q${total.toFixed(2)}`;
}

function cambiarCantidad(idProducto, delta) {
    actualizarCantidad(idProducto, delta);
    renderizarCarrito();
}

function quitarDelCarrito(idProducto) {
    eliminarDelCarrito(idProducto);
    renderizarCarrito();
}

function vaciarYRenderizar() {
    vaciarCarrito();
    renderizarCarrito();
}

// RF13: el pago y el registro del pedido se hacen en checkout.php
function finalizarCompra() {
    if (obtenerCarrito().length === 0) return;
    window.location.href = 'checkout.php';
}

document.addEventListener('DOMContentLoaded', renderizarCarrito);
