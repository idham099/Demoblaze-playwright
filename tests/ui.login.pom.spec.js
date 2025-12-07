
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageobjects/LoginPage');

// Kredensial Pengujian
const USERNAME = 'admin234';
const PASSWORD = 'admin234';

test.describe('DemoBlaze UI Testing: Login Flow with POM', () => {
    test('SCENARIO 1: Login Sukses ke DemoBlaze', async ({ page }) => {
        // --- Setup dan Custom judul ---
        test.info().title = 'SCENARIO 1: Login Sukses ke DemoBlaze';

        const loginPage = new LoginPage(page);
        let metrics;

        // --- Alert Handler (Aktifkan untuk Pop-up yang mungkin muncul setelah klik login) ---
        page.once('dialog', async dialog => {
            console.log(`Alert Pop-up Ditemukan: ${dialog.message()}`);
            await dialog.accept(); 
        });

        // --- Aliran Test Menggunakan Fungsi POM ---
        await test.step('1. Navigasi ke Halaman Beranda dan Tangkap Performa', async () => {
            await page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'load' });
            metrics = await loginPage.openLoginModal();
            
            expect(metrics.pageLoadTime).toBeLessThan(5000);

            //performance test
            await test.info().attach('Navigation Performance Metrics', { 
                body: `Page Load Time: ${metrics.pageLoadTime} ms\nDNS Lookup Time: ${metrics.dnsLookupTime} ms`, 
                contentType: 'text/plain' 
            });

        });

        await test.step(`2. Jalankan Tindakan Login untuk pengguna: ${USERNAME}`, async () => {
            await loginPage.executeLogin(USERNAME, PASSWORD);
            await test.info().attach('Tangkapan Layar Pasca-Login', { body: await page.screenshot(), contentType: 'image/png' });
        });

        await test.step('3. Verify Successful Login', async () => {
            await loginPage.verifySuccessfulLogin(USERNAME);
        });
    });
});