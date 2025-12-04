/**
 * @fileoverview Constantes del juego - Centraliza todos los valores para facilitar el balanceo
 * @module constants
 */

// === CONSTANTES DEL JUEGO ===
// Este archivo centraliza todos los valores constantes para facilitar el balanceo del juego

/**
 * Estadísticas predefinidas de los enemigos normales
 * @constant {Object}
 * @property {Object} GOBLIN - Enemigo de nivel bajo
 * @property {Object} ORCO - Enemigo de nivel medio
 * @property {Object} TROLL - Enemigo de nivel alto
 */
export const ENEMIGOS = {
    GOBLIN: {
        nombre: 'Goblin',
        ataque: 15,
        vida: 50,
        dinero: 5
    },
    ORCO: {
        nombre: 'Orco',
        ataque: 25,
        vida: 80,
        dinero: 5
    },
    // ESQUELETO: {
    //     nombre: 'Esqueleto',
    //     ataque: 30,
    //     vida: 90
    // },
    TROLL: {
        nombre: 'Troll',
        ataque: 35,
        vida: 100,
        dinero: 5
    }
};

/**
 * Configuración del jefe final del juego
 * @constant {Object}
 * @property {string} nombre - Nombre del jefe
 * @property {number} ataque - Poder de ataque del jefe
 * @property {number} vida - Puntos de vida del jefe
 * @property {string} habilidad - Nombre de la habilidad especial
 * @property {number} multiplicadorDanio - Multiplicador para calcular puntos al derrotarlo
 */
export const JEFE_FINAL = {
    nombre: 'Dragón',
    ataque: 50,
    vida: 150,
    habilidad: 'Llamarada',
    multiplicadorDanio: 1.5,
    dinero: 10
};

/**
 * Configuración inicial del jugador
 * @constant {Object}
 * @property {number} VIDA_INICIAL - Vida con la que empieza el jugador
 * @property {number} VIDA_MAXIMA - Vida máxima del jugador
 * @property {number} PUNTOS_INICIALES - Puntos iniciales del jugador
 */
export const JUGADOR = {
    VIDA_INICIAL: 100,
    VIDA_MAXIMA: 110,
    PUNTOS_INICIALES: 0
};

/**
 * Sistema de puntos del juego
 * @constant {Object}
 * @property {number} VICTORIA_ENEMIGO_MIN - Puntos mínimos por vencer enemigo
 * @property {number} VICTORIA_ENEMIGO_MAX - Puntos máximos por vencer enemigo
 * @property {number} VICTORIA_JEFE_MIN - Puntos mínimos por vencer jefe
 * @property {number} VICTORIA_JEFE_MAX - Puntos máximos por vencer jefe
 * @property {number} UMBRAL_PRO - Puntos necesarios para ser "Veterano"
 */
export const PUNTOS = {
    VICTORIA_ENEMIGO_MIN: 50,
    VICTORIA_ENEMIGO_MAX: 130,
    VICTORIA_JEFE_MIN: 200,
    VICTORIA_JEFE_MAX: 300,
    UMBRAL_PRO: 100
};

/**
 * Rangos de descuentos del mercado según rareza
 * @constant {Object}
 * @property {Object} COMUN - Rango de descuento para productos comunes (5-25%)
 * @property {Object} RARO - Rango de descuento para productos raros (10-40%)
 * @property {Object} EPICO - Rango de descuento para productos épicos (15-55%)
 * @property {Object} LEGENDARIO - Rango de descuento para productos legendarios (20-70%)
 */
export const DESCUENTOS = {
    COMUN: { min: 5, max: 25 },
    RARO: { min: 10, max: 40 },
    EPICO: { min: 15, max: 55 },
    LEGENDARIO: { min: 20, max: 70 }
};

/**
 * Configuración del mercado
 * @constant {Object}
 * @property {number} PRODUCTOS_MOSTRAR - Cantidad de productos a mostrar simultáneamente
 * @property {number} TOTAL_PRODUCTOS - Total de productos disponibles en el mercado
 */
export const MERCADO = {
    PRODUCTOS_MOSTRAR: 9,
    TOTAL_PRODUCTOS: 24
};

/**
 * Límites del inventario del jugador
 * @constant {Object}
 * @property {number} MAX_SLOTS - Número máximo de slots en el inventario visual
 */
export const INVENTARIO = {
    MAX_SLOTS: 6
};

/**
 * Rutas de todas las imágenes del juego
 * @constant {Object}
 * @property {string} HEROE - Ruta de la imagen del héroe/jugador
 * @property {string} ARMA - Ruta de la imagen para armas
 * @property {string} ARMADURA - Ruta de la imagen para armaduras
 * @property {string} CONSUMIBLE - Ruta de la imagen para consumibles
 * @property {string} GOBLIN - Ruta de la imagen del enemigo Goblin
 * @property {string} ORCO - Ruta de la imagen del enemigo Orco
 * @property {string} TROLL - Ruta de la imagen del enemigo Troll
 * @property {string} DRAGON - Ruta de la imagen del jefe final Dragón
 */
export const IMAGENES = {
    HEROE: 'imagenes/heroe.jpg',
    ARMA: 'imagenes/arma.png',
    ARMADURA: 'imagenes/armadura.png',
    CONSUMIBLE: 'imagenes/consumible.png',
    GOBLIN: 'imagenes/Goblin.jpg',
    ORCO: 'imagenes/Orco.jpg',
    // ESQUELETO: 'imagenes/Esqueleto.jpg',
    TROLL: 'imagenes/Troll.jpg',
    DRAGON: 'imagenes/Dragon.jpg'
};

/**
 * Clasificaciones finales del jugador según rendimiento
 * @constant {Object}
 * @property {Object} PRO - Clasificación para jugadores que derrotaron a todos los enemigos
 * @property {Object} MEDIAS - Clasificación para jugadores con victorias parciales
 * @property {Object} PERDEDOR - Clasificación para jugadores sin victorias
 */
export const CLASIFICACIONES = {
    PRO: {
        texto: '¡ERES UNA MÁQUINA!',
        nivel: 'PRO',
        clase: 'pro'
    },
    MEDIAS: {
        texto: '¡TE QUEDASTE A MEDIAS!',
        nivel: 'A medias',
        clase: 'medias'
    },
    PERDEDOR: {
        texto: '¡ERES UN PERDEDOR!',
        nivel: 'Perdedor',
        clase: 'rookie'
    }
};

/**
 * Límites y configuraciones generales del juego
 * @constant {Object}
 * @property {number} MAX_RONDAS - Número máximo de rondas en combate por turnos
 * @property {number} TOTAL_BATALLAS - Total de batallas en el juego (3 enemigos + 1 jefe)
 */
export const LIMITES = {
    MAX_RONDAS: 10,
    TOTAL_BATALLAS: 4 // 3 enemigos normales + 1 jefe final
};
