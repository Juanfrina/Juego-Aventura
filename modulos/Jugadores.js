// clase Jugadores con atributos nombre, puntos, vida, vidaMaxima e inventario
/**
 * Clase Jugadores
 * @class
 * @author Juanfrina
 * @version 1.0
 */
export class Jugadores {
    nombre;
    puntos = 0;
    vida = 100;
    vidaMaxima = 100;
    inventario = [];
    /**
     * @param nombre Nombre del jugador
     * @param puntos Puntos del jugador
     * @param vida Vida actual del jugador
     * @param vidaMaxima Vida máxima del jugador
     * @param inventario Array de objetos del jugador
     *
     */
    constructor(nombre) {
        this.nombre = nombre;
        this.puntos = 0;
        this.vida = this.vidaMaxima;
        this.vidaMaxima = 100;
        this.inventario = [];

    }
    /**
     * Añadir un objeto al inventario del jugador.
     * @param objeto Objeto a añadir al inventario
     */

    //añadir objetos al inventario
    anadirObjeto(objeto) {
        const objetoClone = {
            ...objeto
        };
        this.inventario.push(objetoClone);
    }
    /**
     * Sumar puntos al jugador cuando gane batallas.
     * @param puntos Puntos a sumar
     */
    //sumar puntos al jugador cuando gane batallas.
    sumarPuntos(puntos) {
        this.puntos += puntos;
    }
    /**
     * Obtener ataque total: Calculará el ataque en función de los objetos.
     * @returns Ataque total del jugador
     */
    //Obtener ataque total: Calculará el ataque en función de los objetos.
    ataqueTotal() {
        let miAtaque = 0; // Empiezo con 0

        // Busco todas mis armas
        for (let objeto of this.inventario) { // Recorro inventario
            if (objeto.tipo === 'arma') { // Si es arma
                miAtaque += objeto.ataque ? objeto.ataque : 0; // Sumo su ataque si lo tiene
            }
        }

        return miAtaque;
    }
    /**
     * Obtener defensa total: Calculará la defensa en función de los objetos.
     * @returns Defensa total del jugador
     */
    //Obtener defensa total: Calculará la defensa en función de los objetos.
    defensaTotal() {
        let miDefensa = 0; // Empiezo con 0

        // Busco todas mis armaduras
        for (let objeto of this.inventario) {
            if (objeto.tipo === 'armadura') { // Si es armadura
                miDefensa += objeto.defensa ? objeto.defensa : 0; // Sumo su defensa si la tiene
            }
        }

        return miDefensa;
    }
    /**
     * Agrupar inventario por tipo de objeto.
     * @returns Inventario agrupado por tipo
     */
    //Agrupar inventario por tipo de objeto.
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
     * Mostrar información del jugador.
     * @returns Información del jugador
     */
    //Mostrar jugador: Se mostrará su nombre, puntos, vida, ataque, defensa e inventario.
    mostrar() {
        return {
            nombre: this.nombre,
            puntos: this.puntos,
            vida: this.vida, // Añadir vida actual
            vidaMaxima: this.vidaMaxima,
            ataque: this.ataqueTotal(),
            defensa: this.defensaTotal(),
            inventario: this.inventarioPorTipo()
        };
    }
}