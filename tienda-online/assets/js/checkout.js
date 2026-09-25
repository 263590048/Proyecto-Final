// Proceso de pago (RF13): datos de envío, método de pago y registro del pedido (RF11).
// Al terminar redirige a confirmacion.php (RF20).

const formCheckout = document.getElementById('form-checkout');

function mostrarErrorCheckout(mensaje) {
    document.getElementById('mensaje-error').textContent = mensaje;
}

function renderizarResumen() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        window.location.href = 'carrito.php';
        return;
    }

    document.getElementById('resumen-items').innerHTML = carrito.map(item => `
        <div class="fila">
            <span>${item.nombre} × ${item.cantidad}</span>
            <span>Q${(item.precio * item.cantidad).toFixed(2)}</span>
        </div>
    `).join('');

    const total = calcularTotal(carrito);
    document.getElementById('subtotal').textContent = `Q${total.toFixed(2)}`;
    document.getElementById('total').textContent = `Q${total.toFixed(2)}`;
}

// Se necesita sesión para pagar; de paso se prellenan dirección y teléfono del perfil
async function cargarDatosCliente() {
    try {
        const respuesta = await fetch('api/auth.php');
        if (respuesta.status === 401) {
            alert('Debes iniciar sesión para completar tu compra.');
            window.location.href = 'login.php?volver=checkout.php';
            return;
        }
        const usuario = await respuesta.json();
        document.getElementById('direccion_envio').value = usuario.direccion || '';
        document.getElementById('telefono_contacto').value = usuario.telefono || '';
    } catch (error) {
        console.error(error);
    }
}

function llenarSelectoresVencimiento() {
    const selectMes = document.getElementById('mes-vencimiento');
    const selectAnio = document.getElementById('anio-vencimiento');
    const anioActual = new Date().getFullYear();

    selectMes.innerHTML = '<option value="">MM</option>' + Array.from({ length: 12 }, (_, i) => {
        const mes = String(i + 1).padStart(2, '0');
        return `<option value="${mes}">${mes}</option>`;
    }).join('');

    selectAnio.innerHTML = '<option value="">AAAA</option>' + Array.from({ length: 11 }, (_, i) => {
        const anio = anioActual + i;
        return `<option value="${anio}">${anio}</option>`;
    }).join('');
}

function metodoSeleccionado() {
    return formCheckout.querySelector('input[name="metodo_pago"]:checked').value;
}

// Muestra los campos de tarjeta solo cuando se elige ese método
function actualizarMetodoPago() {
    const metodo = metodoSeleccionado();
    document.getElementById('datos-tarjeta').classList.toggle('oculto', metodo !== 'tarjeta');
    document.getElementById('info-transferencia').classList.toggle('oculto', metodo !== 'transferencia');
    document.getElementById('info-contra-entrega').classList.toggle('oculto', metodo !== 'contra_entrega');
    mostrarErrorCheckout('');
}

// Agrupa el número de tarjeta de 4 en 4 mientras se escribe
function formatearNumeroTarjeta(evento) {
    const digitos = evento.target.value.replace(/\D/g, '').slice(0, 19);
    evento.target.value = digitos.replace(/(\d{4})(?=\d)/g, '$1 ');
}

// Validación básica en el navegador; la validación definitiva la hace el servidor
function validarFormulario(datos) {
    if (!datos.direccion_envio.trim()) return 'Ingresa la dirección de envío.';
    if (datos.telefono_contacto && !/^[\d\s+\-]{8,20}$/.test(datos.telefono_contacto)) {
        return 'El teléfono de contacto no es válido.';
    }

    if (datos.metodo_pago === 'tarjeta') {
        const numero = datos.numero.replace(/\D/g, '');
        if (!datos.titular.trim()) return 'Ingresa el nombre del titular de la tarjeta.';
        if (numero.length < 13 || numero.length > 19) return 'El número de tarjeta no es válido.';
        if (!datos.mes || !datos.anio) return 'Selecciona la fecha de vencimiento de la tarjeta.';
        if (!/^\d{3,4}$/.test(datos.cvv)) return 'El CVV debe tener 3 o 4 dígitos.';
    }

    return '';
}

async function pagarPedido(evento) {
    evento.preventDefault();
    mostrarErrorCheckout('');

    const datos = Object.fromEntries(new FormData(formCheckout));
    const error = validarFormulario(datos);
    if (error) {
        mostrarErrorCheckout(error);
        return;
    }

    const cuerpo = {
        items: obtenerCarrito().map(item => ({ id_producto: item.id_producto, cantidad: item.cantidad })),
        direccion_envio: datos.direccion_envio,
        telefono_contacto: datos.telefono_contacto,
        metodo_pago: datos.metodo_pago
    };
    if (datos.metodo_pago === 'tarjeta') {
        cuerpo.tarjeta = {
            titular: datos.titular,
            numero: datos.numero.replace(/\D/g, ''),
            mes: datos.mes,
            anio: datos.anio,
            cvv: datos.cvv
        };
    }

    const boton = document.getElementById('btn-pagar');
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Procesando pago...';

    try {
        const respuesta = await fetch('api/pedidos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpo)
        });

        if (respuesta.status === 401) {
            alert('Tu sesión expiró. Inicia sesión para completar tu compra.');
            window.location.href = 'login.php';
            return;
        }

        const resultado = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            mostrarErrorCheckout(resultado.error || 'No se pudo completar el pago.');
            return;
        }

        vaciarCarritoSinConfirmar();
        window.location.href = `confirmacion.php?id=${resultado.id_pedido}`;
    } catch (error) {
        mostrarErrorCheckout('No se pudo conectar con el servidor.');
        console.error(error);
    } finally {
        boton.disabled = false;
        boton.textContent = textoOriginal;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarResumen();
    cargarDatosCliente();
    llenarSelectoresVencimiento();
    actualizarMetodoPago();

    formCheckout.querySelectorAll('input[name="metodo_pago"]').forEach(opcion => {
        opcion.addEventListener('change', actualizarMetodoPago);
    });
    document.getElementById('numero-tarjeta').addEventListener('input', formatearNumeroTarjeta);
    formCheckout.addEventListener('submit', pagarPedido);
});
