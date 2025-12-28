const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageobjects/LoginPage');
test.describe.configure({ mode: 'serial' });

test.describe('DemoBlaze UI Testing: Login Flow with POM', () => {
    //TC_L001
    test('TC_L001 [Positive]: Login Sukses dengan kredensial yang valid.', async ({ page }) => {
            // Kredensial Pengujian
            const USERNAME = 'admin234';
            const PASSWORD = 'admin234';
            const loginPage = new LoginPage(page);
            let metrics;
            page.once('dialog', async dialog => {
                console.log(`Alert Pop-up Ditemukan: ${dialog.message()}`);
                await dialog.accept(); 
            });
            await test.step('1. Navigasi ke Halaman Beranda dan Tangkap Performa', async () => {
                await page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'load' });
                metrics = await loginPage.openLoginModal();
                expect(metrics.pageLoadTime).toBeLessThan(5000);
                await test.info().attach('Navigation Performance Metrics', { 
                    body: `Page Load Time: ${metrics.pageLoadTime} ms\nDNS Lookup Time: ${metrics.dnsLookupTime} ms`, 
                    contentType: 'text/plain' 
                });
            });
            await test.step(`2. Jalankan Tindakan Login untuk pengguna: ${USERNAME}`, async () => {
                await loginPage.loginSuccessfully(USERNAME, PASSWORD);
            });
            await test.step('3. Verify Successful Login', async () => {
                await loginPage.verifySuccessfulLogin(USERNAME);
                await test.info().attach('Tangkapan Layar Pasca-Login', { body: await page.screenshot(), contentType: 'image/png' });
            });
        });


    //TC_L002
    test('TC_L002 [Negative]: Login Gagal dengan password salah.', async ({ page }) => {
        const USERNAME1 = 'admin234';
        const PASSWORD1 = 'admin235'; // password salah 
        const loginPage = new LoginPage(page);
        let metrics;
        await test.step('1. Navigasi ke Halaman Beranda dan Tangkap Performa', async () => {
            await page.goto('https://www.demoblaze.com/index.html', { 
                waitUntil: 'networkidle', 
                timeout: 60000 // Beri waktu 60 detik (default hanya 30s)
            });
            metrics = await loginPage.openLoginModal();
            expect(metrics.pageLoadTime).toBeLessThan(5000);
            await test.info().attach('Navigation Performance Metrics', { 
                body: `Page Load Time: ${metrics.pageLoadTime} ms\nDNS Lookup Time: ${metrics.dnsLookupTime} ms`, 
                contentType: 'text/plain' 
            });
        });
        await test.step(`2. Jalankan Tindakan Login untuk pengguna: ${USERNAME1}`, async () => {
            const actualMessage = await loginPage.loginAndVerifyFailure(USERNAME1, PASSWORD1);
            expect(actualMessage).toBe('Wrong password.');
            if (actualMessage.screenshot) {
                await test.info().attach('Tangkapan Layar Pasca-Login', { body: await page.screenshot(), contentType: 'image/png' });
            }
            await expect(loginPage.welcomeMessage).toBeHidden();
        });
    });



    //TC_L003
    test('TC_L003 [Negative]: Logout Sukses.', async ({ page }) => {
            const USERNAME2 = 'admin234';
            const PASSWORD2 = 'admin234';
            const loginPage = new LoginPage(page);
            let metrics;
            page.once('dialog', async dialog => {
                console.log(`Alert Pop-up Ditemukan: ${dialog.message()}`);
                await dialog.accept(); 
            });
            await test.step('1. Navigasi ke Halaman Beranda dan Tangkap Performa', async () => {
                await page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'load' });
                metrics = await loginPage.openLoginModal();
                expect(metrics.pageLoadTime).toBeLessThan(5000);
                await test.info().attach('Navigation Performance Metrics', { 
                    body: `Page Load Time: ${metrics.pageLoadTime} ms\nDNS Lookup Time: ${metrics.dnsLookupTime} ms`, 
                    contentType: 'text/plain' 
                });
            });
            await test.step(`2. Jalankan Tindakan Login untuk pengguna: ${USERNAME2}`, async () => {
                await loginPage.loginSuccessfully(USERNAME2, PASSWORD2);
                await loginPage.verifySuccessfulLogin(USERNAME2);
            });
            await test.step('3. Lakukan Logout', async () => {
                 await loginPage.clickLogout(); 
             });
            await test.step('4. Verifikasi Logout Sukses', async () => {
                await loginPage.verifySuccessfulLogout(); 
                await test.info().attach('Tangkapan Layar Pasca-Logout', { body: await page.screenshot(), contentType: 'image/png' });
            });

        });
});