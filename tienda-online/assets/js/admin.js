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

function abrirModal(producto = null) {
    const modal = document.getElementById('modal-producto');
    const form = document.getElementById('form-producto');
    const titulo = document.getElementById('titulo-modal');

    form.reset();
    document.getElementById('mensaje-error-producto').textContent = '';

    if (producto) {
        titulo.textContent = 'Editar producto';
        for (const campo in producto) {
            if (form.elements[campo]) form.elements[campo].value = producto[campo];
        }
    } else {
        titulo.textContent = 'Agregar producto';
    }

    modal.classList.remove('oculto');
}

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

    try {
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
        document.getElementById('mensaje-error-producto').textContent = 'No se pudo conectar con el servidor.';
        console.error(error);
    }
});

document.addEventListener('DOMContentLoaded', cargarTablaProductos);

// Navegación entre secciones del panel (Productos / Categorías / Usuarios)

const cargasPorSeccion = {
    categorias: () => cargarTablaCategorias(),
    usuarios: () => cargarTablaUsuarios(),
    pedidos: () => cargarTablaPedidos(),
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

async function cargarTablaUsuarios() {
    const cuerpo = document.getElementById('cuerpo-tabla-usuarios');

    try {
        const respuesta = await fetch('api/usuarios.php');
        if (!respuesta.ok) {
            cuerpo.innerHTML = '<tr><td colspan="6">Debes iniciar sesión como administrador para ver los usuarios.</td></tr>';
            return;
        }
        const usuarios = await respuesta.json();

        if (usuarios.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="6">No hay usuarios registrados.</td></tr>';
            return;
        }

        cuerpo.innerHTML = usuarios.map(usuario => `
            <tr>
                <td>${usuario.id_usuario}</td>
                <td>${usuario.nombre} ${usuario.apellido}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.tipo_usuario}</td>
                <td>${usuario.creado_en ?? ''}</td>
                <td class="acciones">
                    <button class="btn-secundario" onclick='abrirModalUsuario(${JSON.stringify(usuario)})'>Editar</button>
                    <button class="btn-peligro" onclick="eliminarUsuario(${usuario.id_usuario})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        cuerpo.innerHTML = '<tr><td colspan="6">No se pudieron cargar los usuarios.</td></tr>';
        console.error(error);
    }
}

function abrirModalUsuario(usuario) {
    const modal = document.getElementById('modal-usuario');
    const form = document.getElementById('form-usuario');

    form.reset();
    document.getElementById('mensaje-error-usuario').textContent = '';

    for (const campo in usuario) {
        if (form.elements[campo]) form.elements[campo].value = usuario[campo];
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

const ESTADOS_PEDIDO = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

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
                <td>${pedido.nombre} ${pedido.apellido}<br><small>${pedido.correo}</small></td>
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

    try {
        const respuesta = await fetch(`api/usuarios.php?id=${id}`, {
            method: 'PUT',
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
