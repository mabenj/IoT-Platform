import { faker } from "@faker-js/faker";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDateString(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    const seconds = `${date.getSeconds()}`.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
}

export function generateRandomWaterData(count: number) {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push({
            temperature: randomFloat(14, 24),
            depth: randomFloat(1, 200),
            units: "metric",
            pollution: randomInt(0, 100),
            timestamp: faker.date.recent(i)
        });
    }
    return result;
}

export function generateRandomWeatherData(count: number) {
    const results = [];
    for (let i = 0; i < count; i++) {
        results.push({
            temperature: randomFloat(-15, 35),
            humidity: randomInt(20, 90),
            wind: randomInt(0, 20),
            rain_amount: randomFloat(0, 20),
            air_pressure: randomFloat(1000, 1030),
            timestamp: faker.date.recent(i)
        });
    }
    return results;
}

export function generateRandomCarData(count: number) {
    const results = [];
    for (let i = 0; i < count; i++) {
        results.push({
            fuel_type: faker.vehicle.fuel(),
            manufacturer: faker.vehicle.manufacturer(),
            color: faker.vehicle.color(),
            model: faker.vehicle.model(),
            vin: faker.vehicle.vin,
            registeration_number: faker.vehicle.vrm,
            timestamp: faker.date.recent(i)
        });
    }
    return results;
}

export function generateRandomData(count: number) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const currentRow: any = {};
        for (let j = 0; j < 12; j++) {
            currentRow[faker.word.interjection()] = faker.company.bs();
        }
        results.push(currentRow);
    }
    return results;
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloat(min: number, max: number, decimals: number = 2) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}
