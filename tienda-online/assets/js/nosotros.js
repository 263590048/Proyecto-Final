// Página "Quiénes somos": formulario de contacto

// TODO: enviar el formulario a un endpoint real (correo o backend) cuando esté disponible
const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    formContacto.addEventListener('submit', (evento) => {
        evento.preventDefault();
        document.getElementById('mensaje-contacto').textContent = '¡Gracias! Te contactaremos pronto.';
        formContacto.reset();
    });
}
