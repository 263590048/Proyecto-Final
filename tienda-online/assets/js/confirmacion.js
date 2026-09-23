// Confirmación del pedido (RF20): comprobante con el número, productos, total, pago y envío

const NOMBRES_METODO_PAGO = {
    tarjeta: 'Tarjeta de crédito o débito',
    transferencia: 'Transferencia bancaria',
    contra_entrega: 'Pago contra entrega'
};

// Mensaje según cómo quedó el pago del pedido
function mensajePago(pedido) {
    if (pedido.metodo_pago === 'tarjeta') {
        return '<p class="aviso-pago exito">✅ Pago aprobado. Ya estamos preparando tu pedido.</p>';
    }
    if (pedido.metodo_pago === 'transferencia') {
        return `
            <div class="aviso-pago">
                <p><strong>Realiza tu transferencia para completar el pago:</strong></p>
                <p>Banco Industrial · Cuenta monetaria 000-123456-7 · A nombre de TechStore, S.A.</p>
                <p>Monto: <strong>Q${Number(pedido.total).toFixed(2)}</strong> · Indica el número de pedido #${pedido.id_pedido} en la descripción.</p>
            </div>
        `;
    }
    return '<p class="aviso-pago">💵 Pagarás al recibir tu pedido.</p>';
}

async function cargarConfirmacion() {
    const contenedor = document.getElementById('confirmacion-pedido');
    const idPedido = Number(new URLSearchParams(window.location.search).get('id'));

    if (!idPedido) {
        contenedor.innerHTML = '<p>No se indicó ningún pedido. <a href="mis-pedidos.php" style="color: var(--acento);">Ver mis pedidos</a></p>';
        return;
    }

    try {
        const respuesta = await fetch(`api/pedidos.php?id=${idPedido}`);

        if (respuesta.status === 401 || respuesta.status === 403) {
            window.location.href = 'login.php';
            return;
        }
        if (!respuesta.ok) throw new Error('Error al cargar el pedido');

        const pedido = await respuesta.json();
        const metodo = NOMBRES_METODO_PAGO[pedido.metodo_pago] || 'No especificado';

        contenedor.innerHTML = `
            <div class="confirmacion-cabecera">
                <div class="confirmacion-icono">✓</div>
                <h2>¡Gracias por tu compra!</h2>
                <p>Tu pedido <strong>#${pedido.id_pedido}</strong> se registró correctamente el ${pedido.fecha}.</p>
            </div>

            ${mensajePago(pedido)}

            <div class="confirmacion-datos">
                <div><span>Estado</span><span class="badge-estado">${pedido.estado}</span></div>
                <div><span>Método de pago</span><strong>${metodo}${pedido.referencia_pago ? ` (${pedido.referencia_pago})` : ''}</strong></div>
                <div><span>Dirección de envío</span><strong>${pedido.direccion_envio || '—'}</strong></div>
                <div><span>Teléfono de contacto</span><strong>${pedido.telefono_contacto || '—'}</strong></div>
            </div>

            <h3>Productos</h3>
            ${pedido.items.map(item => `
                <div class="item-carrito">
                    <div class="imagen-producto">${imagenProductoHtml(item)}</div>
                    <div class="info">
                        <div class="nombre">${item.nombre}</div>
                        <div class="precio-unitario">${item.cantidad} × Q${Number(item.precio).toFixed(2)}</div>
                    </div>
                    <div class="subtotal-item">Q${(Number(item.precio) * item.cantidad).toFixed(2)}</div>
                </div>
            `).join('')}

            <div class="confirmacion-total"><span>Total</span><span>Q${Number(pedido.total).toFixed(2)}</span></div>

            <div class="confirmacion-acciones">
                <button type="button" class="btn-secundario" onclick="window.print()">🖨️ Imprimir comprobante</button>
                <a href="mis-pedidos.php" class="boton-enlace btn-secundario">Ver mis pedidos</a>
                <a href="productos.php" class="boton-enlace btn-acento">Seguir comprando</a>
            </div>
        `;
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudo cargar la confirmación de tu pedido.</p>';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', cargarConfirmacion);
