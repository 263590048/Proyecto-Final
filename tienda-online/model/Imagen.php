<?php

// Subida de imágenes de productos desde el panel de administración (RF16).
// Se guardan en assets/img/productos/subidas/ con un nombre aleatorio; en la base de datos
// queda la ruta relativa ("subidas/abc123.jpg"), que el frontend antepone con assets/img/productos/.
class Imagen
{
    private const CARPETA_RELATIVA = 'subidas';
    private const TAMANO_MAXIMO = 3 * 1024 * 1024; // 3 MB

    // Tipo MIME real del archivo => extensión con la que se guarda
    private const TIPOS_PERMITIDOS = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    // Devuelve la ruta relativa a assets/img/productos/ (por ejemplo "subidas/abc123.jpg")
    public function guardar(array $archivo): string
    {
        $error = $archivo['error'] ?? UPLOAD_ERR_NO_FILE;
        if ($error === UPLOAD_ERR_NO_FILE) {
            throw new InvalidArgumentException('Debe seleccionar una imagen');
        }
        if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
            throw new InvalidArgumentException('La imagen no puede pesar más de 3 MB');
        }
        if ($error !== UPLOAD_ERR_OK || !is_uploaded_file($archivo['tmp_name'] ?? '')) {
            throw new RuntimeException('No se pudo recibir la imagen');
        }
        if ($archivo['size'] > self::TAMANO_MAXIMO) {
            throw new InvalidArgumentException('La imagen no puede pesar más de 3 MB');
        }

        // Se revisa el contenido real del archivo, no la extensión ni el tipo que envía el navegador
        $tipo = (new finfo(FILEINFO_MIME_TYPE))->file($archivo['tmp_name']);
        if (!isset(self::TIPOS_PERMITIDOS[$tipo]) || getimagesize($archivo['tmp_name']) === false) {
            throw new InvalidArgumentException('Formato no permitido. Usa JPG, PNG o WEBP');
        }

        $carpeta = __DIR__ . '/../assets/img/productos/' . self::CARPETA_RELATIVA;
        if (!is_dir($carpeta) || !is_writable($carpeta)) {
            throw new RuntimeException('La carpeta de imágenes no tiene permisos de escritura');
        }

        $nombre = bin2hex(random_bytes(12)) . '.' . self::TIPOS_PERMITIDOS[$tipo];
        if (!move_uploaded_file($archivo['tmp_name'], "$carpeta/$nombre")) {
            throw new RuntimeException('No se pudo guardar la imagen');
        }

        return self::CARPETA_RELATIVA . '/' . $nombre;
    }
}
