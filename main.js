// === IMPORTACIONES DE MÓDULOS ES6 ===
// Importamos todas las clases y funciones que necesitamos de otros archivos
import { Jugadores } from './modulos/Jugadores.js';                    // Clase para crear el jugador
import { Enemigos, JefeFinal } from './modulos/enemigos.js';          // Clases para crear enemigos
import { Mercado } from './modulos/mercado.js';                       // Clase del mercado con productos
import { batalla, categorizePlayers, mostrarReporteCompleto } from './modulos/Ranking.js'; // Sistema de combate
import { showScene } from './utils/format.js';                       // Función para cambiar de escena

// === VARIABLES GLOBALES DEL JUEGO ===
// Estas variables mantienen el estado del juego durante toda la partida
let jugador = null;              // Instancia del jugador actual
let mercado = null;              // Instancia del mercado con todos los productos
let enemigos = [];               // Array con los 3 enemigos normales
let jefeFinal = null;            // Instancia del jefe final (Dragón)
let productosSeleccionados = []; // Array temporal de productos que el jugador está comprando
let enemigoActual = 0;           // Índice del enemigo contra el que estamos luchando (0, 1, 2)
let batallasGanadas = 0;         // Contador de victorias para la clasificación final
let objetosComprados = 0;        // Contador de objetos comprados para las estadísticas

// === INICIALIZACIÓN DEL JUEGO ===
// Este evento se ejecuta cuando toda la página HTML se ha cargado completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏰 Iniciando Aventura en el Reino de JS");
    initializeGame(); // Llamamos a la función principal de inicialización
    
    // Pequeño delay para asegurar que todo esté listo antes de actualizar el inventario
    setTimeout(() => {
        updateInventoryDisplay();
    }, 100);
});

// === FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ===
// Esta función configura todo el estado inicial del juego
function initializeGame() {
    console.log('Inicializando juego...');
    
    // Crear jugador con nombre por defecto - se puede cambiar en la escena 1
    jugador = new Jugadores('Aventurero');
    console.log('Jugador creado:', jugador);
    
    // Crear mercado con todos los productos disponibles (24 productos)
    mercado = new Mercado();
    console.log('Mercado creado con', mercado.listaProductos.length, 'productos');
    
    // Crear los 3 enemigos normales con dificultad progresiva
    enemigos = [
        new Enemigos('Enemigo', 'Goblin', 15, 50),   // Fácil - primer enemigo
        new Enemigos('Enemigo', 'Orco', 25, 80),     // Medio - segundo enemigo  
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
function updatePlayerStats() {
    if (!jugador) return;
    
    // Actualizar nombre si se cambió
    const nameInput = document.getElementById('player-name');
    if (nameInput && nameInput.value !== jugador.nombre) {
        jugador.nombre = nameInput.value || 'Aventurero';
    }
    
    // Actualizar estadísticas en pantalla
    document.getElementById('puntos').textContent = jugador.puntos;
    document.getElementById('vida').textContent = jugador.vida;
    document.getElementById('ataque').textContent = jugador.ataqueTotal();
    document.getElementById('defensa').textContent = jugador.defensaTotal();
    
    // Actualizar inventario visual
    updateInventoryDisplay();
}

// === ESCENA 2: INICIALIZAR MERCADO ===
// Esta función configura la tienda cada vez que el jugador entra
function initializeMarket() {
    if (!mercado) return; // Salir si no hay mercado creado
    
    const productosGrid = document.getElementById('productos-grid');
    productosGrid.innerHTML = ''; // Limpiar productos anteriores
    
    // Sistema de descuentos aleatorios - cada rareza tiene un rango diferente
    // Los productos más raros tienen descuentos más grandes
    const descuentos = {
        'Comun': Math.floor(Math.random() * 20) + 5,     // 5-25% de descuento
        'Raro': Math.floor(Math.random() * 30) + 10,     // 10-40% de descuento
        'Epico': Math.floor(Math.random() * 40) + 15,    // 15-55% de descuento
        'Legendario': Math.floor(Math.random() * 50) + 20 // 20-70% de descuento
    };
    
    // Actualizar el texto informativo sobre las ofertas
    const discountInfo = document.getElementById('discount-info') || 
                        document.querySelector('.mercado-subtitle');
    if (discountInfo) {
        discountInfo.textContent = `¡Ofertas especiales! Descuentos aplicados según rareza.`;
    }
    
    // De los 24 productos disponibles, seleccionamos 9 al azar para mostrar
    // Esto hace que cada visita al mercado sea diferente
    const productosAMostrar = mercado.listaProductos
        .sort(() => Math.random() - 0.5)  // Mezclar aleatoriamente
        .slice(0, 9);                     // Tomar solo los primeros 9
    
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

function createProductCard(producto, descuento) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.dataset.productoId = producto.nombre;
    
    const precioOriginal = producto.precio;
    const precioConDescuento = Math.round(precioOriginal * (1 - descuento / 100));
    
    // Determinar imagen según tipo
    let imageSrc = 'imagenes/';
    switch(producto.tipo) {
        case 'arma':
            imageSrc += 'arma.png';
            break;
        case 'armadura':
            imageSrc += 'armadura.png';
            break;
        case 'consumible':
            imageSrc += 'consumible.png';
            break;
        default:
            imageSrc += 'arma.png';
    }
    
    card.innerHTML = `
        <img src="${imageSrc}" alt="${producto.nombre}">
        <h4 class="producto-nombre">${producto.nombre}</h4>
        <div class="producto-info">
            <span class="precio-original">${(precioOriginal/100).toFixed(2)}€</span>
            <span class="precio-descuento">${(precioConDescuento/100).toFixed(2)}€</span>
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
    }
    
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('productos-seleccionados');
    const cartTotal = document.getElementById('total-precio');
    const buyButton = document.getElementById('comprar-btn');
    
    if (productosSeleccionados.length === 0) {
        cartItems.innerHTML = 'Ningún producto seleccionado';
        cartTotal.textContent = '0€';
        buyButton.disabled = true;
    } else {
        cartItems.innerHTML = productosSeleccionados.map(p => 
            `<div class="producto-seleccionado">
                <span>${p.nombre}</span>
                <span>${(p.precioFinal/100).toFixed(2)}€</span>
            </div>`
        ).join('');
        
        const total = productosSeleccionados.reduce((sum, p) => sum + p.precioFinal, 0);
        cartTotal.textContent = `${(total/100).toFixed(2)}€`;
        buyButton.disabled = false;
    }
}

// === FUNCIÓN PARA COMPRAR PRODUCTOS ===
// Esta función se ejecuta cuando el jugador confirma la compra
window.buyItems = function() {
    // Validaciones básicas - no comprar si no hay jugador o productos seleccionados
    if (!jugador || productosSeleccionados.length === 0) return;
    
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

function createEnemyCard(enemigo, isBoss) {
    const card = document.createElement('div');
    card.className = `enemy-card ${isBoss ? 'boss' : ''}`;
    
    // Determinar la imagen del enemigo
    let imageSrc = 'imagenes/';
    switch(enemigo.nombre.toLowerCase()) {
        case 'goblin':
            imageSrc += 'Goblin.jpg';
            break;
        case 'orco':
            imageSrc += 'Orco.jpg';
            break;
        case 'troll':
            imageSrc += 'Troll.jpg';
            break;
        case 'dragón':
        case 'dragon':
            imageSrc += 'Dragon.jpg';
            break;
        default:
            imageSrc += 'enemigo.jpg'; // Imagen por defecto si no coincide
    }
    
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
    }
}

function setupBattle(enemigo) {
    document.getElementById('battle-title').textContent = 
        `Batalla ${enemigoActual + 1}: ${jugador.nombre} vs ${enemigo.nombre}`;
    
    // Información del jugador
    document.getElementById('battle-player-name').textContent = jugador.nombre;
    document.getElementById('battle-player-attack').textContent = jugador.ataqueTotal();
    document.getElementById('battle-player-defense').textContent = jugador.defensaTotal();
    
    // Información del enemigo
    document.getElementById('battle-enemy-name').textContent = enemigo.nombre;
    document.getElementById('battle-enemy-attack').textContent = enemigo.nivelataque;
    document.getElementById('battle-enemy-health').textContent = enemigo.puntosvida;
}

function setupBattleBoss() {
    document.getElementById('battle-title').textContent = 
        `🐉 BATALLA FINAL: ${jugador.nombre} vs ${jefeFinal.nombre}`;
    
    // Información del jugador
    document.getElementById('battle-player-name').textContent = jugador.nombre;
    document.getElementById('battle-player-attack').textContent = jugador.ataqueTotal();
    document.getElementById('battle-player-defense').textContent = jugador.defensaTotal();
    
    // Información del jefe final
    document.getElementById('battle-enemy-name').textContent = `${jefeFinal.nombre} (JEFE)`;
    document.getElementById('battle-enemy-attack').textContent = jefeFinal.nivelataque;
    document.getElementById('battle-enemy-health').textContent = jefeFinal.puntosvida;
    
    // Cambiar colores para indicar que es el jefe final
    const enemySide = document.querySelector('.enemy-side');
    enemySide.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    enemySide.style.borderColor = '#ff0000';
}

// === FUNCIÓN PRINCIPAL DE BATALLA ===
// Se ejecuta cuando el jugador hace clic en "Iniciar Batalla"
window.startBattle = function() {
    // Verificar si ya terminamos con todos los enemigos normales
    if (enemigoActual >= enemigos.length) {
        // Si ya no hay enemigos normales, es hora del jefe final
        battleBoss();
        return;
    }
    
    // Obtener el enemigo actual (Goblin, Orco o Troll)
    const enemigo = enemigos[enemigoActual];
    
    // Ejecutar la batalla usando la función del módulo Ranking.js
    // Esta función compara el ataque del jugador vs defensa del enemigo y viceversa
    const resultado = batalla(jugador, enemigo);
    
    // Mostrar el resultado de la batalla en la interfaz
    showBattleResult(resultado, enemigo);
};

function showBattleResult(resultado, enemigo) {
    console.log(`Resultado batalla ${enemigoActual + 1}:`, resultado.ganador, 'vs', enemigo.nombre);
    console.log(`Enemigo actual: ${enemigoActual}, Total enemigos: ${enemigos.length}`);
    
    const battleResult = document.getElementById('battle-result');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultPoints = document.getElementById('result-points');
    
    battleResult.classList.remove('hidden');
    document.getElementById('start-battle-btn').classList.add('hidden');
    
    if (resultado.ganador === 'player') {
        const puntosGanados = Math.floor(Math.random() * 50) + 50;
        jugador.sumarPuntos(puntosGanados);
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

function battleBoss() {
    const resultado = batalla(jugador, jefeFinal);
    
    const battleResult = document.getElementById('battle-result');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultPoints = document.getElementById('result-points');
    
    battleResult.classList.remove('hidden');
    document.getElementById('start-battle-btn').classList.add('hidden');
    
    if (resultado.ganador === 'player') {
        const puntosGanados = Math.floor(Math.random() * 100) + 200;
        jugador.sumarPuntos(puntosGanados);
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
    
    // Actualizar el resumen estadístico de la partida
    document.getElementById('battles-won').textContent = batallasGanadas;      // Batallas ganadas
    document.getElementById('items-obtained').textContent = objetosComprados; // Objetos comprados
    document.getElementById('final-level').textContent = clasificacionNivel;  // Nivel final
    
    console.log(`Clasificación final: ${clasificacionTexto}`);
}

// === FUNCIÓN PARA REINICIAR EL JUEGO ===
// Permite empezar una nueva partida desde cero
window.restartGame = function() {
    // Simplemente llamamos a la función de inicialización
    // Esto resetea todas las variables y vuelve a la escena 1
    initializeGame();
};

// === ACTUALIZAR INVENTARIO VISUAL ===
// Esta función mantiene sincronizado el inventario visual (footer) con el inventario real del jugador
function updateInventoryDisplay() {
    // Obtener todas las imágenes de los 6 slots del inventario
    const inventarioItems = document.querySelectorAll('#inventario-contenedor .item img');
    
    // Recorrer cada slot del inventario visual
    inventarioItems.forEach((img, index) => {
        // Verificar si hay un objeto en esta posición del inventario del jugador
        if (jugador && jugador.inventario && jugador.inventario[index]) {
            // SLOT OCUPADO - hay un objeto aquí
            const item = jugador.inventario[index];
            let imageSrc = 'imagenes/';
            
            // Determinar qué imagen mostrar según el tipo de objeto
            switch(item.tipo) {
                case 'arma':
                    imageSrc += 'arma.png';        // Imagen de espada para armas
                    break;
                case 'armadura':
                    imageSrc += 'armadura.png';    // Imagen de escudo para armaduras
                    break;
                case 'consumible':
                    imageSrc += 'consumible.png';  // Imagen de poción para consumibles
                    break;
                default:
                    imageSrc += 'arma.png';        // Por defecto, imagen de arma
            }
            
            // Configurar la imagen para mostrar el objeto
            img.src = imageSrc;
            img.alt = item.nombre;  // Texto alternativo con el nombre del objeto
            img.style.opacity = '1';
            img.style.display = 'block';
            img.parentElement.style.backgroundColor = 'var(--secondary-color)'; // Fondo dorado
        } else {
            // SLOT VACÍO - no hay objeto en esta posición
            img.src = '';                    // Sin imagen
            img.alt = 'Slot vacío';
            img.style.opacity = '0';         // Invisible
            img.style.display = 'none';      // Oculto
            img.parentElement.style.backgroundColor = 'rgba(241, 222, 9, 0.3)'; // Fondo semi-transparente
        }
    });
}

// === HACER FUNCIONES GLOBALES ===
window.jugador = jugador;
window.updatePlayerStats = updatePlayerStats;

// === FUNCIÓN PARA ACTUALIZAR NOMBRE DEL JUGADOR ===
window.updatePlayerName = function() {
    const nameInput = document.getElementById('player-name');
    if (nameInput && jugador) {
        jugador.nombre = nameInput.value || 'Aventurero';
        updatePlayerStats();
    }
};

// === CONFIGURAR EVENT LISTENERS AL CARGAR EL DOM ===
document.addEventListener('DOMContentLoaded', function() {
    // Listener para cambio de nombre
    const nameInput = document.getElementById('player-name');
    if (nameInput) {
        nameInput.addEventListener('input', window.updatePlayerName);
        nameInput.addEventListener('blur', window.updatePlayerName);
    }
    
    // Listener para botón de compra
    const buyButton = document.getElementById('comprar-btn');
    if (buyButton) {
        buyButton.addEventListener('click', window.buyItems);
        console.log('Event listener para botón de compra agregado');
    }
});