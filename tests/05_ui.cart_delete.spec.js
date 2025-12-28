const { test, expect } = require('@playwright/test');
const ProductPage = require('../pageobjects/ProductPage');
const CartPage = require('../pageobjects/CartPage');
const XLSX = require('xlsx');
const path = require('path');


function readDataFromExcel() {
    try {
        const filePath = path.join(__dirname, `../data/add_to_cart_data.xlsx`);
        const workbook = XLSX.readFile(filePath);
        const sheetName = "add_to_cart";
        
        if (!workbook.SheetNames.includes(sheetName)) {
            throw new Error(`Sheet "${sheetName}" tidak ditemukan!`);
        }

        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet, { defval: "" });
    } catch (error) {
        console.error("Gagal membaca Excel:", error.message);
        return [];
    }
}

test.describe.configure({ mode: 'serial' });
test.describe('DemoBlaze: Delete Product', () => {
    const testData = readDataFromExcel();

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.demoblaze.com/index.html');
        await page.evaluate(() => window.localStorage.clear());
        await page.evaluate(() => window.sessionStorage.clear());
        await page.reload(); 
    });

    for (const data of testData) {
        test(`Hapus ${data.productName} dari Keranjang`, async ({ page }) => {
            const productPage = new ProductPage(page);
            const cartPage = new CartPage(page);

            await test.step('1. Tambahkan Produk ke Cart', async () => {
                await page.goto('https://www.demoblaze.com/index.html');
                await page.locator(`a.hrefch:has-text("${data.productName}")`).click();
                
                const result = await productPage.clickAddToCart();
                expect(result.message).toBe(data.expectedAlert);
                
                await test.info().attach(`Perf-Add-To-Cart`, {
                    body: `Interaction Duration: ${result.duration} ms`,
                    contentType: 'text/plain'
                });
            });

            await test.step('2. Buka Halaman Cart & Cek Performa', async () => {
                const perf = await cartPage.goToCart();
                await test.info().attach(`Perf-Page-Load`, {
                    body: `Page Load Time: ${perf.pageLoadTime} ms\nDNS Lookup: ${perf.dnsLookupTime} ms`,
                    contentType: 'text/plain'
                });

                if (cartPage.cartScreenshot) {
                    await test.info().attach('Cart-Before-Delete', {
                        body: cartPage.cartScreenshot,
                        contentType: 'image/png'
                    });
                }
            });

            await test.step('3. Hapus Produk dan Verifikasi', async () => {
                const isPresentBefore = await cartPage.isProductDisplayed(data.productName);
                expect(isPresentBefore).toBeTruthy();

                const deleteResult = await cartPage.deleteProduct(data.productName);

                await test.info().attach(`Perf-Delete-Action-${data.productName}`, {
                    body: `Delete Interaction Duration: ${deleteResult.duration} ms`,
                    contentType: 'text/plain'
                });

                const ssAfter = await page.screenshot({ 
                    animations: 'disabled',
                    timeout: 3000 
                }).catch(() => null);

                if (ssAfter) {
                    await test.info().attach('Cart-After-Delete', {
                        body: ssAfter,
                        contentType: 'image/png'
                    });
                }

                const productLocator = page.locator(`tr:has-text("${data.productName}")`);
                await expect(productLocator).toBeHidden({ timeout: 5000 });
            });
        });
    }
});