<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración - TechStore</title>
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo filemtime(__DIR__ . '/assets/css/style.css'); ?>">
</head>
<body>
    <header>
        <a href="index.php" class="logo"><img src="assets/img/logo.png" alt="TechStore" class="logo-img"></a>
        <nav>
            <a href="index.php">Ver tienda</a>
        </nav>
    </header>

    <div class="layout-admin">
        <aside class="admin-sidebar">
            <a href="admin.php" class="activo">📦 Productos</a>
            <a href="#" style="opacity: 0.5;">🏷️ Categorías (pendiente)</a>
            <a href="#" style="opacity: 0.5;">👤 Usuarios (pendiente)</a>
        </aside>

        <div class="admin-contenido">
            <div class="admin-header">
                <h2>Gestión de productos</h2>
                <button class="btn-acento" onclick="abrirModal()">+ Agregar producto</button>
            </div>

            <table class="tabla-admin">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Oferta</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="cuerpo-tabla-productos">
                    <tr><td colspan="7">Cargando productos...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="modal-fondo oculto" id="modal-producto">
        <form class="formulario" id="form-producto">
            <h3 id="titulo-modal" style="color: var(--azul-oscuro);">Agregar producto</h3>
            <input type="hidden" name="id_producto">

            <label>
                Nombre
                <input type="text" name="nombre" required>
            </label>
            <label>
                Categoría (ID)
                <input type="number" name="id_categoria" required min="1">
            </label>
            <label>
                Descripción
                <textarea name="descripcion" rows="3"></textarea>
            </label>
            <label>
                Precio
                <input type="number" name="precio" step="0.01" required min="0">
            </label>
            <label>
                Precio de oferta (opcional)
                <input type="number" name="precio_oferta" step="0.01" min="0">
            </label>
            <label>
                Cantidad
                <input type="number" name="cantidad" required min="0">
            </label>
            <label>
                Imagen (nombre de archivo)
                <input type="text" name="imagen">
            </label>
            <label>
                Imagen 2 (nombre de archivo, opcional)
                <input type="text" name="imagen2">
            </label>
            <label>
                Estado
                <select name="estado">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </label>

            <p class="mensaje-error" id="mensaje-error-producto"></p>

            <div style="display: flex; gap: 0.8rem;">
                <button type="submit" class="btn-acento">Guardar</button>
                <button type="button" class="btn-secundario" onclick="cerrarModal()">Cancelar</button>
            </div>
        </form>
    </div>

    <script src="assets/js/admin.js?v=<?php echo filemtime(__DIR__ . '/assets/js/admin.js'); ?>"></script>
</body>
</html>
