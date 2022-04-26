export function timeSince(date: Date) {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
	let interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " years";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " months";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " days";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hours";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}

export function range(start: number, stop: number, step: number = 1): number[] {
	return Array.from(
		{ length: (stop - start) / step + 1 },
		(_, i) => start + i * step
	);
}

export function sortAlphabetically<T>(array: T[], field: string) {
	return array.sort((a: any, b: any) => {
		const fieldA = a[field].toLowerCase();
		const fieldB = b[field].toLowerCase();
		return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
	});
}
