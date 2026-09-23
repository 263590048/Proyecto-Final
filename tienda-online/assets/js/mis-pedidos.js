// Historial de pedidos del cliente autenticado (RF12)

async function cargarPedidos() {
    const contenedor = document.getElementById('lista-pedidos');

    try {
        const respuesta = await fetch('api/pedidos.php');

        if (respuesta.status === 401) {
            window.location.href = 'login.php';
            return;
        }
        if (!respuesta.ok) throw new Error('Error al cargar pedidos');

        const pedidos = await respuesta.json();

        if (pedidos.length === 0) {
            contenedor.innerHTML = '<p>Todavía no tienes pedidos. <a href="productos.php" style="color: var(--acento);">Ver catálogo</a></p>';
            return;
        }

        contenedor.innerHTML = pedidos.map(pedido => `
            <div class="tarjeta-pedido">
                <button type="button" class="pedido-cabecera" onclick="verDetallePedido(${pedido.id_pedido})">
                    <span><strong>Pedido #${pedido.id_pedido}</strong><br>
                        <span style="color: var(--texto-suave); font-size: 0.8rem;">${pedido.fecha}</span>
                    </span>
                    <span class="badge-estado">${pedido.estado}</span>
                    <strong>Q${Number(pedido.total).toFixed(2)}</strong>
                </button>
                <div class="pedido-detalle oculto" id="detalle-pedido-${pedido.id_pedido}"></div>
            </div>
        `).join('');
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudieron cargar tus pedidos.</p>';
        console.error(error);
    }
}

async function verDetallePedido(idPedido) {
    const contenedor = document.getElementById(`detalle-pedido-${idPedido}`);

    if (!contenedor.classList.contains('oculto')) {
        contenedor.classList.add('oculto');
        return;
    }

    contenedor.classList.remove('oculto');
    if (contenedor.dataset.cargado) return;

    try {
        const respuesta = await fetch(`api/pedidos.php?id=${idPedido}`);
        if (!respuesta.ok) throw new Error('Error al cargar el detalle del pedido');

        const pedido = await respuesta.json();
        contenedor.innerHTML = pedido.items.map(item => `
            <div class="pedido-item">
                <span>${item.nombre} × ${item.cantidad}</span>
                <span>Q${(Number(item.precio) * item.cantidad).toFixed(2)}</span>
            </div>
        `).join('') + `
            <a href="confirmacion.php?id=${pedido.id_pedido}" style="color: var(--acento); font-size: 0.85rem;">Ver comprobante →</a>
        `;
        contenedor.dataset.cargado = '1';
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudo cargar el detalle de este pedido.</p>';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', cargarPedidos);
