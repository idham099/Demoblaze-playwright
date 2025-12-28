const { test, expect } = require('@playwright/test');
const ProductPage = require('../pageobjects/ProductPage');
const XLSX = require('xlsx');
const path = require('path');

function getProductData() {
    const filePath = path.join(__dirname, '../data/product_detail_data.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets["product_detail"];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}
test.describe.configure({ mode: 'serial' });
test.describe('DemoBlaze UI Testing: Product Detail', () => {
    const testData = getProductData();

    for (const data of testData) {
        test(`${data.testCase}: ${data.description}`, async ({ page }) => {
            const productPage = new ProductPage(page);

            await test.step('1. Buka Homepage', async () => {
                await page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'domcontentloaded' });
            });

            await test.step('2. Klik Produk dan Verifikasi Detail', async () => {
                const metrics = await productPage.selectProductFromHome(data.productName);

                const header = productPage.productNameHeader(data.productName);
                await expect(header).toBeVisible();
                await expect(header).toHaveText(data.productName);

                await test.info().attach('Navigation-Performance', {
                    body: `Load Time: ${metrics.pageLoadTime} ms\nDNS: ${metrics.dnsLookupTime} ms`,
                    contentType: 'text/plain'
                });

                await expect(productPage.productPrice).toContainText(data.expectedPrice);
                await expect(productPage.productDescription).toContainText(data.expectedDesc);

                await test.info().attach('Product-Detail-View', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });
            });
        });
    }
});