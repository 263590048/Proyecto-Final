<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva contraseña - TechStore</title>
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
        <form class="formulario" id="form-restablecer" novalidate>
            <h2 style="color: var(--azul-oscuro); text-align: center;">Nueva contraseña</h2>

            <label>
                Nueva contraseña
                <input type="password" name="password" required minlength="6" autocomplete="new-password">
            </label>
            <label>
                Confirmar contraseña
                <input type="password" name="confirmacion" required minlength="6" autocomplete="new-password">
            </label>

            <p class="mensaje-error" id="mensaje-error"></p>
            <div class="aviso-pago exito oculto" id="mensaje-restablecer"></div>

            <button type="submit">Guardar contraseña</button>
            <p style="text-align: center; font-size: 0.85rem; color: var(--texto-suave);">
                <a href="recuperar.php" style="color: var(--acento);">Solicitar un enlace nuevo</a>
            </p>
        </form>
    </main>

    <script src="assets/js/recuperar.js?v=<?php echo filemtime(__DIR__ . '/assets/js/recuperar.js'); ?>"></script>
</body>
</html>
