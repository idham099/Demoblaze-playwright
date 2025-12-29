const { test, expect } = require('@playwright/test');
const SignupPage = require('../pageobjects/SignupPage');
const XLSX = require('xlsx');
const path = require('path');

function getExcelData() {
    const filePath = path.join(__dirname, '../data/signup_data.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = "signup"; 
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet dengan nama "${sheetName}" tidak ditemukan di file Excel!`);
    }
    return XLSX.utils.sheet_to_json(sheet); 
}
test.describe.configure({ mode: 'serial' });
test.describe('DemoBlaze UI Testing: Signup Flow dengan POM dan Excel DDT', () => {
    const testData = getExcelData();
    for (const data of testData) {
        test(`${data.testCase}: ${data.description}`, async ({ page }) => {
            const signupPage = new SignupPage(page);

            const isUniqueValue = String(data.isUnique).trim().toLowerCase() === 'true';
            const finalUsername = isUniqueValue ? `${data.username}${Math.floor(Math.random() * 10000)}`: data.username; 
           
            await test.step('1. Navigasi ke Halaman Utama', async () => {
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
            });

            await test.step(`2. Jalankan Signup: ${finalUsername}`, async () => {
                const metrics = await signupPage.openSignupModal();

                await test.info().attach('Navigation Performance', {
                    body: `Page Load Time: ${metrics.pageLoadTime} ms\nDNS Lookup Time: ${metrics.dnsLookupTime} ms`,
                    contentType: 'text/plain'
                });

                if (metrics.pageLoadTime > 0) {
                    await expect.soft(metrics.pageLoadTime).toBeLessThan(10000); 
                }

                const password = String(data.password || "");
                const message = await signupPage.register(finalUsername, password);

                await test.info().attach('Actual Alert Message', {body: `Pesan yang muncul di browser: "${message}"`, contentType: 'text/plain'});

                expect(message.trim()).toContain(data.expectedMessage.trim());
            });

            await test.step('3. Screenshot Hasil', async () => {
                await test.info().attach(`Result-${data.testCase}`, { body: await page.screenshot(), contentType: 'image/png' });
            });
        });

    }
});
