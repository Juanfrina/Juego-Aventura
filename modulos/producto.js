export class Producto {
    nombre;
    precio;
    rareza;
    tipo;
    bonus;

    /**
    * Crea un nuevo producto con las propiedades indicadas.
    * @param nombre Nombre del producto.
    * @param precio Precio en céntimos.
    * @param rareza Rareza del producto.
    * @param tipo Tipo de producto.
    * @param bonus Bonus que otorga el producto.
    */
    constructor(nombre, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    /**
    * Devuelve una descripción del producto.
    * @returns Descripción del producto.
    */
    presentar() {
        const precioFormateado = this.formatearPrecio();
        return `El producto ${this.nombre} es de tipo ${this.tipo}, tiene una rareza de ${this.rareza}, un precio de ${precioFormateado} y otorga un bonus de ${JSON.stringify(this.bonus)}.`;
    }

    /**
    * Formatea el precio en euros.
    * @returns Precio formateado en euros.
    */
    formatearPrecio() {
        return (this.precio / 100).toFixed(2) + "€";
    }

    /**
    * Aplica un descuento del 50% al precio recibido y lo asigna al producto.
    * @param porcentaje Porcentaje de descuento a aplicar (0-100).
    * @returns Nuevo precio tras aplicar el descuento.
    */
    aplicarDescuento(porcentaje) {
        if (porcentaje < 0) porcentaje = 0;
        if (porcentaje > 100) porcentaje = 100;

        const nuevoPrecio = this.precio * (1 - porcentaje / 100);
        this.precio = Math.round(nuevoPrecio);
        return this.precio;
    }


}

export const EUR = new Intl.NumberFormat('es-ES', {
    style: 'currency'
    , currency: 'EUR'
});