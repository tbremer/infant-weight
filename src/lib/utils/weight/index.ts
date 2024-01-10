import boysWeight from './boys.json';
import girlsWeight from './girls.json';
import { ensureKey } from '../assertion';

export function lbsToKg(lbs: number): number {
	return lbs * 0.45359237;
}

export function getLMS(
	daysOld: number,
	gender: 'male' | 'female'
): { L: number; M: number; S: number } {
	const str = daysOld.toString();
	if (!ensureKey(str)) throw new Error(`No weight data for ${daysOld} days old`);

	if (gender === 'male') return boysWeight[str];

	return girlsWeight[str];
}

export function calcLbs(lbs: string, oz: string | null | undefined): number {
	return Number(lbs) + Number(oz ?? 0) / 16;
}
