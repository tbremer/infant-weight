import boysWeight from '../utils/weight/boys.json';
import girlsWeight from '../utils/weight/girls.json';
import zScores from '../utils/z-scores.json';

export function ensureKey(str: string): str is keyof typeof boysWeight | keyof typeof girlsWeight {
	return Boolean(str in boysWeight || str in girlsWeight);
}

export function ensureGender(g: string): 'male' | 'female' {
	if (g === 'male') return 'male';
	if (g === 'female') return 'female';

	throw new Error(`Unknown assigned gender at birth: \`${g}\``);
}

export function ensureZScore(z: string): z is keyof typeof zScores {
	return Boolean(z in zScores);
}
