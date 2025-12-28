const { test, expect } = require('@playwright/test');
const ContactPage = require('../pageobjects/ContactPage');
const XLSX = require('xlsx');
const path = require('path');

function getContactData() {
    const filePath = path.join(__dirname, '../data/contact_data.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets["contact"]; 
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}
test.describe.configure({ mode: 'serial' });
test.describe('DemoBlaze UI Testing: Contact Flow (Excel DDT)', () => {
    const testData = getContactData();

    for (const data of testData) {
        test(`${data.testCase}: ${data.description}`, async ({ page }) => {
            const contactPage = new ContactPage(page);

            await test.step('1. Navigasi ke Halaman Utama', async () => {
                await page.goto('https://www.demoblaze.com/index.html', { 
                    waitUntil: 'networkidle', 
                    timeout: 60000 
                });
            });

            await test.step('2. Kirim Pesan Contact', async () => {
                const metrics = await contactPage.openContactModal();

                const actualAlert = await contactPage.sendMessage(
                    data.contactName,
                    data.contactEmail,  
                    data.message
                );

                await test.info().attach('Performance Metrics', {
                body: `Page Load Time: ${metrics.pageLoadTime} ms\nDNS Lookup Time: ${metrics.dnsLookupTime} ms`,
                contentType: 'text/plain'
                });

                await test.info().attach('Screenshot Data Input', {
                body: contactPage.preClickScreenshot,
                contentType: 'image/png'
                });

                await test.info().attach('Alert-Message', {
                    body: `Pesan Alert: ${actualAlert}`,
                    contentType: 'text/plain'
                });

                expect(actualAlert).toBe(data.expectedMessage);
            });

            await test.step('3. Verifikasi Modal Tertutup', async () => {
                await expect(page.locator('#exampleModal')).not.toBeVisible();
            });
        });
    }
});