import zScores from './z-scores.json';
import { ensureZScore } from './assertion';

export function calcZScore(weight: number, { L, M, S }: { L: number; M: number; S: number }) {
	return (Math.pow(weight / M, L) - 1) / (L * S);
}

export function zScoreToPercent(zScore: number): number {
	const fixed = zScore.toFixed(2).toString();
	const head = fixed.slice(0, fixed.startsWith('-') ? 4 : 3);
	let tail = parseInt(fixed.slice(-1), 10);

	if (tail > 8) tail = 8;
	if (tail < 0) tail = 0;

	if (!ensureZScore(head)) throw new Error(`No z-score data for ${head}`);

	const table = zScores[head];
	const percent = table[tail];

	return percent;
}
