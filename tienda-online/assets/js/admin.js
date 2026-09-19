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
