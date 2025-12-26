const { test, expect } = require('@playwright/test');
const ProductPage = require('../pageobjects/ProductPage');
const CartPage = require('../pageobjects/CartPage');
const XLSX = require('xlsx');
const path = require('path');

function readDataFromExcel() {
    try {
        const filePath = path.join(__dirname, `../data/add_to_cart_data.xlsx`);
        const workbook = XLSX.readFile(filePath);
        const sheetName = "purchase";
        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet, { defval: "" });
    } catch (error) {
        console.error("Gagal membaca Excel:", error.message);
        return [];
    }
}

test.describe('DemoBlaze: Checkout Flow', () => {
    const testData = readDataFromExcel();

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.demoblaze.com/index.html');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await page.reload();
    });

    for (const data of testData) {
        test(`Checkout ${data.productName} dari Keranjang`, async ({ page }) => {
            const productPage = new ProductPage(page);
            const cartPage = new CartPage(page);

            await test.step('1. Tambahkan Produk ke Cart', async () => {
                await page.locator(`a.hrefch:has-text("${data.productName}")`).click();
                const result = await productPage.clickAddToCart();
                expect(result.message).toBe(data.expectedAlert);
            });

            await test.step('2. Buka Halaman Cart', async () => {
                await cartPage.goToCart();
                const isPresent = await cartPage.isProductDisplayed(data.productName);
                expect(isPresent).toBeTruthy();
            });

            await test.step('3. Proses Place Order & Performa', async () => {
                // Fungsi ini mengambil data (name, card, dll) dari kolom Excel
                const checkoutResult = await cartPage.placeOrder(data);

                expect(checkoutResult.message).toContain('Thank you for your purchase!');

                // Lampirkan metrik performa checkout
                await test.info().attach(`Perf-Checkout-${data.productName}`, {
                    body: `Transaction Time: ${checkoutResult.duration} ms`,
                    contentType: 'text/plain'
                });

                // Screenshot bukti konfirmasi
                await test.info().attach('Confirmation-Receipt', {
                    body: await page.screenshot({ fullPage: true }),
                    contentType: 'image/png'
                });

                await page.click('button:has-text("OK")');
            });
        });
    }
});