
/**
 * Clase principal Enemigos
 * @class
 * @description Representa un enemigo en el juego con sus estadísticas de combate
 */
export class Enemigos {
    tipo;        // Tipo de personaje (Enemigo)
    nombre;      // Nombre del enemigo
    nivelataque; // Poder de ataque del enemigo
    puntosvida;  // Vida del enemigo

    /**
     * Constructor de la clase Enemigos
     * @param {string} tipo - Tipo de personaje
     * @param {string} nombre - Nombre del enemigo
     * @param {number} nivelataque - Nivel de ataque del enemigo
     * @param {number} puntosvida - Puntos de vida del enemigo
     */
    constructor(tipo, nombre, nivelataque, puntosvida) {
        this.tipo = 'Enemigo'; //Tipo de personaje
        this.nombre = nombre; //Nombre del enemigo
        this.nivelataque = nivelataque; //Nivel de ataque 
        this.puntosvida = puntosvida; //Vida del enemigo
    }

    /**
     * Método para presentación del enemigo
     * @returns {string} Descripción del enemigo con sus estadísticas
     */
    presentarse() {
        return `Soy ${this.nombre}, el enemigo tengo ${this.nivelataque} de ataque y ${this.puntosvida} de vida `;
    }
}


/**
 * Clase derivada JefeFinal
 * @class
 * @extends Enemigos
 * @description Representa un jefe final con habilidades especiales y multiplicador de daño
 */
export class JefeFinal extends Enemigos {
    habilidadespecial;  // Habilidad única del jefe
    multiplicardanio;   // Multiplicador de daño (valor por defecto: 2.0)

    /**
     * Constructor de JefeFinal
     * @param {string} nombre - Nombre del jefe
     * @param {number} nivelataque - Nivel de ataque del jefe
     * @param {number} puntosvida - Puntos de vida del jefe
     * @param {string} habilidadespecial - Habilidad especial única del jefe
     * @param {number} [multiplicardanio=2.0] - Multiplicador de daño para calcular puntos (default: 2.0)
     */
    constructor(nombre, nivelataque, puntosvida, habilidadespecial, multiplicardanio = 2.0) {
        super('jefe', nombre, nivelataque, puntosvida);
        this.tipo = 'Jefe'
        this.habilidadespecial = habilidadespecial;
        this.multiplicardanio = multiplicardanio;
    }

    /**
     * Método para presentar el jefe final
     * @returns {string} Descripción especial del jefe con su habilidad
     * @example
     * // Retorna: "Soy Dragón, el jefe final. Mi habilidad especial es: Llamarada"
     * jefe.presentarse();
     */
    presentarse() {
        return `Soy ${this.nombre}, el jefe final. Mi habilidad especial es: ${this.habilidadespecial}`;
    }
}