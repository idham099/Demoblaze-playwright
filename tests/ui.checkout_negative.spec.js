const { test, expect } = require('@playwright/test');
const ProductPage = require('../pageobjects/ProductPage');
const CartPage = require('../pageobjects/CartPage');
const XLSX = require('xlsx');
const path = require('path');

function readDataFromExcel(sheetName) {
    try {
        const filePath = path.join(__dirname, `../data/add_to_cart_data.xlsx`);
        const workbook = XLSX.readFile(filePath);
        if (!workbook.SheetNames.includes(sheetName)) {
            throw new Error(`Sheet "${sheetName}" tidak ditemukan di file Excel!`);
        }
        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet, { defval: "" });
    } catch (error) {
        console.error("Gagal membaca Excel:", error.message);
        return [];
    }
}

test.describe('DemoBlaze UI Testing: Negative Checkout Flow', () => {
    const negativeTestData = readDataFromExcel('checkout_negative');

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.demoblaze.com/index.html');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await page.reload();
    });

    for (const data of negativeTestData) {
        test(`Negatif Checkout - ${data.scenarioName}`, async ({ page }) => {
            const productPage = new ProductPage(page);
            const cartPage = new CartPage(page);

            await test.step('1. Tambahkan Produk ke Cart', async () => {
                await page.locator(`a.hrefch:has-text("${data.productName}")`).click();
                await productPage.clickAddToCart();

                await cartPage.goToCart();
                const isPresent = await cartPage.isProductDisplayed(data.productName);
                expect(isPresent).toBeTruthy();
            });

            await test.step('2. Eksekusi Checkout Negatif & Validasi Alert', async () => {
                await test.info().attach('Form-Condition', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });

                const result = await cartPage.placeOrderNegative(data);
                expect(result.alertMessage).toBe(data.expectedAlert);

                await test.info().attach(`Perf-Negative-Response`, {
                    body: `Scenario: ${data.scenarioName}\nResponse Time: ${result.duration} ms`,
                    contentType: 'text/plain'
                });

                const isModalVisible = await page.isVisible('#orderModal');
                expect(isModalVisible).toBeTruthy();

                await test.info().attach('Final-Negative-Evidence', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });
            });
        });
    }
});