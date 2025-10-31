// === IMPORTACIONES DE MÓDULOS ===
// Importo todas las clases que necesito para mi juego desde sus respectivos archivos
import {Jugadores} from './modulos/Jugadores.js';           // Clase para crear y manejar jugadores
import {Enemigos,JefeFinal} from './modulos/enemigos.js';   // Clases para crear enemigos normales y jefe final
import {Mercado} from './modulos/mercado.js';               // Clase para el sistema de compras
import {batalla,categorizePlayers,mostrarRanking} from './modulos/Ranking.js'; // Funciones para combate y clasificaciones

// === BIENVENIDA AL JUEGO ===
// Muestro el título del juego en la consola
console.log("🏰 Bienvenidos a 'Aventura en el Reino de JS'");

// === CREAR JUGADORES (CON MIS NOMBRES ELEGIDOS) ===
// Instancio tres jugadores usando el constructor de la clase Jugadores
const jugador1 = new Jugadores('Paco');    // Primer jugador - será como un guerrero
const jugador2 = new Jugadores('Juan');    // Segundo jugador - será como un soldado
const jugador3 = new Jugadores('Gustavo'); // Tercer jugador - será como un cazador

// Concateno los nombres para mostrarlos en una sola línea
console.log("👤 Jugadores:", jugador1.nombre + ", " + jugador2.nombre + ", " + jugador3.nombre);

// === CREAR MIS ENEMIGOS ORIGINALES ===
// Creo tres enemigos con diferentes niveles de dificultad
// Constructor: new Enemigos(tipo, nombre, ataque, vida)
const enemigo1 = new Enemigos('Enemigo', 'Goblin', 15, 50);  // Enemigo débil
const enemigo2 = new Enemigos('Enemigo', 'Orco', 25, 80);    // Enemigo medio
const enemigo3 = new Enemigos('Enemigo', 'Troll', 35, 100);  // Enemigo fuerte

// Muestro las estadísticas de cada enemigo usando template literals
console.log("👹 Enemigos:");
console.log(`🗡️ ${enemigo1.nombre} (ATQ ${enemigo1.nivelataque}, HP ${enemigo1.puntosvida})`);
console.log(`🗡️ ${enemigo2.nombre} (ATQ ${enemigo2.nivelataque}, HP ${enemigo2.puntosvida})`);
console.log(`🗡️ ${enemigo3.nombre} (ATQ ${enemigo3.nivelataque}, HP ${enemigo3.puntosvida})`);

// === CREAR MI JEFE FINAL ORIGINAL ===
// El jefe final hereda de Enemigos pero tiene habilidades especiales
// Constructor: new JefeFinal(nombre, ataque, vida, habilidad)
const jefeFinal = new JefeFinal('Dragón', 35, 120, 'Llamarada');
console.log(`🐉 ${jefeFinal.nombre} (ATQ ${jefeFinal.nivelataque}, HP ${jefeFinal.puntosvida}) — Habilidad: ${jefeFinal.habilidadespecial}`);

// === CREAR MERCADO Y MOSTRAR PRODUCTOS ===
// Instancio el mercado que ya viene con productos predefinidos
const mercado = new Mercado();
console.log("\n🛒 Mercado disponible:");

// === FILTRAR Y MOSTRAR PRODUCTOS POR RAREZA ===
// Uso el método filtrarPorRareza() para separar productos comunes y raros
const productosComunes = mercado.filtrarPorRareza("Comun");
const productosRaros = mercado.filtrarPorRareza("Raro");

// Recorro todos los productos comunes con forEach()
productosComunes.forEach(p => {
    // Uso operador ternario para determinar qué tipo de bonus tiene cada producto
    const bonus = p.bonus.ataque ? `ataque+${p.bonus.ataque}` :      // Si tiene ataque
        p.bonus.defensa ? `defensa+${p.bonus.defensa}` :             // Si tiene defensa
        `curación+${p.bonus.curacion}`;                              // Si tiene curación
    
    // Convierto el precio de céntimos a euros y lo formateo con 2 decimales
    console.log(`- ${p.nombre} [común] (${p.tipo}) — ${(p.precio/100).toFixed(2)} € — ${bonus}`);
});

// Hago lo mismo para los productos raros
productosRaros.forEach(p => {
    const bonus = p.bonus.ataque ? `ataque+${p.bonus.ataque}` :
        p.bonus.defensa ? `defensa+${p.bonus.defensa}` :
        `curación+${p.bonus.curacion}`;
    console.log(`- ${p.nombre} [raro] (${p.tipo}) — ${(p.precio/100).toFixed(2)} € — ${bonus}`);
});

// === PROMOCIONES ESPECIALES ===
// Muestro una promoción ficticia para hacer el juego más realista
console.log("\n🎯 ¡Promoción! 20% de descuento en ítems RAROS");
console.log(`Espada rúnica: 368,00 €`);
console.log(`Escudo de roble: 256,00 €`);
console.log(`Poción grande: 88,00 €`);

// === SIMULAR COMPRAS REALIZADAS ===
console.log("\n📦 Compras realizadas:");

// === EQUIPAMIENTO PARA PACO (JUGADOR 1) ===
// Creo objetos literales con las propiedades necesarias para el inventario
const espadaRunica = {
    nombre: 'Espada rúnica',    // Nombre del objeto
    tipo: 'arma',               // Tipo para que ataqueTotal() lo reconozca
    ataque: 18                  // Valor de ataque que se sumará
};
const armaduraCuero = {
    nombre: 'Armadura de cuero',
    tipo: 'armadura',           // Tipo para que defensaTotal() lo reconozca
    defensa: 8                  // Valor de defensa que se sumará
};

// Uso el método anadirObjeto() para añadir los objetos al inventario de Paco
jugador1.anadirObjeto(espadaRunica);
jugador1.anadirObjeto(armaduraCuero);
console.log(`- ${jugador1.nombre} ha comprado Espada rúnica`);
console.log(`- ${jugador1.nombre} ha comprado Armadura de cuero`);

// === EQUIPAMIENTO PARA GUSTAVO (JUGADOR 3) ===
// Gustavo será como un arquero, le doy un arco
const arcoCaza = {
    nombre: 'Arco de caza',
    tipo: 'arma',
    ataque: 12                  // Menos ataque que la espada pero sigue siendo útil
};
jugador3.anadirObjeto(arcoCaza);
console.log(`- ${jugador3.nombre} ha comprado Arco de caza`);

// === EQUIPAMIENTO PARA JUAN (JUGADOR 2) ===
// Juan será el más fuerte, le doy el mejor equipamiento
const mandobleEpico = {
    nombre: 'Mandoble épico',
    tipo: 'arma',
    ataque: 32                  // El arma más poderosa
};
const placasDraconicas = {
    nombre: 'Placas dracónicas',
    tipo: 'armadura',
    defensa: 28                 // La mejor defensa
};
jugador2.anadirObjeto(mandobleEpico);
jugador2.anadirObjeto(placasDraconicas);
console.log(`- ${jugador2.nombre} ha comprado Mandoble épico`);
console.log(`- ${jugador2.nombre} ha comprado Placas dracónicas`);

// === OBJETOS ADICIONALES ENCONTRADOS ===
console.log("\n🎁 Objetos adicionales encontrados:");

// Doy objetos extra para balancear el juego y que puedan ganar al dragón
const bendicionDragones = {
    nombre: 'Bendición Anti-Dragón',
    tipo: 'arma',
    ataque: 25      // Bonus especial contra dragones
};
jugador2.anadirObjeto(bendicionDragones);
console.log(`- ${jugador2.nombre} ha encontrado: Bendición Anti-Dragón (+25 ATQ vs Dragones)`);

// También mejoro a Paco para que tenga más oportunidades
const pocionFuerza = {
    nombre: 'Poción de Fuerza',
    tipo: 'arma',
    ataque: 15      // Boost temporal de ataque
};
jugador1.anadirObjeto(pocionFuerza);
console.log(`- ${jugador1.nombre} ha usado: Poción de Fuerza (+15 ATQ temporal)`);

// === SISTEMA DE COMBATE PROGRESIVO ===
console.log("\n⚔️ ¡Comienzan las batallas!");

// Creo arrays para manejar mejor a jugadores y enemigos
const jugadores = [jugador1, jugador2, jugador3];
const enemigosNormales = [enemigo1, enemigo2, enemigo3]; // Goblin, Orco, Troll

// Hago copias de los arrays originales para poder modificarlos sin perder los datos originales
// El operador spread (...) crea una copia superficial del array
let enemigosVivos = [...enemigosNormales];
let jugadoresVivos = [...jugadores];

// === FASE 1: COMBATES CONTRA ENEMIGOS NORMALES ===
console.log("\n🗡️ FASE 1: Eliminando amenazas menores...");

// Variable para contar las rondas transcurridas
let rondaNumero = 1;

// Bucle principal del combate - continúa mientras haya enemigos Y jugadores vivos
while (enemigosVivos.length > 0 && jugadoresVivos.length > 0) {
    console.log(`\n⚔️ RONDA ${rondaNumero}`);
    
    // === ALEATORIZAR COMBATES ===
    // Copio los arrays y los mezclo aleatoriamente usando sort() con Math.random()
    // Math.random() - 0.5 genera valores entre -0.5 y 0.5, mezclando el orden
    const jugadoresAleatorios = [...jugadoresVivos].sort(() => Math.random() - 0.5);
    const enemigosAleatorios = [...enemigosVivos].sort(() => Math.random() - 0.5);
    
    // Calculo cuántos combates habrá esta ronda
    // Math.min() asegura que no supere el número de jugadores o enemigos disponibles
    const combatesEstaRonda = Math.min(jugadoresAleatorios.length, enemigosAleatorios.length);
    
    // === EJECUTAR COMBATES DE LA RONDA ===
    // Bucle for para procesar cada combate individual
    for (let i = 0; i < combatesEstaRonda; i++) {
        // Asigno los combatientes basándome en el orden aleatorizado
        const jugador = jugadoresAleatorios[i];
        const enemigo = enemigosAleatorios[i];
        
        console.log(`🎲 ${jugador.nombre} se enfrenta a ${enemigo.nombre}...`);
        
        // Llamo a mi función batalla() importada desde Ranking.js
        let resultado = batalla(jugador, enemigo);
        
        // === PROCESAR RESULTADO DEL COMBATE ===
        if (resultado.ganador === 'player') {
            // === EL JUGADOR GANA ===
            // Genero puntos aleatorios entre 80 y 130
            // Math.floor() redondea hacia abajo, Math.random() * 50 da 0-49.99
            const puntosGanados = Math.floor(Math.random() * 50) + 80;
            
            // Uso el método sumarPuntos() de la clase Jugadores
            jugador.sumarPuntos(puntosGanados);
            console.log(`✅ ${jugador.nombre} vs ${enemigo.nombre} → ganador: ${jugador.nombre} | +${puntosGanados} pts`);
            
            // === ELIMINAR ENEMIGO DERROTADO ===
            // indexOf() encuentra la posición del enemigo en el array
            const indiceEnemigo = enemigosVivos.indexOf(enemigo);
            // splice() elimina 1 elemento en esa posición si existe (índice > -1)
            if (indiceEnemigo > -1) {
                enemigosVivos.splice(indiceEnemigo, 1);
                console.log(`💀 ${enemigo.nombre} ha sido derrotado`);
            }
        } else {
            // === EL ENEMIGO GANA ===
            // El jugador no obtiene puntos pero sigue vivo para la siguiente ronda
            console.log(`❌ ${jugador.nombre} vs ${enemigo.nombre} → ganador: ${enemigo.nombre} | +0 pts`);
            console.log(`😵 ${jugador.nombre} está herido pero continúa...`);
        }
    }
    
    // Incremento el contador de rondas para la siguiente iteración
    rondaNumero++;
    
    // === MEDIDA DE SEGURIDAD ===
    // Evito bucles infinitos limitando a 10 rondas máximo
    if (rondaNumero > 10) {
        console.log("⏰ ¡Tiempo agotado! Los enemigos restantes huyen...");
        break; // Salgo del bucle while forzosamente
    }
}

// === VERIFICAR ACCESO AL JEFE FINAL ===
// Solo si eliminaron TODOS los enemigos normales pueden enfrentar al jefe
if (enemigosVivos.length === 0) {
    console.log("\n🎉 ¡Todos los enemigos menores han sido derrotados!");
    console.log("🚪 El camino hacia el Dragón está despejado...");
    
    // === FASE 2: BATALLA FINAL CONTRA EL DRAGÓN ===
    console.log("\n🐉 FASE 2: ¡BATALLA FINAL CONTRA EL DRAGÓN!");
    
    // === DETERMINAR JUGADORES CALIFICADOS ===
    // Solo los jugadores que ganaron al menos una batalla (puntos > 0) pueden enfrentar al jefe
    // filter() crea un nuevo array solo con los elementos que cumplan la condición
    const jugadoresCalificados = jugadores.filter(j => j.puntos > 0);
    
    // Verifico si hay jugadores aptos para la batalla final
    if (jugadoresCalificados.length === 0) {
        console.log("💀 Ningún jugador está en condiciones de enfrentar al Dragón...");
    } else {
        // === MOSTRAR JUGADORES CALIFICADOS ===
        // map() transforma cada jugador en su nombre, join() los une con comas
        console.log(`⚔️ Jugadores calificados: ${jugadoresCalificados.map(j => j.nombre).join(', ')}`);
        
        // === EJECUTAR BATALLAS CONTRA EL JEFE FINAL ===
        // forEach() ejecuta una función para cada jugador calificado
        // (jugador, index) me proporciona tanto el elemento como su posición
        jugadoresCalificados.forEach((jugador, index) => {
            console.log(`\n🔥 ENFRENTAMIENTO ${index + 1}: ${jugador.nombre} vs ${jefeFinal.nombre}`);
            
            // Ejecuto la batalla contra el jefe final usando mi función batalla()
            let resultadoDragon = batalla(jugador, jefeFinal);
            
            // === PROCESAR RESULTADO DE LA BATALLA FINAL ===
            if (resultadoDragon.ganador === 'player') {
                // === JUGADOR DERROTA AL JEFE FINAL ===
                // Recompensa mayor: puntos aleatorios entre 200 y 300
                const puntosJefeFinal = Math.floor(Math.random() * 100) + 200;
                jugador.sumarPuntos(puntosJefeFinal);
                console.log(`🏆 ¡${jugador.nombre} ha derrotado al ${jefeFinal.nombre}! | +${puntosJefeFinal} pts`);
                console.log(`👑 ¡${jugador.nombre} es el nuevo HÉROE DEL REINO!`);
            } else {
                // === EL JEFE FINAL DERROTA AL JUGADOR ===
                console.log(`🔥 ${jugador.nombre} vs ${jefeFinal.nombre} → ganador: ${jefeFinal.nombre} | +0 pts`);
                console.log(`😵 ${jugador.nombre} ha sido derrotado por el poderoso Dragón...`);
            }
        });
    }
    
} else {
    // === ENEMIGOS NORMALES AÚN VIVOS ===
    // Si quedan enemigos normales, no pueden acceder al jefe final
    console.log("\n⚠️ ¡Aún quedan enemigos por derrotar!");
    // Muestro qué enemigos siguen vivos usando map() para extraer nombres
    console.log(`👹 Enemigos restantes: ${enemigosVivos.map(e => e.nombre).join(', ')}`);
    console.log("🚫 No pueden acceder al Dragón hasta eliminar todas las amenazas...");
}

// === MOSTRAR ESTADÍSTICAS FINALES ===
console.log("\n📊 === ESTADÍSTICAS FINALES ===");
// Recorro todos los jugadores para mostrar sus puntos finales
jugadores.forEach(jugador => {
    console.log(`${jugador.nombre}: ${jugador.puntos} puntos`);
});

// === SISTEMA DE CLASIFICACIÓN ===
console.log("\n🏆 Clasificación por nivel:");
// Uso mi función categorizePlayers() importada para clasificar a los jugadores
const clasificacion = categorizePlayers(jugadores);

// Filtro la clasificación para separar diferentes categorías
const pros = clasificacion.filter(j => j.categoria === 'pro');
const rookies = clasificacion.filter(j => j.categoria === 'rookie');

// Muestro las categorías usando map() para extraer nombres y join() para formatear
console.log(`- PRO: ${pros.map(p => p.nombre).join(', ')}`);
console.log(`- ROOKIE: ${rookies.map(r => r.nombre).join(', ')}`);

// === RANKING FINAL Y CAMPEÓN ===
console.log("\n🏆 RANKING FINAL 🏆");

// Ordeno los jugadores por puntos de mayor a menor usando sort()
// (a, b) => b.puntos - a.puntos es una función de comparación descendente
const jugadoresOrdenados = jugadores.sort((a, b) => b.puntos - a.puntos);

// El primer elemento del array ordenado es el ganador absoluto
const ganador = jugadoresOrdenados[0];

// === MOSTRAR INFORMACIÓN COMPLETA DEL GANADOR ===
console.log(`👑 ${ganador.nombre}`);                                    // Nombre del campeón
console.log(`❤️ Vida: ${ganador.vida}/${ganador.vidaMaxima}`);         // Vida actual/máxima
console.log(`⭐ Puntos: ${ganador.puntos}`);                           // Puntos totales obtenidos
console.log(`⚔️ Ataque total: ${ganador.ataqueTotal()}`);              // Uso método de mi clase
console.log(`🛡️ Defensa total: ${ganador.defensaTotal()}`);            // Uso método de mi clase

// === MANEJO SEGURO DEL INVENTARIO ===
// Uso try-catch para manejar posibles errores en el inventario
try {
    // Intento usar mi método inventarioPorTipo() que agrupa objetos por tipo
    const inventarioAgrupado = ganador.inventarioPorTipo();
    
    // Object.values() convierte el objeto en array de arrays
    // flat() aplana los arrays anidados en un solo array
    const todosLosItems = Object.values(inventarioAgrupado).flat();
    
    // map() extrae solo los nombres de todos los objetos
    const nombresItems = todosLosItems.map(item => item.nombre);
    
    // join() convierte el array en string separado por comas
    console.log(`🎒 Inventario: ${nombresItems.join(', ')}`);
} catch (error) {
    // Si hay error con inventarioPorTipo(), uso el inventario directo como respaldo
    console.log(`🎒 Inventario: ${ganador.inventario.map(item => item.nombre).join(', ')}`);
}