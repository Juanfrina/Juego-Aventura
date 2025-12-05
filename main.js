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
            // Escena inicial - actualizar stats del jugador
            updatePlayerStats();
            break;
        case 'scene2':
            // Mercado - generar productos aleatorios y descuentos
            initializeMarket();
            break;
        case 'scene3':
            // Estado post-compra - mostrar cómo quedó el jugador
            updateScene3();
            break;
        case 'scene4':
            // Galería de enemigos - mostrar todos los enemigos con sus imágenes
            initializeEnemies();
            break;
        case 'scene5':
            // Arena de combate - preparar el sistema de batallas
            initializeBattles();
            break;
        case 'scene6':
            // Resultado final - calcular y mostrar clasificación
            showFinalResults();
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
        // Deseleccionar
        card.classList.remove('selected');
        productosSeleccionados = productosSeleccionados.filter(p => p.nombre !== producto.nombre);
    } else {
        // Seleccionar
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
 * el total y habilitando/deshabilitando el botón de compra.
 * @returns {void}
 */
function updateCart() {
    const cartItems = document.getElementById('productos-seleccionados');
    const cartTotal = document.getElementById('total-precio');
    const buyButton = document.getElementById('comprar-btn');
    const dineroMercado = document.getElementById('dinero-mercado');
    const moneyDisplay = document.getElementById('money-display');
    
    // Actualizar dinero disponible en el mercado
    if (dineroMercado && jugador) {
        dineroMercado.textContent = formatearPrecio(jugador.dinero);
    }
    
    // Actualizar indicador de dinero fijo
    if (moneyDisplay && jugador) {
        moneyDisplay.textContent = formatearPrecio(jugador.dinero);
    }
    
    if (productosSeleccionados.length === 0) {
        cartItems.innerHTML = 'Ningún producto seleccionado';
        cartTotal.textContent = '0€';
        buyButton.disabled = true;
    } else {
        cartItems.innerHTML = productosSeleccionados.map(p => 
            `<div class="producto-seleccionado">
                <span>${p.nombre}</span>
                <span>${formatearPrecio(p.precioFinal)}</span>
            </div>`
        ).join('');
        
        const total = productosSeleccionados.reduce((sum, p) => sum + p.precioFinal, 0);
        cartTotal.textContent = formatearPrecio(total);
        
        // Deshabilitar si no tiene suficiente dinero
        buyButton.disabled = jugador && total > jugador.dinero;
        
        // Mostrar advertencia si no alcanza el dinero
        if (jugador && total > jugador.dinero) {
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
 * Actualiza la escena 3 con el estado actual del jugador
 * mostrando puntos, vida, ataque, defensa y objetos comprados.
 * @returns {void}
 */
function updateScene3() {
    if (!jugador) return;
    
    // Actualizar información del jugador
    document.getElementById('player-name-scene3').textContent = jugador.nombre;
    document.getElementById('puntos-scene3').textContent = jugador.puntos;
    document.getElementById('vida-scene3').textContent = `${jugador.vida}/${jugador.vidaMaxima}`;
    document.getElementById('ataque-scene3').textContent = jugador.ataqueTotal();
    document.getElementById('defensa-scene3').textContent = jugador.defensaTotal();
    
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
    
    // Animación de confetti si es PRO
    if (batallasGanadas === totalEnemigos && typeof confetti !== 'undefined') {
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