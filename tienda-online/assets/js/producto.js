// Detalle de un producto (RF07), reseñas (RF14) y lista de deseos (RF15)

let IMAGENES_PRODUCTO_ACTUAL = [];
let INDICE_IMAGEN_ACTUAL = 0;
let USUARIO_SESION = null;

async function obtenerSesion() {
    try {
        const respuesta = await fetch('api/auth.php');
        return respuesta.ok ? await respuesta.json() : null;
    } catch {
        return null;
    }
}

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

        USUARIO_SESION = await obtenerSesion();
        renderizarBotonWishlist(producto);
        cargarResenas(producto.id_producto);
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
                <div id="accion-wishlist"></div>
            </div>
        </div>
    `;
}

// RF15: lista de deseos

async function renderizarBotonWishlist(producto) {
    if (!USUARIO_SESION) {
        pintarBotonWishlist(producto.id_producto, false, false);
        return;
    }

    let enLista = false;
    try {
        const respuesta = await fetch('api/wishlist.php');
        if (respuesta.ok) {
            const lista = await respuesta.json();
            enLista = lista.some(item => item.id_producto === producto.id_producto);
        }
    } catch (error) {
        console.error(error);
    }

    pintarBotonWishlist(producto.id_producto, enLista, true);
}

function pintarBotonWishlist(idProducto, enLista, sesionActiva) {
    const contenedor = document.getElementById('accion-wishlist');
    if (!contenedor) return;

    if (!sesionActiva) {
        contenedor.innerHTML = `<a href="login.php" class="btn-secundario" style="display: block; text-align: center; margin-top: 0.5rem;">Inicia sesión para guardar en tu lista de deseos</a>`;
        return;
    }

    contenedor.innerHTML = `
        <button type="button" class="btn-secundario" style="width: 100%; margin-top: 0.5rem;" onclick="toggleWishlist(${idProducto}, ${enLista})">
            ${enLista ? '♥ Quitar de mi lista de deseos' : '♡ Guardar en lista de deseos'}
        </button>
    `;
}

async function toggleWishlist(idProducto, estaEnLista) {
    try {
        if (estaEnLista) {
            await fetch(`api/wishlist.php?id_producto=${idProducto}`, { method: 'DELETE' });
            pintarBotonWishlist(idProducto, false, true);
            mostrarToast('Producto quitado de tu lista de deseos');
        } else {
            const respuesta = await fetch('api/wishlist.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_producto: idProducto })
            });
            if (!respuesta.ok) throw new Error('No se pudo guardar');
            pintarBotonWishlist(idProducto, true, true);
            mostrarToast('✓ Guardado en tu lista de deseos');
        }
    } catch (error) {
        alert('No se pudo actualizar tu lista de deseos.');
        console.error(error);
    }
}

// RF14: reseñas y calificaciones

async function cargarResenas(idProducto) {
    const contenedor = document.getElementById('seccion-resenas');
    try {
        const respuesta = await fetch(`api/resenas.php?id_producto=${idProducto}`);
        if (!respuesta.ok) throw new Error('Error al cargar reseñas');
        const datos = await respuesta.json();
        renderizarResenas(idProducto, datos.resenas, datos.resumen, datos.puede_resenar);
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudieron cargar las reseñas.</p>';
        console.error(error);
    }
}

function renderizarResenas(idProducto, resenas, resumen, puedeResenar) {
    const contenedor = document.getElementById('seccion-resenas');

    const promedioHtml = resumen.total > 0
        ? `<strong>${resumen.promedio} / 5</strong> · ${resumen.total} reseña${resumen.total === 1 ? '' : 's'}`
        : 'Todavía no hay reseñas para este producto.';

    const listaHtml = resenas.map(resena => `
        <div class="resena">
            <div class="resena-cabecera">
                <strong>${escaparHtml(resena.nombre)} ${escaparHtml(resena.apellido)}</strong>
                <span class="resena-estrellas">${'⭐️'.repeat(resena.calificacion)}${'☆'.repeat(5 - resena.calificacion)}</span>
            </div>
            ${resena.comentario ? `<p>${escaparHtml(resena.comentario)}</p>` : ''}
        </div>
    `).join('');

    let formularioHtml;
    if (!USUARIO_SESION) {
        formularioHtml = `<p style="margin-top: 1rem;"><a href="login.php" style="color: var(--acento);">Inicia sesión</a> para dejar una reseña (solo si ya compraste el producto).</p>`;
    } else if (!puedeResenar) {
        formularioHtml = `<p style="margin-top: 1rem; color: var(--texto-suave);">Solo puedes dejar una reseña de productos que ya hayas comprado.</p>`;
    } else {
        formularioHtml = `
            <form class="formulario" id="form-resena" style="max-width: 100%; margin: 1.5rem 0 0; box-shadow: none; padding: 0;">
                <label>
                    Calificación
                    <div class="selector-estrellas" id="selector-estrellas">
                        ${[1, 2, 3, 4, 5].map(valor => `
                            <button type="button" class="estrella-input activa" data-valor="${valor}" aria-label="${valor} estrella${valor === 1 ? '' : 's'}">⭐️</button>
                        `).join('')}
                    </div>
                    <input type="hidden" name="calificacion" id="input-calificacion" value="5">
                </label>
                <label>
                    Comentario
                    <textarea name="comentario" rows="3" placeholder="Cuéntanos tu experiencia con este producto"></textarea>
                </label>
                <p class="mensaje-error" id="mensaje-error-resena"></p>
                <button type="submit" class="btn-acento">Publicar reseña</button>
            </form>
        `;
    }

    contenedor.innerHTML = `
        <div style="background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); padding: 2rem; margin-top: 1.5rem;">
            <h3 style="color: var(--azul-oscuro);">Reseñas de clientes</h3>
            <p style="color: var(--texto-suave); margin: 0.4rem 0 1rem;">${promedioHtml}</p>
            ${listaHtml}
            ${formularioHtml}
        </div>
    `;

    const selectorEstrellas = document.getElementById('selector-estrellas');
    if (selectorEstrellas) {
        selectorEstrellas.querySelectorAll('.estrella-input').forEach(boton => {
            boton.addEventListener('click', () => {
                const valor = Number(boton.dataset.valor);
                document.getElementById('input-calificacion').value = valor;
                selectorEstrellas.querySelectorAll('.estrella-input').forEach(otro => {
                    otro.classList.toggle('activa', Number(otro.dataset.valor) <= valor);
                });
            });
        });
    }

    const form = document.getElementById('form-resena');
    if (form) {
        form.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            document.getElementById('mensaje-error-resena').textContent = '';

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
                    document.getElementById('mensaje-error-resena').textContent = error.error || 'No se pudo publicar la reseña.';
                    return;
                }

                cargarResenas(idProducto);
            } catch (error) {
                document.getElementById('mensaje-error-resena').textContent = 'No se pudo conectar con el servidor.';
                console.error(error);
            }
        });
    }
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
