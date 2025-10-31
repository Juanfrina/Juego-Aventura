
//Clase principal Enemigos
export class Enemigos {
    tipo;        // Tipo de personaje (Enemigo)
    nombre;      // Nombre del enemigo
    nivelataque; // Poder de ataque del enemigo
    puntosvida;  // Vida del enemigo

    constructor(tipo, nombre, nivelataque, puntosvida) { //Constructor de Enemigos
        this.tipo = 'Enemigo'; //Tipo de personaje
        this.nombre = nombre; //Nombre del enemigo
        this.nivelataque = nivelataque; //Nivel de ataque 
        this.puntosvida = puntosvida; //Vida del enemigo
    }

    //Metodo para presentacion del enemigo
    presentarse() {
        return `Soy ${this.nombre}, el enemigo tengo ${this.nivelataque} de ataque y ${this.puntosvida} de vida `;
    }
}


//Clase derivada Jefe Final
//Herencia: de la clase enemigos
export class JefeFinal extends Enemigos {
    habilidadespecial;  // Habilidad única del jefe
    multiplicardanio;   // Multiplicador de daño (valor por defecto: 2.0)

    /**
     * Constructor de JefeFinal
     *  - Nombre del jefe
     *  - Nivel de ataque
     *  - Puntos de vida
     *  - Habilidad especial única
     *  - Multiplicador de daño (default: 2.0)
     */
    constructor(nombre, nivelataque, puntosvida, habilidadespecial, multiplicardanio = 2.0) {
        super('jefe', nombre, nivelataque, puntosvida);
        this.tipo = 'Jefe'
        this.habilidadespecial = habilidadespecial;
        this.multiplicardanio = multiplicardanio;
    }

    /**
     * Método para presentar el jefe final
     * @returns {string} Descripción especial del jefe
     * Ejemplo: "Soy Dragón, el jefe final. Mi habilidad especial es: Llamarada"
     */
    presentarse() {
        return `Soy ${this.nombre}, el jefe final. Mi habilidad especial es: ${this.habilidadespecial}`;
    }
}