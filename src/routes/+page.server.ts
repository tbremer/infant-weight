import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { daysBetweenDates } from '../utils/date';
import { ensureGender } from '../utils/assertion';
import { calcLbs, getLMS, lbsToKg } from '../utils/weight';
import { calcZScore, zScoreToPercent } from '../utils/z-scores';

const formKeys = {
	birthDay: 'date-birth',
	weighDay: 'date-weight',
	weight: 'weight',
	type: 'measurement',
	sex: 'sex',
	pounds: 'lbs',
	ounces: 'oz'
} as const;
type FormKeys = keyof typeof formKeys;

export const load: PageServerLoad = ({ cookies }) => {
	const date = new Date();
	const month = date.getMonth() + 1;
	const day = date.getDate() + 1;

	return {
		dob:
			cookies.get('dob') ??
			`${date.getFullYear() - 1}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`,
		sex: cookies.get('sex'),
		today: `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const formData = Array.from(Object.entries(formKeys)).reduce(
			(acc, [key, value]) => ({
				...acc,
				[key]: data.get(value)
			}),
			{} as Record<FormKeys, string>
		);

		const weight =
			formData.type === 'kg'
				? Number(formData.weight)
				: lbsToKg(calcLbs(formData.pounds, formData.ounces));
		const daysOld = daysBetweenDates(new Date(formData.birthDay), new Date(formData.weighDay));
		const LMSData = getLMS(daysOld, ensureGender(formData.sex));
		const zScore = calcZScore(weight, LMSData);

		cookies.set('dob', formData.birthDay, { path: '/' });
		cookies.set('sex', formData.sex, { path: '/' });

		return {
			daysOld,
			sex: formData.sex,
			weightType: formData.type,
			kg: weight,
			lb: formData.pounds,
			oz: formData.ounces,
			zScore,
			percent: zScoreToPercent(zScore)
		};
	}
};
