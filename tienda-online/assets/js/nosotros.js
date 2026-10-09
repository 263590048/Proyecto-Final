// Página "Quiénes somos": formulario de contacto

const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    formContacto.addEventListener('submit', (evento) => {
        evento.preventDefault();
        document.getElementById('mensaje-contacto').textContent = '¡Gracias! Te contactaremos pronto.';
        formContacto.reset();
    });
}
