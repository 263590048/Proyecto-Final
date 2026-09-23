<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear cuenta - TechStore</title>
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
        <form class="formulario" id="form-registro">
            <h2 style="color: var(--azul-oscuro); text-align: center;">Crear cuenta</h2>

            <label>
                Nombre
                <input type="text" name="nombre" required>
            </label>
            <label>
                Apellido
                <input type="text" name="apellido" required>
            </label>
            <label>
                Correo electrónico
                <input type="email" name="correo" required>
            </label>
            <label>
                Contraseña
                <input type="password" name="password" required minlength="6">
            </label>
            <label>
                Teléfono
                <input type="tel" name="telefono">
            </label>
            <label>
                Dirección
                <input type="text" name="direccion">
            </label>

            <p class="mensaje-error" id="mensaje-error"></p>

            <button type="submit">Registrarme</button>
            <p style="text-align: center; font-size: 0.85rem; color: var(--texto-suave);">
                ¿Ya tienes cuenta? <a href="login.php" style="color: var(--acento);">Inicia sesión</a>
            </p>
        </form>
    </main>

    <script src="assets/js/auth.js?v=<?php echo filemtime(__DIR__ . '/assets/js/auth.js'); ?>"></script>
</body>
</html>
