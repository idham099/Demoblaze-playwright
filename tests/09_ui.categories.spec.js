const { test, expect } = require('@playwright/test');
const CategoryPage = require('../pageobjects/CategoryPage');
const XLSX = require('xlsx');
const path = require('path');

function getCategoryData() {
    const filePath = path.join(__dirname, '../data/categories_data.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets["categories"];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}
test.describe.configure({ mode: 'serial' });
test.describe('DemoBlaze UI Testing: Category Navigation', () => {
    const testData = getCategoryData();

    for (const data of testData) {
        test(`${data.testCase}: ${data.description}`, async ({ page }) => {
            const categoryPage = new CategoryPage(page);

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
                
            await test.step(`2. Pilih Kategori ${data.categoryName}`, async () => {
                const metrics = await categoryPage.selectCategory(data.categoryName, data.expectedFirstItem);

                await test.info().attach('Category-Load-Performance', {
                    body: `Time to load ${data.categoryName}: ${metrics.pageLoadTime} ms`,
                    contentType: 'text/plain'
                });

                const actualName = await categoryPage.productItem(data.expectedFirstItem)
                    .filter({ visible: true }) 
                    .first()                   
                    .innerText();
                console.log(actualName);
                expect(actualName).toBe(data.expectedFirstItem);

                await test.info().attach(`Result-${data.categoryName}`, {
                    body: await page.screenshot({ fullPage: false }), 
                    contentType: 'image/png'
                });
            });
        });
    }
});