import { Jugadores } from './Jugadores.js';
import { Enemigos, JefeFinal } from './enemigos.js';

export function batalla(player, enemy) {
	if (!player || !enemy) {
		return { ganador: 'error', detalle: 'Faltan argumentos player o enemy' };
	}

	if (!(player instanceof Jugadores) || !(enemy instanceof Enemigos)) {
		return { ganador: 'error', detalle: 'Los argumentos deben ser instancias de Jugadores y Enemigos' };
	}

	const ataqueJugador = player.ataqueTotal();
	const defensaJugador = player.defensaTotal();

	const ataqueEnemigo = enemy.nivelataque || 0;
	const defensaEnemigo = 0; // Los enemigos no tienen defensa en su clase

	const dañoJugador = Math.max(0, ataqueJugador - defensaEnemigo);
	let dañoEnemigo = Math.max(0, ataqueEnemigo - defensaJugador);

	// Aplicar multiplicador de daño si es jefe
	if (enemy instanceof JefeFinal) {
		dañoEnemigo *= enemy.multiplicardanio;
	}

	let ganador;
	let detalle = `Jugador(A:${ataqueJugador},D:${defensaJugador}) vs Enemigo(A:${ataqueEnemigo},D:${defensaEnemigo}) => DañoJugador=${dañoJugador}, DañoEnemigo=${dañoEnemigo}`;

	if (dañoJugador > dañoEnemigo) {
		ganador = 'player';
		const puntosGanados = 10;
		if (typeof player.sumarPuntos === 'function') {
			player.sumarPuntos(puntosGanados);
		} else {
			player.puntos = (player.puntos || 0) + puntosGanados;
		}
		player.victorias = (player.victorias || 0) + 1;
		detalle += ` -- Resultado: GANA JUGADOR (+${puntosGanados} pts)`;
	} else if (dañoJugador < dañoEnemigo) {
		ganador = 'enemy';
		detalle += ' -- Resultado: GANA ENEMIGO';
	} else {
		ganador = 'draw';
		detalle += ' -- Resultado: EMPATE';
	}

	return { ganador, detalle };
}

export function categorizePlayers(players = [], currentRanking = []) {
	const umbralPro = 100;
	const resultado = [];
	const hayRankingPrevio = Array.isArray(currentRanking) && currentRanking.length > 0;

	// Verificar que los jugadores sean instancias de Jugadores

	for (let i = 0; i < players.length; i++) {
		const p = players[i];
		const puntos = p.puntos || 0;
		let categoria = 'rookie';

		if (!hayRankingPrevio && i === 0) {
			categoria = 'pro';
		} else if (puntos >= umbralPro) {
			categoria = 'pro';
		}

		resultado.push({ nombre: p.nombre || `Jugador${i + 1}`, puntos, categoria });
	}

	return resultado;
}

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
	}));

	console.table(tabla);
	return tabla;
}

// Imprime un reporte completo similar a la imagen: combates por rondas, clasificación por nivel y ranking final detallado
// rounds: array de rondas, cada ronda es array de objetos { combates: [ { playerName, enemyName, ganador, puntosGanados } ] }
// players: array de instancias Jugadores
export function mostrarReporteCompleto(rounds = [], players = []) {
	// 1) Mostrar combates por ronda
	for (let r = 0; r < rounds.length; r++) {
		const ronda = rounds[r];
		console.log(`\n\u2694\ufe0f RONDA ${r + 1}`);
		if (!ronda || !Array.isArray(ronda.combates)) {
			console.log('  (sin combates registrados)');
			continue;
		}

		for (const c of ronda.combates) {
			// Esperamos campos: playerName, enemyName, ganador, puntosGanados
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
	const rookies = categorias.filter(x => x.categoria === 'rookie').map(x => x.nombre);

	console.log('\n\u{1F3C6} Clasificación por nivel:');
	console.log(` - PRO: ${pros.join(', ') || '---'}`);
	console.log(` - ROOKIE: ${rookies.join(', ') || '---'}`);

	// 3) Ranking final detallado
	console.log('\n\u{1F3C6} RANKING FINAL \u{1F3C6}');

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
	}

	return { rondas: rounds.length, ranking: ordenados };
}

export default { batalla, categorizePlayers, mostrarRanking };
