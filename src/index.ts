import { readFileSync } from 'fs';

export function findBySymbol(symbol: string) {
	const data = JSON.parse(readFileSync('../data/db.json', 'utf-8'));
	const item = data.find((e: any) => e.symbol === symbol);

	if (!item) {
		return null;
	}

	return item;
}

export function findByName(name: string) {
	const data = JSON.parse(readFileSync('../data/db.json', 'utf-8'));
	const item = data.find((e: any) => e.name.includes(name));

	if (!item) {
		return null;
	}

	return item;
}
