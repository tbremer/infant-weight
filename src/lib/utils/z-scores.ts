import zScores from './z-scores.json';
import zScoresNew from './z-scores.new.json';
import { ensureZScore } from './assertion';

export function calcZScore(weight: number, { L, M, S }: { L: number; M: number; S: number }) {
	return (Math.pow(weight / M, L) - 1) / (L * S);
}

export function zScoreToPercent(zScore: number, useNew: boolean = false): number {
	let fixed: string | number = zScore;

	if (useNew) {
		if (fixed < -3.4) fixed = -3.4;
		if (fixed > 3.4) fixed = 3.4;
	} else {
		if (fixed < -3.0) fixed = -3.0;
		if (fixed > 3.0) fixed = 3.0;
	}

	fixed = fixed.toFixed(2).toString();

	const head = fixed.slice(0, fixed.startsWith('-') ? 4 : 3);
	let tail = parseInt(fixed.slice(-1), 10);

	if (tail > 8) tail = 8;
	if (tail < 0) tail = 0;

	if (!ensureZScore(head)) throw new Error(`No z-score data for ${head}`);

	const scoresTable = useNew ? zScoresNew : zScores;

	const table = scoresTable[head];
	const percent = table[tail];

	return percent;
}
