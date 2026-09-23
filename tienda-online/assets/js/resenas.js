// Página de todas las reseñas (RF14): resumen general, filtros y listado, consumiendo api/resenas.php

let todasLasResenas = [];

// El comentario lo escribe el cliente: se escapa antes de insertarlo en el HTML
function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

function estrellasHtml(calificacion) {
    return '⭐️'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
}

function renderizarResumenResenas(resumen) {
    const contenedor = document.getElementById('resumen-resenas');

    if (resumen.total === 0) {
        contenedor.innerHTML = '<p>Todavía no hay reseñas.</p>';
        return;
    }

    const filas = [5, 4, 3, 2, 1].map(estrellas => {
        const cantidad = resumen.distribucion[estrellas] ?? 0;
        const porcentaje = Math.round((cantidad / resumen.total) * 100);
        return `
            <button type="button" class="fila-distribucion" onclick="filtrarPorCalificacion(${estrellas})"
                    aria-label="Ver reseñas de ${estrellas} estrella${estrellas === 1 ? '' : 's'}">
                <span>${estrellas} ★</span>
                <span class="barra-distribucion"><span style="width: ${porcentaje}%"></span></span>
                <span>${cantidad}</span>
            </button>
        `;
    }).join('');

    contenedor.innerHTML = `
        <div class="promedio-general">${resumen.promedio.toFixed(1)}</div>
        <div class="resena-estrellas">${estrellasHtml(Math.round(resumen.promedio))}</div>
        <p class="total-resenas">${resumen.total} reseña${resumen.total === 1 ? '' : 's'}</p>
        <div class="distribucion-resenas">${filas}</div>
    `;
}

function llenarFiltroCategorias() {
    const categorias = [...new Set(todasLasResenas.map(resena => resena.categoria))].sort();
    document.getElementById('filtro-categoria-resena').innerHTML +=
        categorias.map(categoria => `<option value="${escaparHtml(categoria)}">${escaparHtml(categoria)}</option>`).join('');
}

function filtrarPorCalificacion(estrellas) {
    document.getElementById('filtro-calificacion-resena').value = String(estrellas);
    aplicarFiltrosResenas();
}

function aplicarFiltrosResenas() {
    const texto = document.getElementById('buscar-resena').value.trim().toLowerCase();
    const categoria = document.getElementById('filtro-categoria-resena').value;
    const calificacion = Number(document.getElementById('filtro-calificacion-resena').value);
    const orden = document.getElementById('orden-resenas').value;

    const filtradas = todasLasResenas.filter(resena =>
        (!texto || resena.producto.toLowerCase().includes(texto) || (resena.comentario ?? '').toLowerCase().includes(texto))
        && (!categoria || resena.categoria === categoria)
        && (!calificacion || resena.calificacion === calificacion)
    );

    filtradas.sort((a, b) => {
        if (orden === 'mejor') return b.calificacion - a.calificacion || b.fecha.localeCompare(a.fecha);
        if (orden === 'peor') return a.calificacion - b.calificacion || b.fecha.localeCompare(a.fecha);
        return b.fecha.localeCompare(a.fecha);
    });

    renderizarListaResenas(filtradas);
}

function renderizarListaResenas(resenas) {
    const contenedor = document.getElementById('lista-resenas');
    document.getElementById('conteo-resenas').textContent =
        `Mostrando ${resenas.length} de ${todasLasResenas.length} reseñas`;

    if (resenas.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio">No hay reseñas que coincidan con los filtros.</p>';
        return;
    }

    contenedor.innerHTML = resenas.map(resena => `
        <article class="tarjeta-resena">
            <a href="producto.php?id=${resena.id_producto}" class="imagen-producto">${imagenProductoHtml({ imagen: resena.imagen, nombre: resena.producto })}</a>
            <div class="tarjeta-resena-contenido">
                <div class="resena-cabecera">
                    <a href="producto.php?id=${resena.id_producto}" class="resena-producto">${escaparHtml(resena.producto)}</a>
                    <span class="resena-estrellas">${estrellasHtml(resena.calificacion)}</span>
                </div>
                <span class="resena-categoria">${escaparHtml(resena.categoria)}</span>
                ${resena.comentario ? `<p>${escaparHtml(resena.comentario)}</p>` : ''}
                <span class="resena-autor">${escaparHtml(resena.nombre)} ${escaparHtml(resena.apellido.charAt(0))}. · ${resena.fecha.slice(0, 10)}</span>
            </div>
        </article>
    `).join('');
}

async function cargarTodasLasResenas() {
    try {
        const respuesta = await fetch('api/resenas.php');
        if (!respuesta.ok) throw new Error('Error al cargar reseñas');

        const datos = await respuesta.json();
        todasLasResenas = datos.resenas;

        renderizarResumenResenas(datos.resumen);
        llenarFiltroCategorias();
        aplicarFiltrosResenas();
    } catch (error) {
        document.getElementById('lista-resenas').innerHTML = '<p>No se pudieron cargar las reseñas.</p>';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarTodasLasResenas();
    document.getElementById('buscar-resena').addEventListener('input', aplicarFiltrosResenas);
    ['filtro-categoria-resena', 'filtro-calificacion-resena', 'orden-resenas'].forEach(id => {
        document.getElementById(id).addEventListener('change', aplicarFiltrosResenas);
    });
});
