// Historial de pedidos del cliente autenticado

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
        const entregado = pedido.estado === 'entregado';

        contenedor.innerHTML = pedido.items.map(item => `
            <div class="pedido-item">
                <span>${escaparHtml(item.nombre)} × ${item.cantidad}</span>
                <span class="pedido-item-derecha">
                    Q${(Number(item.precio) * item.cantidad).toFixed(2)}
                    ${entregado ? accionResenaHtml(pedido.id_pedido, item) : ''}
                </span>
            </div>
            <div id="form-resena-${pedido.id_pedido}-${item.id_producto}"></div>
        `).join('') + `
            ${entregado ? '' : '<p class="nota-resena">Podrás calificar estos productos cuando el pedido sea entregado.</p>'}
            <a href="confirmacion.php?id=${pedido.id_pedido}" style="color: var(--acento); font-size: 0.85rem;">Ver comprobante →</a>
        `;
        contenedor.dataset.cargado = '1';
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudo cargar el detalle de este pedido.</p>';
        console.error(error);
    }
}

// El cliente califica los productos de un pedido entregado

function accionResenaHtml(idPedido, item) {
    if (Number(item.resenado)) {
        return `<span class="resena-hecha">✓ Reseñado</span>`;
    }
    return `<button type="button" class="btn-secundario btn-calificar" id="btn-calificar-${idPedido}-${item.id_producto}"
                onclick="abrirFormularioResena(${idPedido}, ${item.id_producto})">Calificar</button>`;
}

function abrirFormularioResena(idPedido, idProducto) {
    const contenedor = document.getElementById(`form-resena-${idPedido}-${idProducto}`);
    if (contenedor.innerHTML.trim()) {
        contenedor.innerHTML = '';
        return;
    }

    contenedor.innerHTML = `
        <form class="formulario form-resena-pedido">
            <div class="selector-estrellas">
                ${[1, 2, 3, 4, 5].map(valor => `
                    <button type="button" class="estrella-input activa" data-valor="${valor}" aria-label="${valor} estrella${valor === 1 ? '' : 's'}">⭐️</button>
                `).join('')}
            </div>
            <input type="hidden" name="calificacion" value="5">
            <textarea name="comentario" rows="2" placeholder="Cuéntanos tu experiencia con este producto"></textarea>
            <p class="mensaje-error"></p>
            <button type="submit" class="btn-acento">Publicar reseña</button>
        </form>
    `;

    const form = contenedor.querySelector('form');
    form.querySelectorAll('.estrella-input').forEach(boton => {
        boton.addEventListener('click', () => {
            const valor = Number(boton.dataset.valor);
            form.calificacion.value = valor;
            form.querySelectorAll('.estrella-input').forEach(otro => {
                otro.classList.toggle('activa', Number(otro.dataset.valor) <= valor);
            });
        });
    });

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const mensajeError = form.querySelector('.mensaje-error');
        mensajeError.textContent = '';

        const datos = Object.fromEntries(new FormData(form));
        datos.id_producto = idProducto;

        try {
            const respuesta = await fetch('api/resenas.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                const error = await respuesta.json().catch(() => ({}));
                mensajeError.textContent = error.error || 'No se pudo publicar la reseña.';
                return;
            }

            contenedor.innerHTML = '';
            document.getElementById(`btn-calificar-${idPedido}-${idProducto}`)
                ?.replaceWith(Object.assign(document.createElement('span'), { className: 'resena-hecha', textContent: '✓ Reseñado' }));
            mostrarToast('✓ ¡Gracias por tu reseña!');
        } catch (error) {
            mensajeError.textContent = 'No se pudo conectar con el servidor.';
            console.error(error);
        }
    });
}

document.addEventListener('DOMContentLoaded', cargarPedidos);
