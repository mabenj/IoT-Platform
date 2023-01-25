const FORMATTER = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto"
});

const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" }
];

export function timeAgo(date: Date) {
    if (!date) {
        return undefined;
    }
    let duration = (date.getTime() - new Date().getTime()) / 1000;

    for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i];
        if (Math.abs(duration) < division.amount) {
            return FORMATTER.format(
                Math.round(duration),
                division.name as Intl.RelativeTimeFormatUnit
            );
        }
        duration /= division.amount;
    }
}

export function range(start: number, stop: number, step: number = 1): number[] {
    return Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
    );
}

export function caseInsensitiveSorter<T>(key: keyof T): (a: T, b: T) => number {
    return (a, b) => {
        const x = a[key] as string;
        const y = b[key] as string;
        return x.localeCompare(y, undefined, { numeric: true });
    };
}

export function generateHexColor(input: string): string {
    if (!input) {
        return "#000000";
    }
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (var i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
}
