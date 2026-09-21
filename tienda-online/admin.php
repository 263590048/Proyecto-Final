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
            <a href="#" id="nav-productos" class="activo" onclick="mostrarSeccion('productos'); return false;">📦 Productos</a>
            <a href="#" id="nav-categorias" onclick="mostrarSeccion('categorias'); return false;">🏷️ Categorías</a>
            <a href="#" id="nav-usuarios" onclick="mostrarSeccion('usuarios'); return false;">👤 Usuarios</a>
        </aside>

        <div class="admin-contenido seccion-admin" id="seccion-productos">
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

        <div class="admin-contenido seccion-admin oculto" id="seccion-categorias">
            <div class="admin-header">
                <h2>Gestión de categorías</h2>
                <button class="btn-acento" onclick="abrirModalCategoria()">+ Agregar categoría</button>
            </div>

            <table class="tabla-admin">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="cuerpo-tabla-categorias">
                    <tr><td colspan="4">Cargando categorías...</td></tr>
                </tbody>
            </table>
        </div>

        <div class="admin-contenido seccion-admin oculto" id="seccion-usuarios">
            <div class="admin-header">
                <h2>Gestión de usuarios</h2>
            </div>

            <table class="tabla-admin">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Tipo</th>
                        <th>Registrado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="cuerpo-tabla-usuarios">
                    <tr><td colspan="6">Cargando usuarios...</td></tr>
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

    <div class="modal-fondo oculto" id="modal-categoria">
        <form class="formulario" id="form-categoria">
            <h3 id="titulo-modal-categoria" style="color: var(--azul-oscuro);">Agregar categoría</h3>
            <input type="hidden" name="id_categoria">

            <label>
                Nombre
                <input type="text" name="nombre" required>
            </label>
            <label>
                Descripción
                <textarea name="descripcion" rows="3"></textarea>
            </label>

            <p class="mensaje-error" id="mensaje-error-categoria"></p>

            <div style="display: flex; gap: 0.8rem;">
                <button type="submit" class="btn-acento">Guardar</button>
                <button type="button" class="btn-secundario" onclick="cerrarModalCategoria()">Cancelar</button>
            </div>
        </form>
    </div>

    <div class="modal-fondo oculto" id="modal-usuario">
        <form class="formulario" id="form-usuario">
            <h3 style="color: var(--azul-oscuro);">Editar usuario</h3>
            <input type="hidden" name="id_usuario">

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
                Teléfono
                <input type="tel" name="telefono">
            </label>
            <label>
                Dirección
                <input type="text" name="direccion">
            </label>
            <label>
                Tipo de usuario
                <select name="tipo_usuario">
                    <option value="cliente">Cliente</option>
                    <option value="administrador">Administrador</option>
                </select>
            </label>

            <p class="mensaje-error" id="mensaje-error-usuario"></p>

            <div style="display: flex; gap: 0.8rem;">
                <button type="submit" class="btn-acento">Guardar</button>
                <button type="button" class="btn-secundario" onclick="cerrarModalUsuario()">Cancelar</button>
            </div>
        </form>
    </div>

    <script src="assets/js/admin.js?v=<?php echo filemtime(__DIR__ . '/assets/js/admin.js'); ?>"></script>
</body>
</html>
