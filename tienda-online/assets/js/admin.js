// CRUD de productos en el panel de administración (RF16), consumiendo api/productos.php

async function cargarTablaProductos() {
    const cuerpo = document.getElementById('cuerpo-tabla-productos');

    try {
        const respuesta = await fetch('api/productos.php');
        if (!respuesta.ok) throw new Error('La API respondió con error');
        const productos = await respuesta.json();

        if (productos.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="7">No hay productos registrados.</td></tr>';
            return;
        }

        cuerpo.innerHTML = productos.map(producto => `
            <tr>
                <td>${producto.id_producto}</td>
                <td>${producto.nombre}</td>
                <td>Q${Number(producto.precio).toFixed(2)}</td>
                <td>${producto.precio_oferta ? 'Q' + Number(producto.precio_oferta).toFixed(2) : '—'}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.estado}</td>
                <td class="acciones">
                    <button class="btn-secundario" onclick='abrirModal(${JSON.stringify(producto)})'>Editar</button>
                    <button class="btn-peligro" onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        cuerpo.innerHTML = '<tr><td colspan="7">No se pudieron cargar los productos.</td></tr>';
        console.error(error);
    }
}

const CARPETA_IMAGENES_ADMIN = 'assets/img/productos/';

// Llena el select de categorías del modal de producto (en vez de escribir el ID a mano)
async function cargarOpcionesCategoria() {
    const select = document.getElementById('select-categoria-producto');
    try {
        const respuesta = await fetch('api/categorias.php');
        if (!respuesta.ok) throw new Error('La API respondió con error');
        const categorias = await respuesta.json();
        select.innerHTML = '<option value="">Selecciona una categoría</option>' + categorias.map(categoria =>
            `<option value="${categoria.id_categoria}">${categoria.nombre}</option>`
        ).join('');
    } catch (error) {
        select.innerHTML = '<option value="">No se pudieron cargar las categorías</option>';
        console.error(error);
    }
}

// Vista previa de la imagen actual (ruta guardada) o del archivo recién elegido
function mostrarVistaPrevia(idContenedor, src) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.innerHTML = src ? `<img src="${src}" alt="Vista previa">` : 'Sin imagen';
}

async function abrirModal(producto = null) {
    const modal = document.getElementById('modal-producto');
    const form = document.getElementById('form-producto');
    const titulo = document.getElementById('titulo-modal');

    form.reset();
    form.elements.id_producto.value = '';
    form.elements.imagen.value = '';
    form.elements.imagen2.value = '';
    document.getElementById('mensaje-error-producto').textContent = '';

    await cargarOpcionesCategoria();

    if (producto) {
        titulo.textContent = 'Editar producto';
        for (const campo in producto) {
            if (form.elements[campo]) form.elements[campo].value = producto[campo] ?? '';
        }
    } else {
        titulo.textContent = 'Agregar producto';
    }

    mostrarVistaPrevia('vista-previa-imagen', form.elements.imagen.value ? CARPETA_IMAGENES_ADMIN + form.elements.imagen.value : '');
    mostrarVistaPrevia('vista-previa-imagen2', form.elements.imagen2.value ? CARPETA_IMAGENES_ADMIN + form.elements.imagen2.value : '');

    modal.classList.remove('oculto');
}

// Sube el archivo a api/imagenes.php y devuelve la ruta que se guarda en el producto
async function subirImagenProducto(archivo) {
    const datos = new FormData();
    datos.append('imagen', archivo);

    const respuesta = await fetch('api/imagenes.php', { method: 'POST', body: datos });
    const resultado = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) throw new Error(resultado.error || 'No se pudo subir la imagen.');
    return resultado.imagen;
}

['imagen', 'imagen2'].forEach(campo => {
    document.getElementById(`archivo-${campo}`).addEventListener('change', evento => {
        const archivo = evento.target.files[0];
        if (archivo) mostrarVistaPrevia(`vista-previa-${campo}`, URL.createObjectURL(archivo));
    });
});

function cerrarModal() {
    document.getElementById('modal-producto').classList.add('oculto');
}

async function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;

    try {
        await fetch(`api/productos.php?id=${id}`, { method: 'DELETE' });
        cargarTablaProductos();
    } catch (error) {
        alert('No se pudo eliminar el producto.');
        console.error(error);
    }
}

document.getElementById('form-producto').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const form = evento.target;
    const datos = Object.fromEntries(new FormData(form));
    const id = datos.id_producto;
    delete datos.id_producto;

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `api/productos.php?id=${id}` : 'api/productos.php';
    const botonGuardar = form.querySelector('button[type="submit"]');

    try {
        // Primero se suben las imágenes nuevas (si se eligieron) y se guarda su ruta en el producto
        botonGuardar.disabled = true;
        for (const campo of ['imagen', 'imagen2']) {
            const archivo = document.getElementById(`archivo-${campo}`).files[0];
            if (archivo) datos[campo] = await subirImagenProducto(archivo);
        }

        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            document.getElementById('mensaje-error-producto').textContent = 'No se pudo guardar el producto.';
            return;
        }

        cerrarModal();
        cargarTablaProductos();
    } catch (error) {
        document.getElementById('mensaje-error-producto').textContent = error instanceof TypeError
            ? 'No se pudo conectar con el servidor.'
            : error.message;
        console.error(error);
    } finally {
        botonGuardar.disabled = false;
    }
});

document.addEventListener('DOMContentLoaded', cargarTablaProductos);

// Navegación entre secciones del panel (Productos / Categorías / Usuarios / Pedidos / Reseñas)

const cargasPorSeccion = {
    categorias: () => cargarTablaCategorias(),
    usuarios: () => cargarTablaUsuarios(),
    pedidos: () => cargarTablaPedidos(),
    resenas: () => cargarTablaResenas(),
};
const seccionesCargadas = new Set(['productos']);

function mostrarSeccion(nombre) {
    document.querySelectorAll('.seccion-admin').forEach(seccion => seccion.classList.add('oculto'));
    document.getElementById(`seccion-${nombre}`).classList.remove('oculto');

    document.querySelectorAll('.admin-sidebar a').forEach(enlace => enlace.classList.remove('activo'));
    document.getElementById(`nav-${nombre}`).classList.add('activo');

    if (!seccionesCargadas.has(nombre) && cargasPorSeccion[nombre]) {
        cargasPorSeccion[nombre]();
        seccionesCargadas.add(nombre);
    }
}

// CRUD de categorías (RF17), consumiendo api/categorias.php

async function cargarTablaCategorias() {
    const cuerpo = document.getElementById('cuerpo-tabla-categorias');

    try {
        const respuesta = await fetch('api/categorias.php');
        if (!respuesta.ok) throw new Error('La API respondió con error');
        const categorias = await respuesta.json();

        if (categorias.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="4">No hay categorías registradas.</td></tr>';
            return;
        }

        cuerpo.innerHTML = categorias.map(categoria => `
            <tr>
                <td>${categoria.id_categoria}</td>
                <td>${categoria.nombre}</td>
                <td>${categoria.descripcion ?? ''}</td>
                <td class="acciones">
                    <button class="btn-secundario" onclick='abrirModalCategoria(${JSON.stringify(categoria)})'>Editar</button>
                    <button class="btn-peligro" onclick="eliminarCategoria(${categoria.id_categoria})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        cuerpo.innerHTML = '<tr><td colspan="4">No se pudieron cargar las categorías.</td></tr>';
        console.error(error);
    }
}

function abrirModalCategoria(categoria = null) {
    const modal = document.getElementById('modal-categoria');
    const form = document.getElementById('form-categoria');
    const titulo = document.getElementById('titulo-modal-categoria');

    form.reset();
    document.getElementById('mensaje-error-categoria').textContent = '';

    if (categoria) {
        titulo.textContent = 'Editar categoría';
        for (const campo in categoria) {
            if (form.elements[campo]) form.elements[campo].value = categoria[campo];
        }
    } else {
        titulo.textContent = 'Agregar categoría';
    }

    modal.classList.remove('oculto');
}

function cerrarModalCategoria() {
    document.getElementById('modal-categoria').classList.add('oculto');
}

async function eliminarCategoria(id) {
    if (!confirm('¿Eliminar esta categoría?')) return;

    try {
        await fetch(`api/categorias.php?id=${id}`, { method: 'DELETE' });
        cargarTablaCategorias();
    } catch (error) {
        alert('No se pudo eliminar la categoría.');
        console.error(error);
    }
}

document.getElementById('form-categoria').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const form = evento.target;
    const datos = Object.fromEntries(new FormData(form));
    const id = datos.id_categoria;
    delete datos.id_categoria;

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `api/categorias.php?id=${id}` : 'api/categorias.php';

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const error = await respuesta.json().catch(() => ({}));
            document.getElementById('mensaje-error-categoria').textContent = error.error || 'No se pudo guardar la categoría.';
            return;
        }

        cerrarModalCategoria();
        cargarTablaCategorias();
    } catch (error) {
        document.getElementById('mensaje-error-categoria').textContent = 'No se pudo conectar con el servidor.';
        console.error(error);
    }
});

// Administración de usuarios (RF18), consumiendo api/usuarios.php

// Se guarda la lista para que "Editar" busque al usuario por id, sin incrustar su JSON en el onclick
let usuariosAdmin = [];

async function cargarTablaUsuarios() {
    const cuerpo = document.getElementById('cuerpo-tabla-usuarios');

    try {
        const respuesta = await fetch('api/usuarios.php');
        if (!respuesta.ok) {
            cuerpo.innerHTML = '<tr><td colspan="6">Debes iniciar sesión como administrador para ver los usuarios.</td></tr>';
            return;
        }
        const usuarios = await respuesta.json();
        usuariosAdmin = usuarios;

        if (usuarios.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="6">No hay usuarios registrados.</td></tr>';
            return;
        }

        cuerpo.innerHTML = usuarios.map(usuario => `
            <tr>
                <td>${usuario.id_usuario}</td>
                <td>${escaparHtmlAdmin(usuario.nombre)} ${escaparHtmlAdmin(usuario.apellido)}</td>
                <td>${escaparHtmlAdmin(usuario.correo)}</td>
                <td>${usuario.tipo_usuario}</td>
                <td>${usuario.creado_en ?? ''}</td>
                <td class="acciones">
                    <button class="btn-secundario" onclick="abrirModalUsuario(usuariosAdmin.find(u => u.id_usuario === ${usuario.id_usuario}))">Editar</button>
                    <button class="btn-peligro" onclick="eliminarUsuario(${usuario.id_usuario})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        cuerpo.innerHTML = '<tr><td colspan="6">No se pudieron cargar los usuarios.</td></tr>';
        console.error(error);
    }
}

function abrirModalUsuario(usuario = null) {
    const modal = document.getElementById('modal-usuario');
    const form = document.getElementById('form-usuario');
    const titulo = document.getElementById('titulo-modal-usuario');
    const etiquetaPassword = document.getElementById('etiqueta-password-usuario');

    form.reset();
    form.elements.id_usuario.value = '';
    document.getElementById('mensaje-error-usuario').textContent = '';

    if (usuario) {
        titulo.textContent = 'Editar usuario';
        etiquetaPassword.textContent = 'Nueva contraseña (dejar vacío para no cambiarla)';
        form.elements.password.required = false;
        for (const campo in usuario) {
            if (form.elements[campo]) form.elements[campo].value = usuario[campo];
        }
    } else {
        titulo.textContent = 'Agregar usuario';
        etiquetaPassword.textContent = 'Contraseña';
        form.elements.password.required = true;
    }

    modal.classList.remove('oculto');
}

function cerrarModalUsuario() {
    document.getElementById('modal-usuario').classList.add('oculto');
}

async function eliminarUsuario(id) {
    if (!confirm('¿Eliminar este usuario?')) return;

    try {
        const respuesta = await fetch(`api/usuarios.php?id=${id}`, { method: 'DELETE' });
        if (!respuesta.ok) {
            alert('No se pudo eliminar el usuario.');
            return;
        }
        cargarTablaUsuarios();
    } catch (error) {
        alert('No se pudo eliminar el usuario.');
        console.error(error);
    }
}

// Gestión de pedidos (RF13), consumiendo api/pedidos.php

const ESTADOS_PEDIDO = ['pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado'];

async function cargarTablaPedidos() {
    const cuerpo = document.getElementById('cuerpo-tabla-pedidos');

    try {
        const respuesta = await fetch('api/pedidos.php?todos=1');
        if (!respuesta.ok) {
            cuerpo.innerHTML = '<tr><td colspan="6">Debes iniciar sesión como administrador para ver los pedidos.</td></tr>';
            return;
        }
        const pedidos = await respuesta.json();

        if (pedidos.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="6">No hay pedidos registrados.</td></tr>';
            return;
        }

        cuerpo.innerHTML = pedidos.map(pedido => `
            <tr>
                <td>${pedido.id_pedido}</td>
                <td>${escaparHtmlAdmin(pedido.nombre)} ${escaparHtmlAdmin(pedido.apellido)}<br><small>${escaparHtmlAdmin(pedido.correo)}</small></td>
                <td>${pedido.fecha}</td>
                <td>Q${Number(pedido.total).toFixed(2)}</td>
                <td>
                    <select id="estado-pedido-${pedido.id_pedido}">
                        ${ESTADOS_PEDIDO.map(estado => `
                            <option value="${estado}" ${estado === pedido.estado ? 'selected' : ''}>${estado}</option>
                        `).join('')}
                    </select>
                </td>
                <td class="acciones">
                    <button class="btn-secundario" onclick="actualizarEstadoPedido(event, ${pedido.id_pedido})">Guardar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        cuerpo.innerHTML = '<tr><td colspan="6">No se pudieron cargar los pedidos.</td></tr>';
        console.error(error);
    }
}

async function actualizarEstadoPedido(evento, idPedido) {
    const estado = document.getElementById(`estado-pedido-${idPedido}`).value;
    const boton = evento.target;
    const textoOriginal = boton.textContent;

    try {
        const respuesta = await fetch(`api/pedidos.php?id=${idPedido}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado })
        });

        if (!respuesta.ok) throw new Error('No se pudo actualizar');

        boton.textContent = '✓ Guardado';
        setTimeout(() => { boton.textContent = textoOriginal; }, 1500);
    } catch (error) {
        alert('No se pudo actualizar el estado del pedido.');
        console.error(error);
    }
}

document.getElementById('form-usuario').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const form = evento.target;
    const datos = Object.fromEntries(new FormData(form));
    const id = datos.id_usuario;
    delete datos.id_usuario;
    if (id && !datos.password) delete datos.password; // al editar, vacío = conservar la contraseña actual

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `api/usuarios.php?id=${id}` : 'api/usuarios.php';

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const error = await respuesta.json().catch(() => ({}));
            document.getElementById('mensaje-error-usuario').textContent = error.error || 'No se pudo guardar el usuario.';
            return;
        }

        cerrarModalUsuario();
        cargarTablaUsuarios();
    } catch (error) {
        document.getElementById('mensaje-error-usuario').textContent = 'No se pudo conectar con el servidor.';
        console.error(error);
    }
});

// Moderación de reseñas (RF14), consumiendo api/resenas.php

let resenasAdmin = [];

// Texto escrito por clientes (nombres, correos, comentarios): se escapa antes de insertarlo en el HTML
function escaparHtmlAdmin(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, caracter => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[caracter]);
}

async function cargarTablaResenas() {
    const cuerpo = document.getElementById('cuerpo-tabla-resenas');

    try {
        const respuesta = await fetch('api/resenas.php');
        if (!respuesta.ok) throw new Error('La API respondió con error');
        const datos = await respuesta.json();

        resenasAdmin = datos.resenas;
        const { total, promedio } = datos.resumen;
        document.getElementById('resumen-admin-resenas').textContent =
            total > 0 ? `${total} reseñas · promedio ${promedio.toFixed(1)} ★` : '';

        renderizarTablaResenas();
    } catch (error) {
        cuerpo.innerHTML = '<tr><td colspan="7">No se pudieron cargar las reseñas.</td></tr>';
        console.error(error);
    }
}

function renderizarTablaResenas() {
    const cuerpo = document.getElementById('cuerpo-tabla-resenas');
    const calificacion = Number(document.getElementById('filtro-admin-resenas').value);
    const resenas = resenasAdmin.filter(resena => !calificacion || resena.calificacion === calificacion);

    if (resenas.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="7">No hay reseñas registradas.</td></tr>';
        return;
    }

    cuerpo.innerHTML = resenas.map(resena => `
        <tr>
            <td>${resena.id_resena}</td>
            <td><a href="producto.php?id=${resena.id_producto}" target="_blank" style="color: var(--acento);">${escaparHtmlAdmin(resena.producto)}</a></td>
            <td>${escaparHtmlAdmin(resena.nombre)} ${escaparHtmlAdmin(resena.apellido)}</td>
            <td class="celda-estrellas">${'★'.repeat(resena.calificacion)}${'☆'.repeat(5 - resena.calificacion)}</td>
            <td class="celda-comentario">${escaparHtmlAdmin(resena.comentario) || '—'}</td>
            <td style="white-space: nowrap;">${resena.fecha.slice(0, 10)}</td>
            <td class="acciones">
                <button class="btn-peligro" onclick="eliminarResena(${resena.id_resena})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function eliminarResena(id) {
    if (!confirm('¿Eliminar esta reseña? Dejará de mostrarse en la tienda.')) return;

    try {
        const respuesta = await fetch(`api/resenas.php?id=${id}`, { method: 'DELETE' });
        if (!respuesta.ok) {
            alert('No se pudo eliminar la reseña.');
            return;
        }
        cargarTablaResenas();
    } catch (error) {
        alert('No se pudo eliminar la reseña.');
        console.error(error);
    }
}

// Sesión del administrador en el header: nombre y cierre de sesión (RF02)

async function mostrarUsuarioAdmin() {
    try {
        const respuesta = await fetch('api/auth.php');
        if (!respuesta.ok) return;
        const usuario = await respuesta.json();
        document.getElementById('admin-usuario').textContent = `👤 ${usuario.nombre} ${usuario.apellido}`;
    } catch (error) {
        console.error(error);
    }
}

async function cerrarSesionAdmin() {
    const boton = document.getElementById('btn-cerrar-sesion-admin');
    boton.disabled = true;
    try {
        await fetch('api/auth.php', { method: 'DELETE' });
    } catch (error) {
        console.error(error);
    } finally {
        window.location.href = 'login.php';
    }
}

document.addEventListener('DOMContentLoaded', mostrarUsuarioAdmin);
