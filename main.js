// === IMPORTACIONES DE MÓDULOS ES6 ===
// Importamos todas las clases y funciones que necesitamos de otros archivos
import { Jugadores } from './modulos/Jugadores.js';                    // Clase para crear el jugador
import { Enemigos, JefeFinal } from './modulos/enemigos.js';          // Clases para crear enemigos
import { Mercado } from './modulos/mercado.js';                       // Clase del mercado con productos
import { batalla, categorizePlayers, mostrarReporteCompleto } from './modulos/Ranking.js'; // Sistema de combate
import { 
    showScene,
    calcularDescuentoAleatorio,
    formatearPrecio,
    generarPuntosAleatorios,
    obtenerImagenPorTipo,
    obtenerImagenEnemigo,
    seleccionarAleatorios,
    actualizarTexto,
    toggleVisibilidad
} from './utils/utils.js';                                            // Funciones utilitarias

// === VARIABLES GLOBALES DEL JUEGO ===
// Estas variables mantienen el estado del juego durante toda la partida

/**
 * Instancia del jugador actual
 * @type {Jugadores|null}
 */
let jugador = null;

/**
 * Instancia del mercado con todos los productos
 * @type {Mercado|null}
 */
let mercado = null;

/**
 * Array con los 3 enemigos normales (Goblin, Orco, Troll)
 * @type {Enemigos[]}
 */
let enemigos = [];

/**
 * Instancia del jefe final (Dragón)
 * @type {JefeFinal|null}
 */
let jefeFinal = null;

/**
 * Array temporal de productos que el jugador está comprando
 * @type {Array}
 */
let productosSeleccionados = [];

/**
 * Índice del enemigo contra el que estamos luchando (0, 1, 2)
 * @type {number}
 */
let enemigoActual = 0;

/**
 * Contador de victorias para la clasificación final
 * @type {number}
 */
let batallasGanadas = 0;

/**
 * Contador de objetos comprados para las estadísticas
 * @type {number}
 */
let objetosComprados = 0;

// === INICIALIZACIÓN DEL JUEGO ===
// La inicialización del DOM se maneja en el listener consolidado al final del archivo

// === FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ===
// Esta función configura todo el estado inicial del juego

/**
 * Inicializa el juego creando el jugador, mercado, enemigos y jefe final.
 * Resetea todas las variables a su estado inicial y muestra la primera escena.
 * @returns {void}
 */
function initializeGame() {
    console.log('Inicializando juego...');
    
    // Crear jugador con nombre por defecto - se puede cambiar en la escena 1
    jugador = new Jugadores('Aventurero');
    jugador.vida = 100; // Asegurar que empieza con vida completa
    console.log('Jugador creado:', jugador);
    
    // Crear mercado con todos los productos disponibles (24 productos)
    mercado = new Mercado();
    console.log('Mercado creado con', mercado.listaProductos.length, 'productos');
    
    // Crear los 3 enemigos normales con dificultad progresiva
    enemigos = [
        new Enemigos('Enemigo', 'Goblin', 15, 50),   // Fácil - primer enemigo
        new Enemigos('Enemigo', 'Orco', 25, 80),     // Medio - segundo enemigo
        //new Enemigos('Enemigo', 'Esqueleto', 30, 90),    // Difícil - cuarto enemigo
        new Enemigos('Enemigo', 'Troll', 35, 100)    // Difícil - tercer enemigo
    ];
    
    // Crear jefe final - mucho más fuerte que los enemigos normales
    // Tiene multiplicador de daño (1.5) y habilidad especial
    jefeFinal = new JefeFinal('Dragón', 50, 150, 'Llamarada', 1.5);
    
    // Resetear todas las variables a su estado inicial
    productosSeleccionados = [];
    enemigoActual = 0;
    batallasGanadas = 0;
    objetosComprados = 0;
    
    // Actualizar la interfaz con los datos iniciales
    updatePlayerStats();        // Mostrar stats del jugador
    updateInventoryDisplay();   // Mostrar inventario vacío
    
    // Empezar mostrando la primera escena
    showScene('scene1');
    
    console.log('Juego inicializado correctamente');
}

// === NAVEGACIÓN ENTRE ESCENAS ===
// Sistema de navegación - solo una escena visible a la vez
// La hacemos global (window.) para poder llamarla desde los botones HTML

/**
 * Muestra una escena específica y oculta todas las demás.
 * Ejecuta acciones específicas según la escena que se va a mostrar.
 * @param {string} sceneId - El ID de la escena a mostrar ('scene1', 'scene2', etc.)
 * @returns {void}
 */
window.showScene = function(sceneId) {
    // Primero ocultamos todas las escenas quitando la clase 'active'
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    
    // Luego mostramos solo la escena solicitada añadiendo la clase 'active'
    document.getElementById(sceneId).classList.add('active');
    
    // Ejecutamos acciones específicas según la escena que se va a mostrar
    switch(sceneId) {
        case 'scene1':
            // Escena 1: Formulario de creación del personaje
            updatePlayerStats();
            break;
        case 'scene2':
            // Escena 2: Tarjeta del jugador (preview antes del mercado)
            updateScene2();
            break;
        case 'scene3':
            // Escena 3: Mercado - generar productos aleatorios y descuentos
            initializeMarket();
            break;
        case 'scene4':
            // Escena 4: Tarjeta del jugador actualizada (post-compra)
            updateScene4();
            break;
        case 'scene5':
            // Escena 5: Galería de enemigos - mostrar todos los enemigos
            initializeEnemies();
            break;
        case 'scene6':
            // Escena 6: Arena de combate - sistema de batallas
            initializeBattles();
            break;
        case 'scene7':
            // Escena 7: Resultado final - clasificación
            showFinalResults();
            break;
        case 'scene8':
            // Escena 8: Ranking (historial de jugadores)
            loadHistorial();
            break;
    }
};

// === ESCENA 1: ACTUALIZAR ESTADÍSTICAS DEL JUGADOR ===

/**
 * Actualiza las estadísticas del jugador en la interfaz (puntos, vida, ataque, defensa).
 * También actualiza el nombre si se cambió y refresca el inventario visual.
 * Sistema de 10 puntos para distribuir entre vida, ataque y defensa.
 * @returns {void}
 */
function updatePlayerStats() {
    if (!jugador) return;
    
    // Actualizar nombre si se cambió
    const nameInput = document.getElementById('player-name');
    if (nameInput && nameInput.value !== jugador.nombre) {
        jugador.nombre = nameInput.value || 'Aventurero';
    }
    
    // Obtener valores de los inputs
    const vidaInput = document.getElementById('vida-input');
    const ataqueInput = document.getElementById('ataque-input');
    const defensaInput = document.getElementById('defensa-input');
    const puntosRestantesSpan = document.getElementById('puntos-restantes');
    
    let vidaPuntos = parseInt(vidaInput?.value) || 0;
    let ataquePuntos = parseInt(ataqueInput?.value) || 0;
    let defensaPuntos = parseInt(defensaInput?.value) || 0;
    
    // Validar que no sean valores negativos
    if (vidaPuntos < 0) {
        vidaPuntos = 0;
        if (vidaInput) vidaInput.value = 0;
    }
    if (ataquePuntos < 0) {
        ataquePuntos = 0;
        if (ataqueInput) ataqueInput.value = 0;
    }
    if (defensaPuntos < 0) {
        defensaPuntos = 0;
        if (defensaInput) defensaInput.value = 0;
    }
    
    // Calcular puntos gastados
    const PUNTOS_TOTALES = 10;
    const puntosGastados = vidaPuntos + ataquePuntos + defensaPuntos;
    const puntosRestantes = PUNTOS_TOTALES - puntosGastados;
    
    // Validar que no se excedan los 10 puntos
    if (puntosRestantes < 0) {
        // Si se excede, ajustar el último valor modificado
        if (vidaInput === document.activeElement) {
            vidaPuntos = Math.max(0, vidaPuntos + puntosRestantes);
            vidaInput.value = vidaPuntos;
        } else if (ataqueInput === document.activeElement) {
            ataquePuntos = Math.max(0, ataquePuntos + puntosRestantes);
            ataqueInput.value = ataquePuntos;
        } else if (defensaInput === document.activeElement) {
            defensaPuntos = Math.max(0, defensaPuntos + puntosRestantes);
            defensaInput.value = defensaPuntos;
        }
    }
    
    // Recalcular puntos restantes después del ajuste
    const puntosFinales = PUNTOS_TOTALES - (vidaPuntos + ataquePuntos + defensaPuntos);
    
    // Actualizar indicador de puntos restantes
    if (puntosRestantesSpan) {
        puntosRestantesSpan.textContent = puntosFinales;
        // Cambiar color según puntos restantes
        if (puntosFinales === 0) {
            puntosRestantesSpan.style.color = 'var(--accent-color)'; // Verde - todos usados
        } else if (puntosFinales < 0) {
            puntosRestantesSpan.style.color = 'var(--danger-color)'; // Rojo - excedido
        } else {
            puntosRestantesSpan.style.color = 'var(--secondary-color)'; // Amarillo - quedan puntos
        }
    }
    
    // Aplicar valores al jugador
    // Vida base es 100, más los puntos invertidos
    jugador.vidaMaxima = 100 + vidaPuntos;
    jugador.vida = jugador.vidaMaxima;
    jugador.ataqueBase = ataquePuntos;
    jugador.defensaBase = defensaPuntos;
    
    // Actualizar estadísticas en pantalla
    document.getElementById('puntos').textContent = jugador.puntos;
    document.getElementById('dinero').textContent = formatearPrecio(jugador.dinero);
    
    // Actualizar indicador de dinero fijo
    const moneyDisplay = document.getElementById('money-display');
    if (moneyDisplay) {
        moneyDisplay.textContent = formatearPrecio(jugador.dinero);
    }
    
    // Actualizar inventario visual
    updateInventoryDisplay();
}

// === ESCENA 2: INICIALIZAR MERCADO ===
// Esta función configura la tienda cada vez que el jugador entra

/**
 * Inicializa el mercado generando descuentos aleatorios por rareza
 * y mostrando 9 productos aleatorios de los 24 disponibles.
 * @returns {void}
 */
function initializeMarket() {
    if (!mercado) return; // Salir si no hay mercado creado
    
    const productosGrid = document.getElementById('productos-grid');
    productosGrid.innerHTML = ''; // Limpiar productos anteriores
    
    // Sistema de descuentos aleatorios - cada rareza tiene un rango diferente
    // Los productos más raros tienen descuentos más grandes
    const descuentos = {
        'Comun': calcularDescuentoAleatorio('Comun'),
        'Raro': calcularDescuentoAleatorio('Raro'),
        'Epico': calcularDescuentoAleatorio('Epico'),
        'Legendario': calcularDescuentoAleatorio('Legendario')
    };
    
    // Actualizar el texto informativo sobre las ofertas
    const discountInfo = document.getElementById('discount-info') || 
                        document.querySelector('.mercado-subtitle');
    if (discountInfo) {
        discountInfo.textContent = `¡Ofertas especiales! Descuentos aplicados según rareza.`;
    }
    
    // De los 24 productos disponibles, seleccionamos 9 al azar para mostrar
    // Esto hace que cada visita al mercado sea diferente
    const productosAMostrar = seleccionarAleatorios(mercado.listaProductos, 9);
    
    // Crear una tarjeta visual para cada producto seleccionado
    productosAMostrar.forEach(producto => {
        // Crear la tarjeta con el descuento correspondiente a su rareza
        const productoCard = createProductCard(producto, descuentos[producto.rareza] || 0);
        productosGrid.appendChild(productoCard); // Añadir al grid
    });
    
    // Limpiar el carrito de compras al entrar al mercado
    productosSeleccionados = [];
    updateCart(); // Actualizar la UI del carrito
}

/**
 * Crea una tarjeta HTML para mostrar un producto con su descuento aplicado.
 * @param {Object} producto - El objeto producto del mercado
 * @param {number} descuento - Porcentaje de descuento a aplicar (0-100)
 * @returns {HTMLElement} El elemento DOM de la tarjeta del producto
 */
function createProductCard(producto, descuento) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.dataset.productoId = producto.nombre;
    
    const precioOriginal = producto.precio;
    const precioConDescuento = Math.round(precioOriginal * (1 - descuento / 100));
    
    // Determinar imagen según tipo usando función utilitaria
    const imageSrc = obtenerImagenPorTipo(producto.tipo);
    //<div class="cover">🔍 Ver</div>
    card.innerHTML = `
        
        <img src="${imageSrc}" alt="${producto.nombre}">
        <h4 class="producto-nombre">${producto.nombre}</h4>
        <div class="producto-info">
            <span class="precio-original">${formatearPrecio(precioOriginal)}</span>
            <span class="precio-descuento">${formatearPrecio(precioConDescuento)}</span>
        </div>
        <div class="producto-detalles">
            <span class="categoria">${producto.tipo}</span>
            <span class="rareza">${producto.rareza}</span>
        </div>
    `;
    
    // Agregar evento de click
    card.addEventListener('click', () => toggleProductSelection(card, producto, precioConDescuento));
    
    return card;
}

// Manejar selección/deselección de productos en el mercado

/**
 * Maneja la selección y deselección de productos en el mercado.
 * Añade o quita productos del carrito con animación visual.
 * @param {HTMLElement} card - El elemento DOM de la tarjeta del producto
 * @param {Object} producto - El objeto producto
 * @param {number} precio - El precio final con descuento aplicado
 * @returns {void}
 */
function toggleProductSelection(card, producto, precio) {
    const isSelected = card.classList.contains('selected');
    
    if (isSelected) {
        // Deseleccionar - siempre permitido
        card.classList.remove('selected');
        productosSeleccionados = productosSeleccionados.filter(p => p.nombre !== producto.nombre);
    } else {
        // Calcular el total actual del carrito + el nuevo producto
        const totalActual = productosSeleccionados.reduce((sum, p) => sum + p.precioFinal, 0);
        const nuevoTotal = totalActual + precio;
        
        // Validar que hay suficiente dinero disponible
        if (jugador && nuevoTotal > jugador.dinero) {
            // No tiene suficiente dinero - mostrar aviso
            alert(`¡No tienes suficiente dinero!\nDinero disponible: ${formatearPrecio(jugador.dinero)}\nTotal en carrito: ${formatearPrecio(nuevoTotal)}`);
            return; // No añadir el producto
        }
        
        // Seleccionar - tiene suficiente dinero
        card.classList.add('selected');
        productosSeleccionados.push({
            ...producto,
            precioFinal: precio
        });
        
        // Mostrar indicador animado de añadido
        const indicator = document.createElement('div');
        indicator.className = 'added-indicator';
        indicator.textContent = '✓';
        card.appendChild(indicator);
        
        // Eliminar el indicador después de la animación
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }
    
    updateCart();
}

// Actualizar la interfaz del carrito de compras

/**
 * Actualiza la interfaz del carrito mostrando los productos seleccionados,
 * el total, el dinero disponible restante y habilitando/deshabilitando el botón de compra.
 * @returns {void}
 */
function updateCart() {
    const cartItems = document.getElementById('productos-seleccionados');
    const cartTotal = document.getElementById('total-precio');
    const buyButton = document.getElementById('comprar-btn');
    const dineroMercado = document.getElementById('dinero-mercado');
    const moneyDisplay = document.getElementById('money-display');
    
    // Calcular el total del carrito
    const totalCarrito = productosSeleccionados.reduce((sum, p) => sum + p.precioFinal, 0);
    
    // Calcular dinero disponible restante (dinero actual - lo que hay en el carrito)
    const dineroRestante = jugador ? jugador.dinero - totalCarrito : 0;
    
    // Actualizar dinero disponible en el mercado (muestra lo que quedaría tras la compra)
    if (dineroMercado && jugador) {
        dineroMercado.textContent = formatearPrecio(dineroRestante);
        // Cambiar color si está en negativo o muy bajo
        dineroMercado.style.color = dineroRestante < 0 ? 'var(--danger-color)' : '';
    }
    
    // Actualizar indicador de dinero fijo (muestra el dinero real del jugador)
    if (moneyDisplay && jugador) {
        moneyDisplay.textContent = formatearPrecio(jugador.dinero);
    }
    
    if (productosSeleccionados.length === 0) {
        cartItems.innerHTML = 'Ningún producto seleccionado';
        cartTotal.textContent = '0';
        buyButton.disabled = true;
        // Restaurar el color del dinero disponible
        if (dineroMercado) {
            dineroMercado.style.color = '';
        }
    } else {
        cartItems.innerHTML = productosSeleccionados.map(p => 
            `<div class="producto-seleccionado">
                <span>${p.nombre}</span>
                <span>${formatearPrecio(p.precioFinal)}</span>
            </div>`
        ).join('');
        
        cartTotal.textContent = formatearPrecio(totalCarrito);
        
        // Deshabilitar si no tiene suficiente dinero
        buyButton.disabled = jugador && totalCarrito > jugador.dinero;
        
        // Mostrar advertencia si no alcanza el dinero
        if (jugador && totalCarrito > jugador.dinero) {
            cartItems.innerHTML += `<div style="color: var(--danger-color); font-weight: bold; margin-top: 10px;">¡No tienes suficiente dinero!</div>`;
        }
    }
}

// === FUNCIÓN PARA COMPRAR PRODUCTOS ===
// Esta función se ejecuta cuando el jugador confirma la compra

/**
 * Procesa la compra de los productos seleccionados,
 * añadiéndolos al inventario del jugador y actualizando la interfaz.
 * @returns {void}
 */
window.buyItems = function() {
    // Validaciones básicas - no comprar si no hay jugador o productos seleccionados
    if (!jugador || productosSeleccionados.length === 0) return;
    
    // Calcular total de la compra
    const totalCompra = productosSeleccionados.reduce((sum, p) => sum + p.precioFinal, 0);
    
    // Verificar si tiene suficiente dinero
    if (jugador.dinero < totalCompra) {
        alert('¡No tienes suficiente dinero para esta compra!');
        return;
    }
    
    // Restar el dinero del jugador
    jugador.gastarDinero(totalCompra);
    console.log(`Dinero gastado: ${formatearPrecio(totalCompra)}. Dinero restante: ${formatearPrecio(jugador.dinero)}`);
    
    console.log('Comprando productos:', productosSeleccionados); // Debug para desarrollo
    
    // Procesar cada producto seleccionado
    productosSeleccionados.forEach(producto => {
        // Convertir el producto del mercado a formato de objeto de inventario
        // Extraemos los bonus de ataque/defensa/curación de cada producto
        const objetoParaInventario = {
            nombre: producto.nombre,
            tipo: producto.tipo,
            // Si el producto tiene bonus de ataque, lo usamos; si no, 0
            ataque: producto.bonus && producto.bonus.ataque ? producto.bonus.ataque : 0,
            defensa: producto.bonus && producto.bonus.defensa ? producto.bonus.defensa : 0,
            curacion: producto.bonus && producto.bonus.curacion ? producto.bonus.curacion : 0
        };
        
        // Añadir el objeto al inventario del jugador usando el método de la clase
        jugador.anadirObjeto(objetoParaInventario);
        objetosComprados++; // Incrementar contador para estadísticas finales
        console.log('Objeto añadido al inventario:', objetoParaInventario); // Debug
    });
    
    console.log('Inventario actual del jugador:', jugador.inventario); // Debug
    
    // Mostrar mensaje de confirmación en el carrito
    const cartItems = document.getElementById('productos-seleccionados');
    cartItems.innerHTML = `<div style="color: var(--accent-color); font-weight: bold; text-align: center;">
        ¡Compra realizada con éxito!<br>
        ${productosSeleccionados.length} objeto(s) añadido(s) al inventario.
    </div>`;
    
    // Limpiar la selección visual - quitar el color verde de las tarjetas
    document.querySelectorAll('.producto-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    productosSeleccionados = []; // Vaciar el array de productos seleccionados
    
    // Actualizar toda la interfaz para reflejar los cambios
    updatePlayerStats();      // Recalcular ataque y defensa con los nuevos objetos
    updateInventoryDisplay(); // Mostrar los objetos comprados en el inventario visual
    updateCart();            // Limpiar el carrito de compras
    
    console.log('Compra completada. Inventario actualizado.'); // Debug
};

// === ESCENA 3: ACTUALIZAR ESTADO ACTUAL ===

/**
 * Actualiza la escena 2 con la tarjeta del jugador (preview antes del mercado)
 * mostrando los stats iniciales del personaje creado.
 * @returns {void}
 */
function updateScene2() {
    if (!jugador) return;
    
    // Actualizar información del jugador en scene2
    const playerNameScene2 = document.getElementById('player-name-scene2');
    const puntosScene2 = document.getElementById('puntos-scene2');
    const vidaScene2 = document.getElementById('vida-scene2');
    const ataqueScene2 = document.getElementById('ataque-scene2');
    const defensaScene2 = document.getElementById('defensa-scene2');
    const dineroScene2 = document.getElementById('dinero-scene2');
    
    if (playerNameScene2) playerNameScene2.textContent = jugador.nombre;
    if (puntosScene2) puntosScene2.textContent = jugador.puntos;
    if (vidaScene2) vidaScene2.textContent = `${jugador.vida}/${jugador.vidaMaxima}`;
    if (ataqueScene2) ataqueScene2.textContent = jugador.ataqueTotal();
    if (defensaScene2) defensaScene2.textContent = jugador.defensaTotal();
    if (dineroScene2) dineroScene2.textContent = formatearPrecio(jugador.dinero);
}

/**
 * Actualiza la escena 4 con el estado actual del jugador después del mercado
 * mostrando puntos, vida, ataque, defensa y objetos comprados.
 * @returns {void}
 */
function updateScene4() {
    if (!jugador) return;
    
    // Actualizar información del jugador
    document.getElementById('player-name-scene4').textContent = jugador.nombre;
    document.getElementById('puntos-scene4').textContent = jugador.puntos;
    document.getElementById('vida-scene4').textContent = `${jugador.vida}/${jugador.vidaMaxima}`;
    document.getElementById('ataque-scene4').textContent = jugador.ataqueTotal();
    document.getElementById('defensa-scene4').textContent = jugador.defensaTotal();
    
    // Mostrar objetos comprados
    const itemsComprados = document.getElementById('items-comprados');
    if (jugador.inventario.length === 0) {
        itemsComprados.innerHTML = 'No se han comprado objetos';
    } else {
        itemsComprados.innerHTML = jugador.inventario.map(item => 
            `<div class="item-comprado">
                <span>${item.nombre}</span>
                <span>${item.tipo}</span>
            </div>`
        ).join('');
    }
}

// === ESCENA 4: INICIALIZAR ENEMIGOS ===

/**
 * Inicializa la galería de enemigos mostrando los 3 enemigos normales
 * y el jefe final con sus imágenes y estadísticas.
 * @returns {void}
 */
function initializeEnemies() {
    const enemiesGrid = document.getElementById('enemies-grid');
    enemiesGrid.innerHTML = '';
    
    // Mostrar enemigos normales
    enemigos.forEach(enemigo => {
        const enemyCard = createEnemyCard(enemigo, false);
        enemiesGrid.appendChild(enemyCard);
    });
    
    // Mostrar jefe final
    const bossCard = createEnemyCard(jefeFinal, true);
    enemiesGrid.appendChild(bossCard);
}

// Crear tarjeta visual para cada enemigo

/**
 * Crea una tarjeta HTML para mostrar un enemigo con su imagen y estadísticas.
 * @param {Enemigos|JefeFinal} enemigo - El objeto enemigo o jefe final
 * @param {boolean} isBoss - Indica si es el jefe final para aplicar estilos especiales
 * @returns {HTMLElement} El elemento DOM de la tarjeta del enemigo
 */
function createEnemyCard(enemigo, isBoss) {
    const card = document.createElement('div');
    card.className = `enemy-card ${isBoss ? 'boss' : ''}`;
    
    // Determinar la imagen del enemigo usando función utilitaria
    const imageSrc = obtenerImagenEnemigo(enemigo.nombre);
    
    card.innerHTML = `
        <img class="enemy-image" src="${imageSrc}" alt="${enemigo.nombre}">
        <h3 class="enemy-name">${enemigo.nombre}</h3>
        <div class="enemy-stats">
            <div class="enemy-stat">
                <span class="enemy-stat-label">Ataque</span>
                <span class="enemy-stat-value">${enemigo.nivelataque}</span>
            </div>
            <div class="enemy-stat">
                <span class="enemy-stat-label">Vida</span>
                <span class="enemy-stat-value">${enemigo.puntosvida}</span>
            </div>
        </div>
        ${isBoss ? `<div class="enemy-special">Habilidad: ${enemigo.habilidadespecial}</div>` : ''}
    `;
    
    return card;
}

// === ESCENA 5: SISTEMA DE BATALLAS ===
// Preparar la arena de combate - el corazón del juego

/**
 * Inicializa el sistema de batallas, reseteando contadores
 * y preparando la interfaz para la primera batalla.
 * @returns {void}
 */
function initializeBattles() {
    enemigoActual = 0;    // Empezamos con el primer enemigo (Goblin)
    batallasGanadas = 0;  // Resetear contador de victorias
    
    console.log(`Inicializando batallas. Total enemigos: ${enemigos.length}`);
    
    // Si tenemos enemigos disponibles, configurar la primera batalla
    if (enemigos.length > 0) {
        setupBattle(enemigos[enemigoActual]); // Configurar batalla vs primer enemigo
    }
    
    // Resetear toda la interfaz de batalla a su estado inicial
    document.getElementById('battle-result').classList.add('hidden');        // Ocultar resultado
    document.getElementById('start-battle-btn').classList.remove('hidden');  // Mostrar botón de iniciar
    document.getElementById('start-battle-btn').textContent = 'Iniciar Batalla'; // Texto por defecto
    document.getElementById('start-battle-btn').style.backgroundColor = '#ff4444'; // Color rojo normal
    document.getElementById('start-battle-btn').style.borderColor = '#ff0000';
    document.getElementById('next-battle-btn').textContent = 'Siguiente Batalla'; // Resetear texto
    document.getElementById('next-battle-btn').classList.add('hidden');       // Ocultar botón siguiente
    document.getElementById('finish-battles-btn').classList.add('hidden');    // Ocultar botón final
    
    // Resetear colores del lado enemigo a los colores normales (no jefe final)
    const enemySide = document.querySelector('.enemy-side');
    if (enemySide) {
        enemySide.style.backgroundColor = 'rgba(255, 68, 68, 0.2)'; // Rojo claro
        enemySide.style.borderColor = '#ff4444';                    // Borde rojo normal
    };
}

// Configurar la interfaz para la batalla actual

/**
 * Configura la interfaz para mostrar la batalla actual contra un enemigo normal.
 * Actualiza nombres, estadísticas, imágenes y reinicia las animaciones.
 * @param {Enemigos} enemigo - El enemigo contra el que se va a luchar
 * @returns {void}
 */
function setupBattle(enemigo) {
    document.getElementById('battle-title').textContent = 
        `Batalla ${enemigoActual + 1}: ${jugador.nombre} vs ${enemigo.nombre}`;
    
    // Información del jugador
    document.getElementById('battle-player-name').textContent = jugador.nombre;
    document.getElementById('battle-player-attack').textContent = jugador.ataqueTotal();
    document.getElementById('battle-player-defense').textContent = jugador.defensaTotal();
    
    // Imagen del jugador
    document.getElementById('battle-player-image').src = 'imagenes/heroe.jpg';
    
    // Información del enemigo
    document.getElementById('battle-enemy-name').textContent = enemigo.nombre;
    document.getElementById('battle-enemy-attack').textContent = enemigo.nivelataque;
    document.getElementById('battle-enemy-health').textContent = enemigo.puntosvida;
    
    // Imagen del enemigo usando función utilitaria
    const imageSrc = obtenerImagenEnemigo(enemigo.nombre);
    document.getElementById('battle-enemy-image').src = imageSrc;
    
    // Reiniciar animaciones quitando y volviendo a añadir las clases
    const playerSide = document.querySelector('.player-side');
    const enemySide = document.querySelector('.enemy-side');
    
    if (playerSide && enemySide) {
        // Remover clases para resetear animación
        playerSide.style.animation = 'none';
        enemySide.style.animation = 'none';
        
        // Forzar reflow para que el navegador reconozca el cambio
        void playerSide.offsetWidth;
        void enemySide.offsetWidth;
        
        // Volver a aplicar animaciones
        playerSide.style.animation = 'slideInFromLeft 0.8s ease-out';
        enemySide.style.animation = 'slideInFromRight 0.8s ease-out';
    }
}

// Configurar la interfaz para la batalla contra el jefe final

/**
 * Configura la interfaz para la batalla final contra el jefe.
 * Cambia colores, actualiza información y reinicia animaciones con efecto especial.
 * @returns {void}
 */
function setupBattleBoss() {
    document.getElementById('battle-title').textContent = 
        `🐉 BATALLA FINAL: ${jugador.nombre} vs ${jefeFinal.nombre}`;
    
    // Información del jugador
    document.getElementById('battle-player-name').textContent = jugador.nombre;
    document.getElementById('battle-player-attack').textContent = jugador.ataqueTotal();
    document.getElementById('battle-player-defense').textContent = jugador.defensaTotal();
    
    // Imagen del jugador
    document.getElementById('battle-player-image').src = 'imagenes/heroe.jpg';
    
    // Información del jefe final
    document.getElementById('battle-enemy-name').textContent = `${jefeFinal.nombre} (JEFE)`;
    document.getElementById('battle-enemy-attack').textContent = jefeFinal.nivelataque;
    document.getElementById('battle-enemy-health').textContent = jefeFinal.puntosvida;
    
    // Imagen del jefe final
    const imageSrc = obtenerImagenEnemigo(jefeFinal.nombre);
    document.getElementById('battle-enemy-image').src = imageSrc;
    
    // Cambiar colores para indicar que es el jefe final
    const enemySide = document.querySelector('.enemy-side');
    enemySide.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    enemySide.style.borderColor = '#ff0000';
    
    // Reiniciar animaciones para el jefe final
    const playerSide = document.querySelector('.player-side');
    
    if (playerSide && enemySide) {
        // Remover animaciones
        playerSide.style.animation = 'none';
        enemySide.style.animation = 'none';
        
        // Forzar reflow
        void playerSide.offsetWidth;
        void enemySide.offsetWidth;
        
        // Volver a aplicar animaciones
        playerSide.style.animation = 'slideInFromRight 0.8s ease-out';
        enemySide.style.animation = 'slideInFromLeft 0.8s ease-out';
    }
}

// === FUNCIÓN PRINCIPAL DE BATALLA ===
// Se ejecuta cuando el jugador hace clic en "Iniciar Batalla"

/**
 * Inicia una batalla contra el enemigo actual o el jefe final.
 * Resetea la vida del jugador, ejecuta la batalla y muestra el resultado.
 * @returns {void}
 */
window.startBattle = function() {
    // Verificar si ya terminamos con todos los enemigos normales
    if (enemigoActual >= enemigos.length) {
        // Si ya no hay enemigos normales, es hora del jefe final
        battleBoss();
        return;
    }
    
    // Resetear vida del jugador al máximo (con bonus de consumibles) antes de cada batalla
    jugador.vida = jugador.vidaTotal();
    
    // Obtener el enemigo actual (Goblin, Orco o Troll)
    const enemigo = enemigos[enemigoActual];
    
    // Ejecutar la batalla usando la función del módulo Ranking.js
    // Esta función compara el ataque del jugador vs defensa del enemigo y viceversa
    const resultado = batalla(jugador, enemigo);
    
    // Mostrar el resultado de la batalla en la interfaz
    showBattleResult(resultado, enemigo);
};

// Mostrar el resultado de la batalla en la interfaz

/**
 * Muestra el resultado de una batalla en la interfaz con mensajes personalizados.
 * Gestiona la visibilidad de botones según si quedan más enemigos.
 * @param {Object} resultado - Objeto con ganador, puntosGanados y detalles de la batalla
 * @param {Enemigos} enemigo - El enemigo que se enfrentó
 * @returns {void}
 */
function showBattleResult(resultado, enemigo) {
    console.log(`Resultado batalla ${enemigoActual + 1}:`, resultado.ganador, 'vs', enemigo.nombre);
    console.log(`Enemigo actual: ${enemigoActual}, Total enemigos: ${enemigos.length}`);
    
    const battleResult = document.getElementById('battle-result');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultPoints = document.getElementById('result-points');
    
    toggleVisibilidad('battle-result', false);
    toggleVisibilidad('start-battle-btn', true);
    
    if (resultado.ganador === 'player') {
        // Los puntos ya fueron sumados en la función batalla()
        const puntosGanados = resultado.puntosGanados || 0;
        batallasGanadas++;
        
        resultTitle.textContent = '¡Victoria!';
        resultTitle.style.color = 'var(--accent-color)';
        resultDescription.textContent = `¡Has derrotado a ${enemigo.nombre}!`;
        resultPoints.textContent = `+${puntosGanados} puntos`;
        resultPoints.style.color = 'var(--accent-color)';
        
        console.log(`Victoria! Batallas ganadas: ${batallasGanadas}, Puntos: ${jugador.puntos}`);
    } else {
        resultTitle.textContent = 'Derrota';
        resultTitle.style.color = '#ff4444';
        resultDescription.textContent = `${enemigo.nombre} te ha derrotado...`;
        resultPoints.textContent = '+0 puntos';
        resultPoints.style.color = '#ff4444';
        
        console.log('Derrota contra', enemigo.nombre);
    }
    
    // Mostrar botón apropiado
    if (enemigoActual < enemigos.length - 1) {
        // Hay más enemigos normales - resetear texto y mostrar
        console.log('Mostrando botón: Siguiente Batalla');
        document.getElementById('next-battle-btn').textContent = 'Siguiente Batalla';
        document.getElementById('next-battle-btn').classList.remove('hidden');
    } else {
        // Última batalla normal completada - ir al jefe final
        console.log('¡Todos los enemigos normales derrotados! Preparando jefe final...');
        document.getElementById('next-battle-btn').textContent = 'Enfrentar Jefe Final';
        document.getElementById('next-battle-btn').classList.remove('hidden');
    }
}

// Manejar la transición a la siguiente batalla o al jefe final

/**
 * Maneja la transición a la siguiente batalla.
 * Avanza al siguiente enemigo o prepara la batalla final contra el jefe.
 * @returns {void}
 */
window.nextBattle = function() {
    enemigoActual++;
    
    if (enemigoActual < enemigos.length) {
        // Siguiente enemigo normal
        setupBattle(enemigos[enemigoActual]);
        document.getElementById('battle-result').classList.add('hidden');
        document.getElementById('start-battle-btn').classList.remove('hidden');
        document.getElementById('next-battle-btn').classList.add('hidden');
        document.getElementById('next-battle-btn').textContent = 'Siguiente Batalla'; // Resetear texto
    } else {
        // Preparar batalla final contra el jefe
        setupBattleBoss();
        document.getElementById('battle-result').classList.add('hidden');
        document.getElementById('start-battle-btn').textContent = '⚔️ ¡ENFRENTAR JEFE FINAL!';
        document.getElementById('start-battle-btn').classList.remove('hidden');
        document.getElementById('next-battle-btn').classList.add('hidden');
        
        // Cambiar colores para la batalla final
        document.getElementById('start-battle-btn').style.backgroundColor = '#ff0000';
        document.getElementById('start-battle-btn').style.borderColor = '#cc0000';
    }
};

// Función para manejar la batalla contra el jefe final

/**
 * Ejecuta la batalla contra el jefe final y muestra el resultado.
 * Resetea la vida del jugador y actualiza las estadísticas.
 * @returns {void}
 */
function battleBoss() {
    // Resetear vida del jugador al máximo (con bonus de consumibles) antes de la batalla final
    jugador.vida = jugador.vidaTotal();
    
    const resultado = batalla(jugador, jefeFinal);
    
    const battleResult = document.getElementById('battle-result');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultPoints = document.getElementById('result-points');
    
    toggleVisibilidad('battle-result', false);
    toggleVisibilidad('start-battle-btn', true);
    
    if (resultado.ganador === 'player') {
        // Los puntos ya fueron sumados en la función batalla()
        const puntosGanados = resultado.puntosGanados || 0;
        batallasGanadas++;
        
        resultTitle.textContent = '¡VICTORIA ÉPICA!';
        resultTitle.style.color = 'gold';
        resultDescription.textContent = `¡Has derrotado al ${jefeFinal.nombre}! ¡Eres el héroe del reino!`;
        resultPoints.textContent = `+${puntosGanados} puntos`;
        resultPoints.style.color = 'gold';
    } else {
        resultTitle.textContent = 'Derrota Heroica';
        resultTitle.style.color = '#ff4444';
        resultDescription.textContent = `El ${jefeFinal.nombre} te ha derrotado, pero luchaste valientemente.`;
        resultPoints.textContent = '+0 puntos';
        resultPoints.style.color = '#ff4444';
    }
    
    document.getElementById('finish-battles-btn').textContent = 'Ver Resultado Final';
    document.getElementById('finish-battles-btn').classList.remove('hidden');
    
    // Actualizar estadísticas del jugador
    updatePlayerStats();
}

// === ESCENA 6: MOSTRAR RESULTADOS FINALES ===
// Sistema de clasificación final basado en el rendimiento del jugador

/**
 * Calcula y muestra los resultados finales del juego.
 * Clasifica al jugador como PRO, A medias o Perdedor según batallas ganadas.
 * Activa confetti si el jugador ganó todas las batallas.
 * @returns {void}
 */
function showFinalResults() {
    // Calcular total de enemigos disponibles (3 normales + 1 jefe = 4)
    const totalEnemigos = enemigos.length + 1; // +1 por el jefe final
    
    // Variables para la clasificación final
    let clasificacionTexto = '';   // El mensaje principal ("¡ERES UNA MÁQUINA!")
    let clasificacionNivel = '';   // El nivel (PRO, A medias, Perdedor)
    let clasificacionClase = '';   // La clase CSS para los colores
    
    console.log(`Batallas ganadas: ${batallasGanadas}, Total enemigos: ${totalEnemigos}`);
    
    // Sistema de clasificación basado en batallas ganadas
    if (batallasGanadas === totalEnemigos) {
        // PERFECTO - Derrotó a TODOS los enemigos (3 normales + jefe final)
        clasificacionTexto = '¡ERES UNA MÁQUINA!';
        clasificacionNivel = 'PRO';
        clasificacionClase = 'pro';    // CSS verde para éxito total
    } else if (batallasGanadas > 0) {
        // PARCIAL - Ganó algunas batallas pero no todas
        clasificacionTexto = '¡TE QUEDASTE A MEDIAS!';
        clasificacionNivel = 'A medias';
        clasificacionClase = 'medias'; // CSS amarillo para éxito parcial
    } else {
        // FRACASO - No ganó ninguna batalla
        clasificacionTexto = '¡ERES UN PERDEDOR!';
        clasificacionNivel = 'Perdedor';
        clasificacionClase = 'rookie';  // CSS rojo para fracaso
    }
    
    // Actualizar la interfaz con la clasificación obtenida
    const finalStatus = document.getElementById('final-status');
    const finalClassification = document.getElementById('final-classification');
    const finalPointsText = document.getElementById('final-points-text');
    
    // Aplicar la clase CSS correspondiente para los colores
    finalStatus.className = `final-status ${clasificacionClase}`;
    finalClassification.textContent = clasificacionTexto;
    finalPointsText.textContent = `${jugador.puntos} puntos`;
    
    // Actualizar la TABLA DE RANKING
    document.getElementById('rank-nombre').textContent = jugador.nombre;
    document.getElementById('rank-puntos').textContent = jugador.puntos;
    document.getElementById('rank-dinero').textContent = formatearPrecio(jugador.dinero);
    document.getElementById('rank-batallas').textContent = `${batallasGanadas}/${totalEnemigos}`;
    document.getElementById('rank-vida').textContent = `${jugador.vida}/${jugador.vidaMaxima}`;
    document.getElementById('rank-ataque').textContent = jugador.ataqueTotal();
    document.getElementById('rank-defensa').textContent = jugador.defensaTotal();
    document.getElementById('rank-objetos').textContent = objetosComprados;
    document.getElementById('rank-nivel').textContent = clasificacionNivel;
    
    console.log(`Clasificación final: ${clasificacionTexto}`);
    
    // Animación de confetti y monedas cayendo si es PRO
    if (batallasGanadas === totalEnemigos && typeof confetti !== 'undefined') {
        // Mostrar monedas cayendo
        showFallingCoins();
        
        // Lanzar confetti múltiples veces para efecto dramático
        const duration = 3000; // 3 segundos
        const end = Date.now() + duration;
        
        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }
            
            // Confetti desde ambos lados
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 }
            });
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 }
            });
        }, 250);
    }
    
    // Guardar jugador actual en LocalStorage y mostrar historial
    guardarJugadorEnHistorial();
    mostrarHistorialJugadores();
}

/**
 * Guarda el jugador actual en el historial de LocalStorage
 * @returns {void}
 */
function guardarJugadorEnHistorial() {
    // Obtener historial existente o crear array vacío
    let historial = JSON.parse(localStorage.getItem('historialJugadores')) || [];
    
    // Crear objeto con datos del jugador actual
    const jugadorActual = {
        nombre: jugador.nombre,
        puntuacion: jugador.puntos,
        monedas: jugador.dinero,
        fecha: new Date().toISOString()
    };
    
    // Añadir al historial
    historial.push(jugadorActual);
    
    // Guardar en LocalStorage
    localStorage.setItem('historialJugadores', JSON.stringify(historial));
    
    console.log('Jugador guardado en historial:', jugadorActual);
}

/**
 * Muestra el historial de jugadores en la tabla de la escena final
 * Ordena por puntuación de mayor a menor
 * @returns {void}
 */
function mostrarHistorialJugadores() {
    const tbody = document.getElementById('historial-tbody');
    if (!tbody) return;
    
    // Obtener historial de LocalStorage
    let historial = JSON.parse(localStorage.getItem('historialJugadores')) || [];
    
    // Si no hay historial, simular algunos jugadores de ejemplo
    if (historial.length === 0) {
        historial = [
            { nombre: 'Caballero', puntuacion: 350, monedas: 200 },
            { nombre: 'Mago', puntuacion: 280, monedas: 150 },
            { nombre: 'Arquero', puntuacion: 220, monedas: 100 }
        ];
        localStorage.setItem('historialJugadores', JSON.stringify(historial));
    }
    
    // Ordenar por puntuación (mayor a menor)
    historial.sort((a, b) => b.puntuacion - a.puntuacion);
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Crear filas para cada jugador
    historial.forEach((jugadorHist, index) => {
        const tr = document.createElement('tr');
        
        // Marcar al jugador actual (el último añadido con el mismo nombre y puntuación)
        if (jugadorHist.nombre === jugador.nombre && 
            jugadorHist.puntuacion === jugador.puntos && 
            jugadorHist.monedas === jugador.dinero) {
            tr.classList.add('jugador-actual');
        }
        
        tr.innerHTML = `
            <td>${jugadorHist.nombre}</td>
            <td>${jugadorHist.puntuacion}</td>
            <td>${formatearPrecio(jugadorHist.monedas)}</td>
        `;
        
        tbody.appendChild(tr);
    });
    
    console.log('Historial mostrado:', historial.length, 'jugadores');
}

/**
 * Carga y muestra el historial de jugadores en la escena 8 (Ranking)
 * Con número de posición en la tabla
 * @returns {void}
 */
function loadHistorial() {
    const tbody = document.getElementById('historial-tbody');
    if (!tbody) return;
    
    // Obtener historial de LocalStorage
    let historial = JSON.parse(localStorage.getItem('historialJugadores')) || [];
    
    // Si no hay historial, crear jugadores de ejemplo
    if (historial.length === 0) {
        historial = [
            { nombre: 'Caballero', puntuacion: 350, monedas: 200 },
            { nombre: 'Mago', puntuacion: 280, monedas: 150 },
            { nombre: 'Arquero', puntuacion: 220, monedas: 100 },
            { nombre: 'Guerrero', puntuacion: 180, monedas: 80 },
            { nombre: 'Druida', puntuacion: 150, monedas: 120 },
            { nombre: 'Bárbaro', puntuacion: 120, monedas: 50 },
            { nombre: 'Paladín', puntuacion: 100, monedas: 90 },
            { nombre: 'Asesino', puntuacion: 80, monedas: 60 }
        ];
        localStorage.setItem('historialJugadores', JSON.stringify(historial));
    }
    
    // Ordenar por puntuación (mayor a menor)
    historial.sort((a, b) => b.puntuacion - a.puntuacion);
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Crear filas para cada jugador con posición
    historial.forEach((jugadorHist, index) => {
        const tr = document.createElement('tr');
        
        // Marcar al jugador actual
        if (jugador && jugadorHist.nombre === jugador.nombre && 
            jugadorHist.puntuacion === jugador.puntos && 
            jugadorHist.monedas === jugador.dinero) {
            tr.classList.add('jugador-actual');
        }
        
        // Medallas para top 3
        let posicion = index + 1;
        let posicionDisplay = '';
        if (index === 0) posicionDisplay = '🥇';
        else if (index === 1) posicionDisplay = '🥈';
        else if (index === 2) posicionDisplay = '🥉';
        else posicionDisplay = posicion;
        
        tr.innerHTML = `
            <td>${posicionDisplay}</td>
            <td>${jugadorHist.nombre}</td>
            <td>${jugadorHist.puntuacion}</td>
            <td>${formatearPrecio(jugadorHist.monedas)}</td>
        `;
        
        tbody.appendChild(tr);
    });
    
    console.log('Ranking cargado:', historial.length, 'jugadores');
}

// === FUNCIÓN PARA REINICIAR EL JUEGO ===
// Permite empezar una nueva partida desde cero

/**
 * Reinicia el juego completo, reseteando todas las variables
 * y volviendo a la primera escena.
 * @returns {void}
 */
window.restartGame = function() {
    // Simplemente llamamos a la función de inicialización
    // Esto resetea todas las variables y vuelve a la escena 1
    initializeGame();
};

// === ACTUALIZAR INVENTARIO VISUAL ===
// Esta función mantiene sincronizado el inventario visual (footer) con el inventario real del jugador

/**
 * Actualiza el inventario visual en el footer mostrando las imágenes
 * de los objetos que el jugador tiene equipados.
 * @returns {void}
 */
function updateInventoryDisplay() {
    // Obtener todas las imágenes de los 6 slots del inventario
    const inventarioItems = document.querySelectorAll('#inventario-contenedor .item img');
    
    // Recorrer cada slot del inventario visual
    inventarioItems.forEach((img, index) => {
        const slot = img.parentElement; // El div .item que contiene la imagen
        
        // Verificar si hay un objeto en esta posición del inventario del jugador
        if (jugador && jugador.inventario && jugador.inventario[index]) {
            // SLOT OCUPADO - hay un objeto aquí
            const item = jugador.inventario[index];
            
            // Determinar qué imagen mostrar según el tipo de objeto usando función utilitaria
            const imageSrc = obtenerImagenPorTipo(item.tipo);
            
            // Configurar la imagen para mostrar el objeto
            img.src = imageSrc;
            img.alt = item.nombre;  // Texto alternativo con el nombre del objeto
            img.style.opacity = '1';
            img.style.display = 'block';
            slot.style.backgroundColor = 'var(--secondary-color)'; // Fondo dorado
            
            // Añadir tooltip con información del objeto
            slot.setAttribute('data-tooltip', `${item.nombre} - ${item.tipo}`);
        } else {
            // SLOT VACÍO - no hay objeto en esta posición
            img.src = '';                    // Sin imagen
            img.alt = 'Slot vacío';
            img.style.opacity = '0';         // Invisible
            img.style.display = 'none';      // Oculto
            slot.style.backgroundColor = 'rgba(241, 222, 9, 0.3)'; // Fondo semi-transparente
            
            // Quitar tooltip del slot vacío
            slot.removeAttribute('data-tooltip');
        }
    });
}

// === HACER FUNCIONES GLOBALES ===
window.jugador = jugador;
window.updatePlayerStats = updatePlayerStats;

// === FUNCIÓN PARA ACTUALIZAR NOMBRE DEL JUGADOR ===

/**
 * Actualiza el nombre del jugador desde el input de texto.
 * Valida: máximo 20 caracteres y sin espacios.
 * @returns {void}
 */
window.updatePlayerName = function() {
    const nameInput = document.getElementById('player-name');
    if (nameInput && jugador) {
        // Eliminar espacios del nombre
        let nombre = nameInput.value.replace(/\s/g, '');
        
        // Limitar a 20 caracteres
        if (nombre.length > 20) {
            nombre = nombre.substring(0, 20);
        }
        
        // Actualizar el input con el valor limpio
        nameInput.value = nombre;
        
        // Asignar al jugador (usar 'Aventurero' si está vacío)
        jugador.nombre = nombre || 'Aventurero';
        updatePlayerStats();
    }
};

// === CONFIGURAR EVENT LISTENERS AL CARGAR EL DOM ===
// Este es el único punto de entrada cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏰 Iniciando Aventura en el Reino de JS");
    
    // Inicializar el juego completo
    initializeGame();
    
    // Pequeño delay para asegurar que todo esté listo antes de actualizar el inventario
    setTimeout(() => {
        updateInventoryDisplay();
    }, 100);
    
    // Listener para cambio de nombre
    const nameInput = document.getElementById('player-name');
    if (nameInput) {
        nameInput.addEventListener('input', window.updatePlayerName);
        nameInput.addEventListener('blur', window.updatePlayerName);
    }
    
    // Listeners para cambio de estadísticas (vida, ataque, defensa)
    const vidaInput = document.getElementById('vida-input');
    const ataqueInput = document.getElementById('ataque-input');
    const defensaInput = document.getElementById('defensa-input');
    
    if (vidaInput) {
        vidaInput.addEventListener('input', updatePlayerStats);
        vidaInput.addEventListener('blur', updatePlayerStats);
    }
    if (ataqueInput) {
        ataqueInput.addEventListener('input', updatePlayerStats);
        ataqueInput.addEventListener('blur', updatePlayerStats);
    }
    if (defensaInput) {
        defensaInput.addEventListener('input', updatePlayerStats);
        defensaInput.addEventListener('blur', updatePlayerStats);
    }
    
    // Listener para botón de compra
    const buyButton = document.getElementById('comprar-btn');
    if (buyButton) {
        buyButton.addEventListener('click', window.buyItems);
        console.log('Event listener para botón de compra agregado');
    }
});

/**
 * Muestra la animación de monedas cayendo
 * Las monedas caen desde arriba, rotan y se difuminan al llegar al centro
 */
function showFallingCoins() {
    const container = document.getElementById('falling-coins');
    if (!container) return;
    
    // Mostrar el contenedor
    container.style.display = 'block';
    
    // Reiniciar las animaciones removiendo y añadiendo la clase
    const coins = container.querySelectorAll('.falling-coin');
    coins.forEach(coin => {
        coin.style.animation = 'none';
        coin.offsetHeight; // Forzar reflow
        coin.style.animation = '';
    });
    
    // Ocultar después de que termine la animación (3s para incluir delays)
    setTimeout(() => {
        container.style.display = 'none';
    }, 3500);
}

// Exponer función globalmente para poder usarla
window.showFallingCoins = showFallingCoins;

/**
 * Valida el nombre del jugador en tiempo real
 * - Solo permite letras (incluidas acentuadas) y espacios
 * - Primera letra debe ser mayúscula
 * - Máximo 20 caracteres
 * - No permite solo espacios en blanco
 * @param {HTMLInputElement} input - El elemento input del nombre
 */
function validarNombre(input) {
    let valor = input.value;
    
    // Eliminar caracteres no permitidos (solo letras y espacios)
    valor = valor.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, '');
    
    // Si hay contenido, asegurar que la primera letra sea mayúscula
    if (valor.length > 0) {
        valor = valor.charAt(0).toUpperCase() + valor.slice(1);
    }
    
    // Limitar a 20 caracteres
    if (valor.length > 20) {
        valor = valor.substring(0, 20);
    }
    
    // Actualizar el valor del input
    input.value = valor;
    
    // Validar que no sea solo espacios en blanco
    if (valor.trim().length === 0 && valor.length > 0) {
        input.setCustomValidity('El nombre no puede contener solo espacios');
    } else if (valor.length === 0) {
        input.setCustomValidity('El nombre es obligatorio');
    } else {
        input.setCustomValidity('');
    }
}

// Exponer función globalmente para el evento oninput del HTML
window.validarNombre = validarNombre;