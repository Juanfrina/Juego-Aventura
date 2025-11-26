/**
 * Clase Producto
 * @class
 * @description Representa un producto del mercado con sus características y bonus
 */
export class Producto {
    nombre;
    precio;
    rareza;
    tipo;
    bonus;

    /**
    * Crea un nuevo producto con las propiedades indicadas
    * @param {string} nombre - Nombre del producto
    * @param {number} precio - Precio en céntimos (sin decimales)
    * @param {string} rareza - Rareza del producto (Comun, Raro, Epico, Legendario)
    * @param {string} tipo - Tipo de producto (arma, armadura, consumible)
    * @param {Object} bonus - Bonus que otorga el producto
    * @param {number} [bonus.ataque] - Bonus de ataque (para armas)
    * @param {number} [bonus.defensa] - Bonus de defensa (para armaduras)
    * @param {number} [bonus.curacion] - Bonus de curación (para consumibles)
    */
    constructor(nombre, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    /**
    * Devuelve una descripción completa del producto
    * @returns {string} Descripción del producto con todos sus atributos
    */
    presentar() {
        const precioFormateado = this.formatearPrecio();
        return `El producto ${this.nombre} es de tipo ${this.tipo}, tiene una rareza de ${this.rareza}, un precio de ${precioFormateado} y otorga un bonus de ${JSON.stringify(this.bonus)}.`;
    }

    /**
    * Formatea el precio de céntimos a euros
    * @returns {string} Precio formateado en euros (ejemplo: "9.50€")
    */
    formatearPrecio() {
        return (this.precio / 100).toFixed(2) + "€";
    }

    /**
    * Aplica un descuento porcentual al precio del producto
    * @param {number} porcentaje - Porcentaje de descuento a aplicar (0-100)
    * @returns {number} Nuevo precio en céntimos tras aplicar el descuento
    */
    aplicarDescuento(porcentaje) {
        if (porcentaje < 0) porcentaje = 0;
        if (porcentaje > 100) porcentaje = 100;

        const nuevoPrecio = this.precio * (1 - porcentaje / 100);
        this.precio = Math.round(nuevoPrecio);
        return this.precio;
    }


}

/**
 * Formateador de moneda para euros (ES)
 * @constant {Intl.NumberFormat}
 */
export const EUR = new Intl.NumberFormat('es-ES', {
    style: 'currency'
    , currency: 'EUR'
});