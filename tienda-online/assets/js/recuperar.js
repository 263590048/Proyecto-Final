// Recuperación de contraseña (RF03): solicitar el enlace y fijar la nueva contraseña

function mostrarError(mensaje) {
    document.getElementById('mensaje-error').textContent = mensaje;
}

// El texto viene del servidor; se inserta como texto, y el enlace de desarrollo como <a>
function mostrarMensaje(idContenedor, texto, enlace = null) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.textContent = texto;

    if (enlace) {
        const aviso = document.createElement('p');
        aviso.innerHTML = '<strong>Modo desarrollo:</strong> no hay servidor de correo configurado, así que el enlace se muestra aquí:';
        const vinculo = document.createElement('a');
        vinculo.href = enlace;
        vinculo.textContent = 'Restablecer mi contraseña →';
        vinculo.style.color = 'var(--acento)';
        contenedor.append(aviso, vinculo);
    }

    contenedor.classList.remove('oculto');
}

const formRecuperar = document.getElementById('form-recuperar');
if (formRecuperar) {
    formRecuperar.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mostrarError('');

        const correo = formRecuperar.elements.correo.value.trim();
        if (!formRecuperar.elements.correo.checkValidity() || !correo) {
            mostrarError('Ingresa un correo electrónico válido.');
            return;
        }

        const boton = formRecuperar.querySelector('button[type="submit"]');
        boton.disabled = true;

        try {
            const respuesta = await fetch('api/recuperar.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo })
            });
            const datos = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok) {
                mostrarError(datos.error || 'No se pudo procesar la solicitud.');
                return;
            }

            mostrarMensaje('mensaje-recuperar', datos.mensaje, datos.enlace_desarrollo);
        } catch (error) {
            mostrarError('No se pudo conectar con el servidor.');
            console.error(error);
        } finally {
            boton.disabled = false;
        }
    });
}

const formRestablecer = document.getElementById('form-restablecer');
if (formRestablecer) {
    const token = new URLSearchParams(window.location.search).get('token') || '';
    if (!token) {
        mostrarError('El enlace no es válido. Solicita uno nuevo.');
        formRestablecer.querySelector('button[type="submit"]').disabled = true;
    }

    formRestablecer.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mostrarError('');

        const { password, confirmacion } = Object.fromEntries(new FormData(formRestablecer));
        if (password.length < 6) {
            mostrarError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirmacion) {
            mostrarError('Las contraseñas no coinciden.');
            return;
        }

        const boton = formRestablecer.querySelector('button[type="submit"]');
        boton.disabled = true;

        try {
            const respuesta = await fetch('api/recuperar.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password, confirmacion })
            });
            const datos = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok) {
                mostrarError(datos.error || 'No se pudo actualizar la contraseña.');
                boton.disabled = false;
                return;
            }

            mostrarMensaje('mensaje-restablecer', datos.mensaje);
            formRestablecer.reset();
            setTimeout(() => { window.location.href = 'login.php'; }, 2500);
        } catch (error) {
            mostrarError('No se pudo conectar con el servidor.');
            boton.disabled = false;
            console.error(error);
        }
    });
}
