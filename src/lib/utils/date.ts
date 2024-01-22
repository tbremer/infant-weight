const MS_IN_DAYS = 86_400_000; // 1000 * 60 * 60 * 24
export const MS_IN_MONTH = 2_592_000_000; // 1000 * 60 * 60 * 24 * 30

export function daysBetweenDates(date1: Date, date2: Date): number {
	const diff = Math.abs(date1.getTime() - date2.getTime());
	return Math.ceil(diff / MS_IN_DAYS);
}

export function monthsBetweenDates(date1: Date, date2: Date): number {
	const diff = Math.abs(date1.getTime() - date2.getTime());

	return Math.floor(diff / MS_IN_MONTH);
}
