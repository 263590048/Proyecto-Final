// Página de inicio: muestra productos destacados, 2 por categoría (RF04)

async function cargarDestacados() {
    const contenedor = document.getElementById('grid-destacados');

    try {
        const respuesta = await fetch('api/productos.php');
        if (!respuesta.ok) throw new Error('La API respondió con error');
        const productos = await respuesta.json();
        const destacados = seleccionarDestacadosPorCategoria(productos, 2);

        contenedor.innerHTML = destacados.map(producto => `
            <div class="tarjeta-producto">
                <a href="producto.php?id=${producto.id_producto}">
                    <div class="imagen-producto">📦</div>
                    <h3>${producto.nombre}</h3>
                </a>
                <p class="precio">Q${Number(producto.precio).toFixed(2)}</p>
                <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
            </div>
        `).join('');
    } catch (error) {
        contenedor.innerHTML = '<p>No se pudieron cargar los productos.</p>';
        console.error(error);
    }
}

function seleccionarDestacadosPorCategoria(productos, cantidadPorCategoria) {
    const porCategoria = {};

    for (const producto of productos) {
        const idCategoria = producto.id_categoria;
        if (!porCategoria[idCategoria]) porCategoria[idCategoria] = [];
        if (porCategoria[idCategoria].length < cantidadPorCategoria) {
            porCategoria[idCategoria].push(producto);
        }
    }

    return Object.values(porCategoria).flat();
}

function moverCarrusel(direccion) {
    const pista = document.getElementById('grid-destacados');
    const tarjeta = pista.querySelector('.tarjeta-producto');
    const distancia = tarjeta ? tarjeta.offsetWidth + 24 : 240;
    pista.scrollBy({ left: distancia * direccion, behavior: 'smooth' });
}

let intervaloCarrusel = null;

function iniciarAutoAvanceCarrusel() {
    detenerAutoAvanceCarrusel();
    intervaloCarrusel = setInterval(() => {
        const pista = document.getElementById('grid-destacados');
        if (!pista) return;

        const llegoAlFinal = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 5;
        if (llegoAlFinal) {
            pista.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            moverCarrusel(1);
        }
    }, 4000);
}

function detenerAutoAvanceCarrusel() {
    if (intervaloCarrusel) {
        clearInterval(intervaloCarrusel);
        intervaloCarrusel = null;
    }
}

// TODO: enviar el formulario a un endpoint real (correo o backend) cuando esté disponible
const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    formContacto.addEventListener('submit', (evento) => {
        evento.preventDefault();
        document.getElementById('mensaje-contacto').textContent = '¡Gracias! Te contactaremos pronto.';
        formContacto.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDestacados();

    const carrusel = document.querySelector('.carrusel-destacados');
    if (carrusel) {
        carrusel.addEventListener('mouseenter', detenerAutoAvanceCarrusel);
        carrusel.addEventListener('mouseleave', iniciarAutoAvanceCarrusel);
        iniciarAutoAvanceCarrusel();
    }
});
