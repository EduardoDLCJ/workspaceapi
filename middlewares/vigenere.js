const limpiarTexto = (texto) => {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, ""); // Elimina tildes, pero conserva espacios
};

const generarClave = (texto, clave, abecedario) => {
    clave = limpiarTexto(clave);
    const claveFiltrada = clave.split('').filter(c => abecedario.includes(c)).join('');
    const claveRepetida = (claveFiltrada.repeat(Math.floor(texto.length / claveFiltrada.length))) + claveFiltrada.slice(0, texto.length % claveFiltrada.length);
    return claveRepetida;
};

const cifrarVigenere = (texto, clave) => {
    texto = limpiarTexto(texto);
    const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?/`~";
    const claveRepetida = generarClave(texto, clave, abecedario);
    let resultado = "";

    for (let i = 0; i < texto.length; i++) {
        if (texto[i] === ' ') {
            resultado += ' ';
            continue;
        }
        const posT = abecedario.indexOf(texto[i]);
        const posK = abecedario.indexOf(claveRepetida[i % claveRepetida.length]);
        if (posT === -1 || posK === -1) {
            resultado += texto[i];
            continue;
        }
        const nuevaPos = (posT + posK) % abecedario.length;
        resultado += abecedario[nuevaPos];
    }

    return resultado;
};

const descifrarVigenere = (textoCifrado, clave) => {
    const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?/`~";
    const claveRepetida = generarClave(textoCifrado, clave, abecedario);
    let resultado = "";

    for (let i = 0; i < textoCifrado.length; i++) {
        if (textoCifrado[i] === ' ') {
            resultado += ' ';
            continue;
        }
        const posT = abecedario.indexOf(textoCifrado[i]);
        const posK = abecedario.indexOf(claveRepetida[i % claveRepetida.length]);
        if (posT === -1 || posK === -1) {
            resultado += textoCifrado[i];
            continue;
        }
        const nuevaPos = (posT - posK + abecedario.length) % abecedario.length;
        resultado += abecedario[nuevaPos];
    }

    return resultado;
};

module.exports = { cifrarVigenere, descifrarVigenere };
