<?php

// Se lanza cuando la pasarela (simulada) rechaza el cobro; la API responde 402.
class PagoRechazadoException extends RuntimeException
{
}

// RF13: pasarela de pago simulada. No se conecta a ningún banco: valida los datos de la
// tarjeta como lo haría una pasarela real y aprueba o rechaza el cobro.
// Nunca se guarda el número completo ni el CVV, solo una referencia con los últimos 4 dígitos.
class Pago
{
    public const METODOS_VALIDOS = ['tarjeta', 'transferencia', 'contra_entrega'];

    // Tarjeta de prueba que la pasarela simulada siempre rechaza (para demostrar el caso de error)
    private const TARJETA_RECHAZADA = '4000000000000002';

    // Devuelve ['estado' => estado inicial del pedido, 'referencia' => texto para el comprobante]
    public function procesar(string $metodo, array $tarjeta, float $total): array
    {
        if (!in_array($metodo, self::METODOS_VALIDOS, true)) {
            throw new InvalidArgumentException('Método de pago inválido');
        }

        if ($metodo !== 'tarjeta') {
            // Transferencia y contra entrega quedan pendientes hasta que el administrador confirme el pago
            return ['estado' => 'pendiente', 'referencia' => null];
        }

        $numero = preg_replace('/\D/', '', (string) ($tarjeta['numero'] ?? ''));
        $titular = trim((string) ($tarjeta['titular'] ?? ''));
        $mes = (int) ($tarjeta['mes'] ?? 0);
        $anio = (int) ($tarjeta['anio'] ?? 0);
        $cvv = (string) ($tarjeta['cvv'] ?? '');

        if ($titular === '') {
            throw new InvalidArgumentException('Debe indicar el nombre del titular de la tarjeta');
        }
        if (!$this->numeroTarjetaValido($numero)) {
            throw new InvalidArgumentException('El número de tarjeta no es válido');
        }
        if ($mes < 1 || $mes > 12 || $this->tarjetaVencida($mes, $anio)) {
            throw new InvalidArgumentException('La tarjeta está vencida o la fecha no es válida');
        }
        if (!preg_match('/^\d{3,4}$/', $cvv)) {
            throw new InvalidArgumentException('El CVV debe tener 3 o 4 dígitos');
        }
        if ($total <= 0) {
            throw new InvalidArgumentException('El total a cobrar no es válido');
        }

        if ($numero === self::TARJETA_RECHAZADA) {
            throw new PagoRechazadoException('El banco rechazó la tarjeta. Intenta con otro método de pago.');
        }

        return ['estado' => 'pagado', 'referencia' => 'Tarjeta •••• ' . substr($numero, -4)];
    }

    // Algoritmo de Luhn: la verificación que usan las tarjetas reales
    private function numeroTarjetaValido(string $numero): bool
    {
        if (!preg_match('/^\d{13,19}$/', $numero)) {
            return false;
        }

        $suma = 0;
        $duplicar = false;
        for ($i = strlen($numero) - 1; $i >= 0; $i--) {
            $digito = (int) $numero[$i];
            if ($duplicar) {
                $digito *= 2;
                if ($digito > 9) {
                    $digito -= 9;
                }
            }
            $suma += $digito;
            $duplicar = !$duplicar;
        }

        return $suma % 10 === 0;
    }

    // La tarjeta es válida hasta el último día de su mes de vencimiento
    private function tarjetaVencida(int $mes, int $anio): bool
    {
        if ($anio < 100) {
            $anio += 2000;
        }
        $primerDiaMesSiguiente = mktime(0, 0, 0, $mes + 1, 1, $anio);
        return $primerDiaMesSiguiente <= time();
    }
}
