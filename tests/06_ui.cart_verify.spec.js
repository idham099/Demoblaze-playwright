const { test, expect } = require('@playwright/test');
const ProductPage = require('../pageobjects/ProductPage');
const CartPage = require('../pageobjects/CartPage');
const XLSX = require('xlsx');
test.describe.configure({ mode: 'serial' });
test.describe('DemoBlaze: Cart Verification', () => {
    const workbook = XLSX.readFile('./data/add_to_cart_data.xlsx');
    const testData = XLSX.utils.sheet_to_json(workbook.Sheets["add_to_cart"]);

    for (const data of testData) {
        test(`Verifikasi Keranjang untuk ${data.productName}`, async ({ page }) => {
            const productPage = new ProductPage(page);
            const cartPage = new CartPage(page);

            await test.step('1. Persiapan: Tambah Produk', async () => {
                await page.goto('https://www.demoblaze.com/index.html');
                await productPage.selectProductFromHome(data.productName);
            });

            await test.step('2. Buka Halaman Cart & Cek Performa', async () => {
                const result = await productPage.clickAddToCart();
                expect(result.message).toBe(data.expectedAlert);
                if (result.screenshot) {
                    await test.info().attach('Alert-Screenshot', {
                        body: result.screenshot,
                        contentType: 'image/png'
                    });
                }
                await test.info().attach('Add-to-Cart-Performance', {
                    body: `Interaction Duration: ${result.duration} ms`,
                    contentType: 'text/plain'
                });
            });

            await test.step('3. Validasi Keberadaan Produk', async () => {
                const perf = await cartPage.goToCart();
                await test.info().attach('Metrik Performa Cart', {
                    body: `Halaman dimuat dalam: ${perf.pageLoadTime}ms`,
                    contentType: 'text/plain'
                });


                const isPresent = await cartPage.isProductDisplayed(data.productName);
                if (cartPage.cartScreenshot) {
                    await test.info().attach('Cart-Inventory-Visual', {
                        body: cartPage.cartScreenshot,
                        contentType: 'image/png'
                    });
                }
                expect(isPresent).toBeTruthy();
            });

        });
    }
});