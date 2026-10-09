<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión - TechStore</title>
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo filemtime(__DIR__ . '/assets/css/style.css'); ?>">
</head>
<body>
    <header>
        <a href="index.php" class="logo"><img src="assets/img/logo.png" alt="TechStore" class="logo-img"></a>
        <nav>
            <a href="index.php">Inicio</a>
            <a href="productos.php">Catálogo</a>
        </nav>
    </header>

    <main>
        <form class="formulario" id="form-login">
            <h2 style="color: var(--azul-oscuro); text-align: center;">Iniciar sesión</h2>

            <p class="mensaje-exito" id="mensaje-exito" style="text-align: center;"></p>

            <label>
                Correo electrónico
                <input type="email" name="correo" required>
            </label>
            <label>
                Contraseña
                <input type="password" name="password" required minlength="6">
            </label>

            <p class="mensaje-error" id="mensaje-error"></p>

            <a href="recuperar.php" style="font-size: 0.8rem; color: var(--acento); align-self: flex-end;">¿Olvidaste tu contraseña?</a>

            <button type="submit">Ingresar</button>
            <p style="text-align: center; font-size: 0.85rem; color: var(--texto-suave);">
                ¿No tienes cuenta? <a href="registro.php" style="color: var(--acento);">Regístrate</a>
            </p>
        </form>
    </main>

    <script src="assets/js/auth.js?v=<?php echo filemtime(__DIR__ . '/assets/js/auth.js'); ?>"></script>
</body>
</html>
