// Checks the calculator against the Pricing Update deck figures.
// Run from the project folder with: node tools/pricing-check.js
const { calculateFees } = require("../js/pricing.js");
const expected = {
  20: { eventli: 1.2, eventbrite: 1.98, luma: 1.5, tt: 1.22 },
  50: { eventli: 2.55, eventbrite: 4.07, luma: 3.45, tt: 1.67 },
  100: { eventli: 4.8, eventbrite: 7.54, luma: 6.7, tt: 2.42 },
};
let failed = 0;
for (const price in expected) {
  const rows = calculateFees(Number(price), 1, "standard").rows;
  for (const key in expected[price]) {
    const got = rows.find((r) => r.key === key).total;
    const ok = Math.abs(got - expected[price][key]) < 0.006;
    if (!ok) failed++;
    console.log(`${ok ? "PASS" : "FAIL"} £${price} ${key}: ${got.toFixed(3)} (expected ${expected[price][key]})`);
  }
}
process.exit(failed ? 1 : 0);
