// Validación y envío de los formularios de login y registro (RF01, RF02)
// Los endpoints api/auth.php y api/usuarios.php quedan pendientes de implementar en el backend.

function mostrarError(mensaje) {
    const elemento = document.getElementById('mensaje-error');
    if (elemento) elemento.textContent = mensaje;
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

            window.location.href = 'index.php';
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

            window.location.href = 'login.php';
        } catch (error) {
            mostrarError('No se pudo conectar con el servidor.');
            console.error(error);
        }
    });
}
