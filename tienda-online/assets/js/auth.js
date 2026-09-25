// Validación y envío de los formularios de login y registro (RF01, RF02)
// Los endpoints api/auth.php y api/usuarios.php quedan pendientes de implementar en el backend.

function mostrarError(mensaje) {
    const elemento = document.getElementById('mensaje-error');
    if (elemento) elemento.textContent = mensaje;
}

// Página a la que se regresa después de iniciar sesión (ej. checkout.php).
// Solo se aceptan páginas .php locales para no redirigir a sitios externos.
const parametros = new URLSearchParams(window.location.search);
const paginaVolver = /^[a-z0-9-]+\.php$/i.test(parametros.get('volver') || '') ? parametros.get('volver') : null;
const sufijoVolver = paginaVolver ? `volver=${encodeURIComponent(paginaVolver)}` : '';

// Los enlaces entre login y registro conservan la página de regreso
document.querySelectorAll('a[href="login.php"], a[href="registro.php"]').forEach((enlace) => {
    if (sufijoVolver) enlace.href = `${enlace.getAttribute('href')}?${sufijoVolver}`;
});

// Aviso de cuenta creada al llegar desde el registro
const mensajeExito = document.getElementById('mensaje-exito');
if (mensajeExito && parametros.has('registrado')) {
    mensajeExito.textContent = '¡Cuenta creada con éxito! Ya puedes iniciar sesión.';
}

const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mostrarError('');

        const datos = Object.fromEntries(new FormData(formLogin));

        try {
            const respuesta = await fetch('api/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                const error = await respuesta.json().catch(() => ({}));
                mostrarError(error.error || 'Correo o contraseña incorrectos.');
                return;
            }

            window.location.href = paginaVolver || 'index.php';
        } catch (error) {
            mostrarError('No se pudo conectar con el servidor.');
            console.error(error);
        }
    });
}

const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
    formRegistro.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mostrarError('');

        const datos = Object.fromEntries(new FormData(formRegistro));

        try {
            const respuesta = await fetch('api/usuarios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                const error = await respuesta.json().catch(() => ({}));
                mostrarError(error.error || 'No se pudo crear la cuenta.');
                return;
            }

            window.location.href = `login.php?registrado=1${sufijoVolver ? '&' + sufijoVolver : ''}`;
        } catch (error) {
            mostrarError('No se pudo conectar con el servidor.');
            console.error(error);
        }
    });
}
