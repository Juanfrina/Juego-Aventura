import { Jugadores } from './Jugadores.js';
import { Enemigos, JefeFinal } from './enemigos.js';

/**
 * Sistema de batalla por turnos entre jugador y enemigo
 * @param {Jugadores} player - Instancia del jugador
 * @param {Enemigos|JefeFinal} enemy - Instancia del enemigo o jefe final
 * @returns {Object} Objeto con ganador, puntosGanados y detalle de la batalla
 */
export function batalla(player, enemy) {
	// Validaciones
	if (!player || !enemy) {
		return { ganador: 'error', puntosGanados: 0, detalle: 'Faltan argumentos player o enemy' };
	}

	if (!(player instanceof Jugadores) || !(enemy instanceof Enemigos)) {
		return { ganador: 'error', puntosGanados: 0, detalle: 'Los argumentos deben ser instancias de Jugadores y Enemigos' };
	}

	// Obtener estadísticas iniciales del jugador
	const ataqueJugador = player.ataqueTotal();
	const defensaJugador = player.defensaTotal();
	const vidaMaximaJugador = player.vidaTotal(); // Vida máxima con bonus de consumibles
	let vidaJugador = vidaMaximaJugador; // El jugador empieza cada batalla con vida completa

	// Obtener estadísticas del enemigo
	const ataqueEnemigo = enemy.nivelataque || 0;
	let vidaEnemigo = enemy.puntosvida || 0;

	// Variables para el registro de batalla
	let turnos = 0;
	const MAX_TURNOS = 100; // Seguridad para evitar bucles infinitos
	let detalle = `⚔️ Batalla: ${player.nombre} vs ${enemy.nombre}\n`;
	detalle += `Jugador - ATQ: ${ataqueJugador}, DEF: ${defensaJugador}, VIDA: ${vidaJugador}/${vidaMaximaJugador}\n`;
	detalle += `Enemigo - ATQ: ${ataqueEnemigo}, VIDA: ${vidaEnemigo}\n\n`;

	// SISTEMA DE COMBATE POR TURNOS
	while (vidaJugador > 0 && vidaEnemigo > 0 && turnos < MAX_TURNOS) {
		turnos++;
		detalle += `--- Turno ${turnos} ---\n`;

		// TURNO DEL JUGADOR: Atacar al enemigo
		// Vida del enemigo = vida actual - ataque del jugador
		vidaEnemigo = vidaEnemigo - ataqueJugador;
		detalle += `${player.nombre} ataca: ${ataqueJugador} de daño → Enemigo queda con ${Math.max(0, vidaEnemigo)} HP\n`;

		// Verificar si el enemigo murió
		if (vidaEnemigo <= 0) {
			detalle += `💀 ${enemy.nombre} ha sido derrotado!\n`;
			break;
		}

		// TURNO DEL ENEMIGO: Atacar al jugador
		// Vida del jugador = (vida actual + defensa) - ataque del enemigo
		const vidaAnterior = vidaJugador;
		vidaJugador = (vidaJugador + defensaJugador) - ataqueEnemigo;
		detalle += `${enemy.nombre} ataca: ${ataqueEnemigo} de daño bloqueado por ${defensaJugador} de defensa → Jugador ${vidaAnterior} HP → ${Math.max(0, vidaJugador)} HP\n`;

		// Verificar si el jugador murió
		if (vidaJugador <= 0) {
			detalle += `💀 ${player.nombre} ha sido derrotado!\n`;
			break;
		}
	}

	// DETERMINAR GANADOR Y CALCULAR PUNTOS
	let ganador;
	let puntosGanados = 0;
	let dinero = 5;

	if (vidaJugador > 0 && vidaEnemigo <= 0) {
		// EL JUGADOR GANA
		ganador = 'player';
		
		// CÁLCULO DE PUNTOS SEGÚN ESPECIFICACIÓN:
		// - 100 puntos base
		// - + daño del enemigo
		// - × multiplicador si es jefe
		puntosGanados = 100 + ataqueEnemigo + dinero;
		
		// Si es un jefe final, multiplicar por su multiplicador
		if (enemy instanceof JefeFinal) {
			puntosGanados = Math.floor(puntosGanados * enemy.multiplicardanio) + 10;
			detalle += `🐉 ¡JEFE DERROTADO! Puntos × ${enemy.multiplicardanio} (multiplicador de jefe)\n`;
		}

		detalle += `\n✅ VICTORIA - ${player.nombre} gana ${puntosGanados} puntos!\n`;
		detalle += `Cálculo: 100 (base) + ${ataqueEnemigo} (daño enemigo)${enemy instanceof JefeFinal ? ` × ${enemy.multiplicardanio}` : ''} = ${puntosGanados} pts\n`;

		// Sumar puntos al jugador
		player.sumarPuntos(puntosGanados);
		
		// Actualizar vida del jugador (queda con la vida restante)
		player.vida = Math.max(0, vidaJugador);

	} else if (vidaEnemigo > 0 && vidaJugador <= 0) {
		// EL ENEMIGO GANA
		ganador = 'enemy';
		puntosGanados = 0;
		detalle += `\n❌ DERROTA - ${player.nombre} no gana puntos\n`;
		
		// El jugador pierde pero mantiene vida en 0
		player.vida = 0;

	} else {
		// EMPATE (muy raro, pero por seguridad)
		ganador = 'draw';
		puntosGanados = 0;
		detalle += `\n⚖️ EMPATE - Batalla finalizada sin vencedor\n`;
	}

	detalle += `Turnos totales: ${turnos}\n`;

	return { ganador, puntosGanados, detalle, turnos };
}

/**
 * Categoriza jugadores según su puntuación
 * @param {Array<Jugadores>} players - Array de jugadores
 * @param {number} umbral - Umbral para ser "PRO" (por defecto 100)
 * @returns {Array<Object>} Array con jugadores categorizados
 */
export function categorizePlayers(players = [], umbral = 100) {
	const resultado = [];

	for (let i = 0; i < players.length; i++) {
		const p = players[i];
		const puntos = p.puntos || 0;
		
		// Determinar categoría según umbral
		const categoria = puntos >= umbral ? 'pro' : 'perdedor';

		resultado.push({ 
			nombre: p.nombre || `Jugador${i + 1}`, 
			puntos, 
			categoria 
		});
	}

	return resultado;
}

/**
 * Muestra un ranking de jugadores ordenado por puntos
 * @param {Array<Jugadores>} players - Array de jugadores
 * @returns {Array<Object>} Tabla de ranking
 */
export function mostrarRanking(players = []) {
	if (!Array.isArray(players)) {
		console.error('mostrarRanking: se esperaba un array de jugadores');
		return;
	}

	const copia = [...players].sort((a, b) => (b.puntos || 0) - (a.puntos || 0));

	const tabla = copia.map((p, idx) => ({
		Pos: idx + 1,
		Nombre: p.nombre || `Jugador${idx + 1}`,
		Puntos: p.puntos || 0,
		Victorias: p.victorias || 0,
		Ataque: typeof p.ataqueTotal === 'function' ? p.ataqueTotal() : (p.nivelataque || 0),
		Defensa: typeof p.defensaTotal === 'function' ? p.defensaTotal() : (p.defensa || 0),
		Dinero: dinero,
	}));

	console.table(tabla);
	return tabla;
}

/**
 * Imprime un reporte completo de combates, clasificación y ranking final
 * @param {Array} rounds - Array de rondas con combates
 * @param {Array<Jugadores>} players - Array de jugadores
 * @returns {Object} Objeto con rondas y ranking
 */
export function mostrarReporteCompleto(rounds = [], players = []) {
	// 1) Mostrar combates por ronda
	for (let r = 0; r < rounds.length; r++) {
		const ronda = rounds[r];
		console.log(`\n⚔️ RONDA ${r + 1}`);
		if (!ronda || !Array.isArray(ronda.combates)) {
			console.log('  (sin combates registrados)');
			continue;
		}

		for (const c of ronda.combates) {
			const p = c.playerName || 'Jugador';
			const e = c.enemyName || 'Enemigo';
			const g = c.ganador || 'desconocido';
			const pts = typeof c.puntosGanados === 'number' ? ` | +${c.puntosGanados} pts` : '';
			console.log(`  - ${p} vs ${e} -> ganador: ${g}${pts}`);
		}
	}

	// 2) Clasificación por nivel
	const categorias = categorizePlayers(players);
	const pros = categorias.filter(x => x.categoria === 'pro').map(x => x.nombre);
	const perdedores = categorias.filter(x => x.categoria === 'perdedor').map(x => x.nombre);

	console.log('\n🏆 Clasificación por nivel:');
	console.log(` - PRO: ${pros.join(', ') || '---'}`);
	console.log(` - PERDEDOR: ${perdedores.join(', ') || '---'}`);

	// 3) Ranking final detallado
	console.log('\n🏆 RANKING FINAL 🏆');

	// Ordenar jugadores por puntos
	const ordenados = [...players].sort((a, b) => (b.puntos || 0) - (a.puntos || 0));

	for (const jugador of ordenados) {
		const nombre = jugador.nombre || 'Jugador';
		const vida = jugador.vida !== undefined ? `${jugador.vida}/${jugador.vidaMaxima || 100}` : 'N/A';
		const puntos = jugador.puntos || 0;
		const ataque = typeof jugador.ataqueTotal === 'function' ? jugador.ataqueTotal() : (jugador.nivelataque || 0);
		const defensa = typeof jugador.defensaTotal === 'function' ? jugador.defensaTotal() : (jugador.defensa || 0);
		const inventario = Array.isArray(jugador.inventario) ? jugador.inventario.map(it => it.nombre || it.tipo || JSON.stringify(it)).join(', ') : 'Sin inventario';

		console.log('\n------------------------------------');
		console.log(` ${nombre}`);
		console.log(` Vida: ${vida}`);
		console.log(` Puntos: ${puntos}`);
		console.log(` Ataque total: ${ataque}`);
		console.log(` Defensa total: ${defensa}`);
		console.log(` Inventario: ${inventario}`);
		console.log(`Dinero total: ${dinero}`)
	}

	return { rondas: rounds.length, ranking: ordenados };
}
localStorage.setItem("nombre","nameInput", "puntos","puntosGanados", "dinero","jugador.dinero")


export default { batalla, categorizePlayers, mostrarRanking };
