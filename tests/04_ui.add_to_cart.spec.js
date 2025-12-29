const { test, expect } = require('@playwright/test');
const ProductPage = require('../pageobjects/ProductPage');
const XLSX = require('xlsx');
const path = require('path');
test.describe.configure({ mode: 'serial' });
test.describe('DemoBlaze UI Testing: Add to Cart Flow', () => {
    const filePath = path.join(__dirname, '../data/add_to_cart_data.xlsx');
    const workbook = XLSX.readFile(filePath);
    const testData = XLSX.utils.sheet_to_json(workbook.Sheets["add_to_cart"]);

    for (const data of testData) {
        test(`${data.testCase}: Flow Tambah ${data.productName}`, async ({ page }) => {
            const productPage = new ProductPage(page);

            await test.step('1. Pilih Produk', async () => {
                await page.route('**/*.{png,jpg,jpeg,gif,webp}', route => route.abort());
                await expect(async () => {
                    const response = await page.goto('https://www.demoblaze.com/index.html', { 
                        waitUntil: 'commit', 
                        timeout: 15000       
                    });
                    if (!response || response.status() !== 200) {
                        throw new Error(`Gagal memuat halaman, Status: ${response?.status()}`);
                        }
                    }).toPass({
                        intervals: [2000, 5000], 
                        timeout: 90000
                    });
                await page.locator('#nava').waitFor({ state: 'visible', timeout: 15000 });
               
                const metrics = await productPage.selectProductFromHome(data.productName);
                await test.info().attach('Product-Page-Performance', {
                    body: `Load Time: ${metrics.pageLoadTime} ms\nDNS: ${metrics.dnsLookupTime} ms`,
                    contentType: 'text/plain'
                });
            });

            await test.step('2. Add to Cart & Cek Alert', async () => {
                const result = await productPage.clickAddToCart();
                expect(result.message).toBe(data.expectedAlert);
                const savedAlertScreenshot = result.screenshot;

                if (savedAlertScreenshot) {
                    await test.info().attach('Alert-Screenshot', {
                        body: savedAlertScreenshot,
                        contentType: 'image/png'
                    });
                }
                
                await test.info().attach('State-Before-Alert', {
                    body: productPage.preClickScreenshot,
                    contentType: 'image/png'
                });

                await test.info().attach('Performance-Metrics', {
                    body: `Action Duration: ${result.duration} ms`,
                    contentType: 'text/plain'
                });
            });

        });
    }
});