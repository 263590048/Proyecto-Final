<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar contraseña - TechStore</title>
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo filemtime(__DIR__ . '/assets/css/style.css'); ?>">
</head>
<body>
    <header>
        <a href="index.php" class="logo"><img src="assets/img/logo.png" alt="TechStore" class="logo-img"></a>
        <nav>
            <a href="index.php">Inicio</a>
            <a href="productos.php">Catálogo</a>
            <a href="resenas.php">Reseñas</a>
        </nav>
    </header>

    <main>
        <form class="formulario" id="form-recuperar" novalidate>
            <h2 style="color: var(--azul-oscuro); text-align: center;">Recuperar contraseña</h2>
            <p style="font-size: 0.85rem; color: var(--texto-suave); text-align: center;">
                Escribe el correo de tu cuenta y te enviaremos un enlace para elegir una nueva contraseña.
            </p>

            <label>
                Correo electrónico
                <input type="email" name="correo" required autocomplete="email">
            </label>

            <p class="mensaje-error" id="mensaje-error"></p>
            <div class="aviso-pago exito oculto" id="mensaje-recuperar"></div>

            <button type="submit">Enviar enlace</button>
            <p style="text-align: center; font-size: 0.85rem; color: var(--texto-suave);">
                <a href="login.php" style="color: var(--acento);">← Volver a iniciar sesión</a>
            </p>
        </form>
    </main>

    <script src="assets/js/recuperar.js?v=<?php echo filemtime(__DIR__ . '/assets/js/recuperar.js'); ?>"></script>
</body>
</html>
