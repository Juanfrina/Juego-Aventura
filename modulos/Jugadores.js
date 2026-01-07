/**
 * Clase Jugadores
 * @class
 * @description Representa un jugador con sus estadísticas, inventario y métodos de combate
 * @author Juanfrina
 * @version 1.0
 */
export class Jugadores {
    /**
     * Nombre del jugador
     * @type {string}
     */
    nombre;
    /**
     * Puntos acumulados del jugador
     * @type {number}
     */
    puntos = 0;
    /**
     * Vida actual del jugador
     * @type {number}
     */
    vida = 100;
    /**
     * Vida máxima base del jugador
     * @type {number}
     */
    vidaMaxima = 100;
    /**
     * Ataque base del jugador (sin contar objetos)
     * @type {number}
     */
    ataqueBase = 0;
    /**
     * Defensa base del jugador (sin contar objetos)
     * @type {number}
     */
    defensaBase = 0;
    /**
     * Inventario del jugador con todos los objetos
     * @type {Array<Object>}
     */
    inventario = [];
    /**
     * Dinero del jugador en monedas (número entero)
     * @type {number}
     */
    dinero = 500; // 500 monedas
    /**
     * Constructor de la clase Jugadores
     * @param {string} nombre - Nombre del jugador
     */
    constructor(nombre) {
        this.nombre = nombre;
        this.puntos = 0;
        this.vida = this.vidaMaxima;
        this.vidaMaxima = 100;
        this.ataqueBase = 0;
        this.defensaBase = 0;
        this.inventario = [];
        this.dinero = 500; // 500 monedas
    }
    /**
     * Gasta dinero del jugador si tiene suficiente
     * @param {number} cantidad - Cantidad a gastar en monedas
     * @returns {boolean} True si la compra fue exitosa, false si no tiene suficiente dinero
     */
    gastarDinero(cantidad) {
        if (this.dinero >= cantidad) {
            this.dinero -= cantidad;
            return true;
        }
        return false;
    }
    /**
     * Añade un objeto al inventario del jugador (realiza copia del objeto)
     * @param {Object} objeto - Objeto a añadir al inventario
     * @param {string} objeto.nombre - Nombre del objeto
     * @param {string} objeto.tipo - Tipo del objeto (arma, armadura, consumible)
     * @param {number} [objeto.ataque] - Bonus de ataque (si es arma)
     * @param {number} [objeto.defensa] - Bonus de defensa (si es armadura)
     * @param {number} [objeto.curacion] - Bonus de curación (si es consumible)
     */
    anadirObjeto(objeto) {
        const objetoClone = {
            ...objeto
        };
        this.inventario.push(objetoClone);
    }
    /**
     * Suma puntos al jugador cuando gana batallas
     * @param {number} puntos - Puntos a sumar al total
     */
    sumarPuntos(puntos) {
        this.puntos += puntos;
    }
    /**
     * Calcula el ataque total del jugador sumando el bonus de todas las armas en el inventario
     * @returns {number} Ataque total del jugador (suma de todos los bonus de ataque)
     */
    ataqueTotal() {
        let miAtaque = this.ataqueBase; // Empiezo con el ataque base

        // Busco todas mis armas
        for (let objeto of this.inventario) { // Recorro inventario
            if (objeto.tipo === 'arma') { // Si es arma
                miAtaque += objeto.ataque ? objeto.ataque : 0; // Sumo su ataque si lo tiene
            }
        }

        return miAtaque;
    }
    /**
     * Calcula la defensa total del jugador sumando el bonus de todas las armaduras en el inventario
     * @returns {number} Defensa total del jugador (suma de todos los bonus de defensa)
     */
    defensaTotal() {
        let miDefensa = this.defensaBase; // Empiezo con la defensa base

        // Busco todas mis armaduras
        for (let objeto of this.inventario) {
            if (objeto.tipo === 'armadura') { // Si es armadura
                miDefensa += objeto.defensa ? objeto.defensa : 0; // Sumo su defensa si la tiene
            }
        }

        return miDefensa;
    }
    /**
     * Calcula la vida total del jugador sumando la vida base más todos los consumibles
     * @returns {number} Vida total del jugador (vida base + bonus de consumibles)
     */
    vidaTotal() {
        let vidaTotal = this.vidaMaxima; // Empiezo con la vida máxima base

        // Busco todos los consumibles que aumentan la vida
        for (let objeto of this.inventario) {
            if (objeto.tipo === 'consumible') { // Si es consumible
                vidaTotal += objeto.curacion ? objeto.curacion : 0; // Sumo su curación si la tiene
            }
        }

        return vidaTotal;
    }
    /**
     * Calcula la velocidad total del jugador sumando todos los consumibles que aumentan la velocidad
     * @returns {number} Velocidad total del jugador (suma de bonus de velocidad de consumibles)
     */
    // velocidadTotal() {
    //     let velocidadTotal = 0; // Empiezo con 0
    //     // Busco todos los consumibles que aumentan la velocidad
    //     for (let objeto of this.inventario) {
    //         if (objeto.tipo === 'consumible') { // Si es consumible
    //             velocidadTotal += objeto.velocidad ? objeto.velocidad : 0; // Sumo su velocidad si la tiene
    //         }
    //     }

    //     return velocidadTotal;
    // }
    /**
     * Agrupa el inventario del jugador por tipo de objeto
     * @returns {Object} Objeto con arrays de objetos agrupados por tipo {arma: [], armadura: [], consumible: []}
     */
    inventarioPorTipo() {
        const grupos = {};

        for (let objeto of this.inventario) {
            // Si no existe el grupo, lo creo
            if (!grupos[objeto.tipo]) {
                grupos[objeto.tipo] = [];
            }
            // Añado el objeto al grupo
            grupos[objeto.tipo].push(objeto);
        }

        return grupos;
    }
    /**
     * Obtiene toda la información del jugador en un objeto
     * @returns {Object} Objeto con toda la información del jugador
     * @property {string} nombre - Nombre del jugador
     * @property {number} puntos - Puntos acumulados
     * @property {number} vida - Vida actual
     * @property {number} vidaMaxima - Vida máxima base
     * @property {number} vidaTotal - Vida total con bonus de consumibles
     * @property {number} ataque - Ataque total con bonus de armas
     * @property {number} defensa - Defensa total con bonus de armaduras
     * @property {Object} inventario - Inventario agrupado por tipo
     */
    mostrar() {
        return {
            nombre: this.nombre,
            puntos: this.puntos,
            vida: this.vida, // Añadir vida actual
            vidaMaxima: this.vidaMaxima,
            vidaTotal: this.vidaTotal(), // Vida total con bonus de consumibles
            ataque: this.ataqueTotal(),
            defensa: this.defensaTotal(),
            dinero: this.dinero, // Dinero disponible en céntimos
            //velocidad: this.velocidadTotal(),
            inventario: this.inventarioPorTipo()
        };
    }
}