const { test, expect } = require('@playwright/test');
const AboutPage = require('../pageobjects/AboutPage');
const XLSX = require('xlsx');
const path = require('path');

function getAboutData() {
    const filePath = path.join(__dirname, '../data/about_us_data.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets["about_us"];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}
test.describe.configure({ mode: 'serial' });
test.describe('DemoBlaze UI Testing: About Us Flow', () => {
    const testData = getAboutData();

    for (const data of testData) {
        test(`${data.testCase}: ${data.description}`, async ({ page }) => {
            const aboutPage = new AboutPage(page);

            await test.step('1. Navigasi ke Halaman Utama', async () => {
                await page.goto('https://www.demoblaze.com/index.html');
            });

            await test.step('2. Buka Modal About Us', async () => {
                const metrics = await aboutPage.openAboutModal();

                await test.info().attach('Performance Metrics', {
                    body: `Page Load Time: ${metrics.pageLoadTime} ms\nDNS Lookup Time: ${metrics.dnsLookupTime} ms`,
                    contentType: 'text/plain'
                });

                const title = await aboutPage.modalTitle.innerText();
                expect(title).toBe(data.expectedTitle);
            });

            await test.step('3. Verifikasi Video dan Screenshot', async () => {
                const isVideoReady = await aboutPage.isVideoVisible();
                expect(isVideoReady).toBeTruthy();

                await test.info().attach('About-Us-Video-View', {
                    body: await page.screenshot(),
                    contentType: 'image/png'
                });

                await aboutPage.closeModal();
            });
        });
    }
});