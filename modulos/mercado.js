import {Producto} from './producto.js';

/**
 * Clase Mercado
 * @class
 * @description Gestiona el mercado de productos del juego con funciones de filtrado y descuentos
 */
export class Mercado {

    /**
     * Lista de todos los productos disponibles en el mercado
     * @type {Array<Producto>}
     */
    listaProductos = [
        new Producto("Espada Basica", 500, "Comun", "arma", { ataque: 5 }),
        new Producto("Armadura Ligera", 750, "Raro", "armadura", { defensa: 10 }),
        new Producto("Pocion de vida", 200, "Comun", "consumible", { curacion: 50 }),
        new Producto("Granada", 250, "Raro", "consumible", { ataque: 30 }),
        new Producto("Arco Largo", 1200, "Epico", "arma", { ataque: 15 }),
        new Producto("Escudo Antiguo", 900, "Epico", "armadura", { defensa: 20 }),
        new Producto("Pocion de Mana", 300, "Comun", "consumible", { curacion: 40 }),
        new Producto("Daga Envenenada", 1100, "Legendario", "arma", { ataque: 25 }),
        new Producto("Armadura de Dragón", 2000, "Legendario", "armadura", { defensa: 35 }),
        new Producto("Espada de Hierro", 800, "Raro", "arma", { ataque: 12 }),
        new Producto("Casco de Acero", 600, "Comun", "armadura", { defensa: 8 }),
        new Producto("Martillo de Guerra", 1500, "Epico", "arma", { ataque: 20 }),
        new Producto("Hacha Vikinga", 950, "Raro", "arma", { ataque: 14 }),
        new Producto("Botas de Cuero", 400, "Comun", "armadura", { defensa: 6 }),
        new Producto("Elixir de Fuerza", 450, "Raro", "consumible", { ataque: 10 }),
        new Producto("Ballesta Pesada", 1350, "Epico", "arma", { ataque: 18 }),
        new Producto("Guanteletes de Acero", 550, "Comun", "armadura", { defensa: 7 }),
        new Producto("Bomba de Humo", 320, "Raro", "consumible", { defensa: 15 }),
        new Producto("Lanza de Plata", 1100, "Epico", "arma", { ataque: 17 }),
        new Producto("Armadura Completa", 1800, "Epico", "armadura", { defensa: 25 }),
        new Producto("Pocion Suprema", 800, "Epico", "consumible", { curacion: 100 }),
        new Producto("Espada Maldita", 2500, "Legendario", "arma", { ataque: 30 }),
        new Producto("Escudo Divino", 2200, "Legendario", "armadura", { defensa: 40 }),
        // Añadir a listaProductos:
        //new Producto("Anillo de Agilidad", 600, "Raro", "accesorio", { velocidad: 10 }),
        //new Producto("Botas Aladas", 1200, "Epico", "accesorio", { velocidad: 20 }),
        //new Producto("Capa del Viento", 2000, "Legendario", "accesorio", { velocidad: 35 }),
        new Producto("Nectar de Dioses", 1500, "Legendario", "consumible", { curacion: 150 })
    ];

    /**
     * Filtra productos por rareza específica
     * @param {string} rareza - Rareza por la que filtrar (Comun, Raro, Epico, Legendario)
     * @returns {Array<Producto>} Lista de productos que coinciden con la rareza indicada
     */
    filtrarPorRareza(rareza) {
        return this.listaProductos.filter(producto => producto.rareza === rareza);
    }

    /**
     * Aplica un descuento a todos los productos de una rareza específica
     * @param {string} rareza - Rareza de los productos a los que aplicar descuento
     * @param {number} porcentaje - Porcentaje de descuento a aplicar (0-100)
     * @returns {Array<Producto>} Lista de productos con el descuento aplicado a los que coinciden
     */
    aplicarDescuento(rareza, porcentaje) {
        return this.listaProductos.map(producto => producto.rareza === rareza ? producto.aplicarDescuento(porcentaje) : producto);
    }

    /**
     * Busca un producto específico por su nombre
     * @param {string} nombre - Nombre del producto a buscar
     * @returns {Producto|undefined} Producto que coincide con el nombre o undefined si no se encuentra
     */
    buscarProducto(nombre) {
        return this.listaProductos.find(producto => producto.nombre === nombre);
    }

    /**
     * Muestra la descripción de todos los productos disponibles
     * @returns {Array<string>} Array con las descripciones de todos los productos
     */
    mostrarProducto() {
        return this.listaProductos.map(producto => producto.presentar());
    }
}