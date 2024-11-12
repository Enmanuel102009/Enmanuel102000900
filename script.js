// Función para procesar el ejercicio en formato de texto
function resolverEjercicio() {
    const texto = document.getElementById('ejercicioTexto').value;
    const resultado = document.getElementById('resultadoEjercicio');

    // Expresiones regulares para extraer datos
    const longitud = texto.match(/(\d+)\s*metros/);       // Longitud del cable
    const carga = texto.match(/(\d+)\s*kW/);              // Potencia en kW
    const tension = texto.match(/(\d+)\s*V/);             // Tensión en voltios
    const resistencia = texto.match(/resistencia\s*de\s*(\d+(\.\d+)?)\s*ohmios?/); // Resistencia en Ω
    const reactancia = texto.match(/reactancia\s*de\s*(\d+(\.\d+)?)\s*ohmios?/);  // Reactancia en Ω

    // Si no se encuentran algunos valores, usar valores estándar
    const r = resistencia ? parseFloat(resistencia[1]) : calcularResistenciaEstimada(longitud ? parseFloat(longitud[1]) : null);
    const x = reactancia ? parseFloat(reactancia[1]) : calcularReactanciaEstimada(longitud ? parseFloat(longitud[1]) : null);

    // Verificar si tenemos longitud, carga y tensión
    if (longitud && carga && tension) {
        const l = parseFloat(longitud[1]);        // Longitud en metros
        const p = parseFloat(carga[1]);           // Carga en kW
        const v = parseFloat(tension[1]);         // Tensión en voltios

        // Cálculo de la corriente: I = P / V
        const corriente = (p * 1000) / v;

        // Cálculo de la impedancia: Z = √(R² + X²)
        const impedancia = Math.sqrt(Math.pow(r, 2) + Math.pow(x, 2));

        // Caída de voltaje: ΔV = I * Z
        const caidaVoltaje = corriente * impedancia;

        // Voltaje en la carga: Vcarga = V - ΔV
        const voltajeCarga = v - caidaVoltaje;

        // Determinar si el voltaje es suficiente
        const esSuficiente = voltajeCarga >= 0.9 * v; // El voltaje debe ser al menos el 90% de la tensión nominal

        // Mostrar los resultados
        resultado.innerHTML = `
            <p>La longitud del cable es de <strong>${l} metros</strong>.</p>
            <p>La potencia de la carga es <strong>${p} kW</strong>.</p>
            <p>La resistencia del cable es de <strong>${r.toFixed(2)} Ω</strong> (calculada automáticamente si no se proporcionó).</p>
            <p>La reactancia del cable es de <strong>${x.toFixed(2)} Ω</strong> (calculada automáticamente si no se proporcionó).</p>
            <p>La corriente en el sistema es de <strong>${corriente.toFixed(2)} A</strong>.</p>
            <p>La caída de voltaje en la línea es de <strong>${caidaVoltaje.toFixed(2)} V</strong>.</p>
            <p>El voltaje en la carga es de <strong>${voltajeCarga.toFixed(2)} V</strong>.</p>
            <p>${esSuficiente ? "El voltaje es suficiente para un funcionamiento óptimo." : "El voltaje es insuficiente, revisa el diseño del sistema."}</p>
        `;
    } else {
        // Informar si faltan datos o no se entienden los parámetros
        resultado.innerHTML = "<p>Por favor, asegúrate de que el texto del ejercicio contiene todos los datos necesarios (longitud, carga, resistencia, reactancia, tensión de alimentación).</p>";
    }
}

// Función para calcular la resistencia estimada de un cable
function calcularResistenciaEstimada(longitud) {
    // Suponer que el cable es de cobre si no se proporciona, con resistencia aproximada de 0.0175 Ω/m para un cable de 16mm²
    if (longitud) {
        const resistenciaPorMetro = 0.0175; // Ω/m para cobre
        return resistenciaPorMetro * longitud;
    }
    return 0.5; // Valor por defecto si no se puede calcular
}

// Función para calcular la reactancia estimada de un cable
function calcularReactanciaEstimada(longitud) {
    // Reactancia estimada para cables típicos de baja tensión (aproximadamente 0.08 Ω/km)
    if (longitud) {
        const reactanciaPorMetro = 0.00008; // Ω/m
        return reactanciaPorMetro * longitud;
    }
    return 0.05; // Valor por defecto si no se puede calcular
}
