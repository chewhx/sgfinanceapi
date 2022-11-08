import { readFileSync } from 'fs';
import { chromium } from 'playwright';
import papa from 'papaparse';
import { writeFile } from 'jsonfile';
import db from '../data/db.json';
import { nanoid } from 'nanoid';

const RETAIL_BONDS_SCREENER =
	'https://www.sgx.com/fixed-income/retail-fixed-income-securities';

(async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage({
		acceptDownloads: true,
	});

	await page.goto(RETAIL_BONDS_SCREENER, {
		waitUntil: 'networkidle',
	});

	await page.$eval(
		'[data-action="download"]',
		(el) => (el.style.display = 'block')
	);

	const downloadButton = await page.waitForSelector('[data-action="download"]');

	const [download] = await Promise.all([
		page.waitForEvent('download'),
		downloadButton?.click(),
	]);

	const downloadFilePath = await download.path();

	if (downloadFilePath) {
		const csv = readFileSync(downloadFilePath, 'utf-8').trim();
		const { data } = papa.parse<any>(csv, { header: true });

		// Push to data
		// Push to data
		const newData = db
			.filter((e) => e.type !== 'sg-bond')
			.concat(
				data.map((e) => ({
					id: nanoid(5),
					name: e['Trading Name'],
					symbol: e['Code'],
					type: 'sg-bond',
				}))
			);

		await writeFile('./data/db.json', newData);
	}

	await browser.close();
})();
