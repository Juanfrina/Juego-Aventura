// === NAVEGACIÓN DE ESCENAS ===

/**
 * Cambia entre diferentes escenas del juego
 * @param {string} id - ID de la escena a mostrar
 */
export function showScene(id) {
    document.querySelectorAll('.scene').forEach(
        element => element.classList.remove('active')
    );
    document.getElementById(id).classList.add('active');
}

// === FUNCIONES DE CÁLCULO Y FORMATEO ===

/**
 * Genera un descuento aleatorio basado en la rareza del producto
 * @param {string} rareza - Rareza del producto (Comun, Raro, Epico, Legendario)
 * @returns {number} Porcentaje de descuento
 */
export function calcularDescuentoAleatorio(rareza) {
    const rangos = {
        'Comun': { min: 5, max: 25 },
        'Raro': { min: 10, max: 40 },
        'Epico': { min: 15, max: 55 },
        'Legendario': { min: 20, max: 70 }
    };
    
    const rango = rangos[rareza] || { min: 0, max: 10 };
    return Math.floor(Math.random() * (rango.max - rango.min + 1)) + rango.min;
}

/**
 * Formatea un precio de céntimos a euros
 * @param {number} centimos - Precio en céntimos
 * @returns {string} Precio formateado (ej: "12.50€")
 */
export function formatearPrecio(centimos) {
    return (centimos / 100).toFixed(2) + '€';
}

/**
 * Genera puntos aleatorios dentro de un rango
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Puntos generados
 */
export function generarPuntosAleatorios(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// === FUNCIONES DE IMÁGENES ===

/**
 * Obtiene la ruta de la imagen según el tipo de objeto
 * @param {string} tipo - Tipo de objeto (arma, armadura, consumible)
 * @returns {string} Ruta de la imagen
 */
export function obtenerImagenPorTipo(tipo) {
    const imagenes = {
        'arma': 'imagenes/arma.png',
        'armadura': 'imagenes/armadura.png',
        'consumible': 'imagenes/consumible.png'
    };
    
    return imagenes[tipo] || 'imagenes/arma.png';
}

/**
 * Obtiene la ruta de la imagen de un enemigo por su nombre
 * @param {string} nombre - Nombre del enemigo
 * @returns {string} Ruta de la imagen
 */
export function obtenerImagenEnemigo(nombre) {
    const imagenes = {
        'goblin': 'imagenes/Goblin.jpg',
        'orco': 'imagenes/Orco.jpg',
        'troll': 'imagenes/Troll.jpg',
        'dragón': 'imagenes/Dragon.jpg',
        'dragon': 'imagenes/Dragon.jpg'
    };
    
    return imagenes[nombre.toLowerCase()] || 'imagenes/enemigo.jpg';
}

// === FUNCIONES DE ARRAYS ===

/**
 * Mezcla un array de forma aleatoria (Fisher-Yates shuffle)
 * @param {Array} array - Array a mezclar
 * @returns {Array} Array mezclado (nueva copia)
 */
export function mezclarArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

/**
 * Selecciona N elementos aleatorios de un array
 * @param {Array} array - Array original
 * @param {number} cantidad - Cantidad de elementos a seleccionar
 * @returns {Array} Array con elementos seleccionados
 */
export function seleccionarAleatorios(array, cantidad) {
    return mezclarArray(array).slice(0, cantidad);
}

// === FUNCIONES DE MANIPULACIÓN DEL DOM ===

/**
 * Crea un elemento HTML con clase y contenido
 * @param {string} tag - Etiqueta HTML (div, span, etc.)
 * @param {string} className - Clase CSS
 * @param {string} content - Contenido HTML o texto
 * @returns {HTMLElement} Elemento creado
 */
export function crearElementoHTML(tag, className = '', content = '') {
    const elemento = document.createElement(tag);
    if (className) elemento.className = className;
    if (content) elemento.innerHTML = content;
    return elemento;
}

/**
 * Actualiza el texto de un elemento por su ID
 * @param {string} id - ID del elemento
 * @param {string|number} texto - Texto a mostrar
 */
export function actualizarTexto(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = texto;
}

/**
 * Muestra u oculta un elemento agregando/quitando la clase 'hidden'
 * @param {string} id - ID del elemento
 * @param {boolean} ocultar - true para ocultar, false para mostrar
 */
export function toggleVisibilidad(id, ocultar) {
    const elemento = document.getElementById(id);
    if (elemento) {
        if (ocultar) {
            elemento.classList.add('hidden');
        } else {
            elemento.classList.remove('hidden');
        }
    }
}

// === FUNCIONES DE VALIDACIÓN ===

/**
 * Valida que un objeto tenga las propiedades de un jugador
 * @param {Object} jugador - Objeto a validar
 * @returns {boolean} true si es válido
 */
export function validarJugador(jugador) {
    return jugador && 
           typeof jugador.nombre === 'string' &&
           typeof jugador.puntos === 'number' &&
           typeof jugador.vida === 'number' &&
           Array.isArray(jugador.inventario);
}

/**
 * Valida que un objeto tenga las propiedades de un enemigo
 * @param {Object} enemigo - Objeto a validar
 * @returns {boolean} true si es válido
 */
export function validarEnemigo(enemigo) {
    return enemigo && 
           typeof enemigo.nombre === 'string' &&
           typeof enemigo.nivelataque === 'number' &&
           typeof enemigo.puntosvida === 'number';
}

// === FUNCIONES DE UTILIDAD GENERAL ===

/**
 * Genera un número aleatorio entre min y max (inclusive)
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatorio
 */
export function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export function capitalizarPrimeraLetra(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}