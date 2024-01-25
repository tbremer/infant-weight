import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { MS_IN_MONTH, monthsBetweenDates, daysBetweenDates } from '$lib/utils/date';
import { ensureGender } from '$lib/utils/assertion';
import { calcLbs, getLMS, lbsToKg } from '$lib/utils/weight';
import { calcZScore, zScoreToPercent } from '$lib/utils/z-scores';

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

export const load: PageServerLoad = ({ cookies, url }) => {
	const date = new Date();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const debug = url.searchParams.has('debug');

	return {
		debug,
		dob: cookies.get('dob'),
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
		const monthsOld = monthsBetweenDates(new Date(formData.birthDay), new Date(formData.weighDay));
		const daysOld = daysBetweenDates(new Date(formData.birthDay), new Date(formData.weighDay));
		const LMSData = getLMS(daysOld, ensureGender(formData.sex));
		const zScore = calcZScore(weight, LMSData);

		cookies.set('dob', formData.birthDay, getCookieOptions());
		cookies.set('sex', formData.sex, getCookieOptions());

		// const percent = (zScoreToPercent(zScore, true) * 100).toFixed(2);
		const percent = (zScoreToPercent(zScore)).toFixed(2);

		return {
			monthsOld,
			daysOld,
			sex: formData.sex,
			weightType: formData.type,
			kg: weight,
			lb: formData.pounds,
			oz: formData.ounces,
			zScore,
			percent,
			percentRaw: zScoreToPercent(zScore, true) * 100
		};
	}
};

function getCookieOptions(): { path: string; expires: Date } {
	const path = '/';
	const expires = new Date(Date.now() + MS_IN_MONTH);
	return { path, expires };
}
