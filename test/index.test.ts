import { findBySymbol } from '../dist';

const testConditions = [['D05', 'DBS']];

testConditions.forEach(([num, ans]) => {
	test(`Fibonnaci number at position ${num}`, () => {
		expect(findBySymbol(num).name).toBe(ans);
	});
});
