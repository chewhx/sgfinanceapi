import { readFileSync } from 'fs';
import { chromium } from 'playwright';
import papa from 'papaparse';
import { writeFile } from 'jsonfile';
import db from '../data/db.json';
import { nanoid } from 'nanoid';

const STOCK_SCREENER_URL = 'https://investors.sgx.com/stock-screener';

(async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage({
		acceptDownloads: true,
	});

	await page.goto(STOCK_SCREENER_URL, {
		waitUntil: 'load',
	});

	const menuButton = await page.waitForSelector(
		'div.widget-stock-screener-toolbar-button-container > button.sgx-data-model-tool--button',
		{ state: 'visible' }
	);

	await menuButton.click();

	const downloadButton = await page.waitForSelector('a[data-id="download"]');

	const [download] = await Promise.all([
		page.waitForEvent('download'),
		downloadButton.click(),
	]);

	const downloadFilePath = await download.path();

	if (downloadFilePath) {
		const csv = readFileSync(downloadFilePath, 'utf-8').trim();
		const { data } = papa.parse<any>(csv, { header: true });

		// Push to data
		const newData = db
			.filter((e) => e.type !== 'sg-stock')
			.concat(
				data.map((e) => ({
					id: nanoid(5),
					name: e['Trading Name'],
					symbol: e['Code'],
					type: 'sg-stock',
				}))
			);

		await writeFile('./data/db.json', newData);
	}

	await browser.close();
})();
