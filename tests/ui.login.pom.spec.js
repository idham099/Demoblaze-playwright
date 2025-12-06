
const { test } = require('@playwright/test');
const LoginPage = require('../pageobjects/LoginPage');

// Kredensial Pengujian
const USERNAME = 'admin234';
const PASSWORD = 'admin234';

test.describe('DemoBlaze UI Testing: Login Flow with POM', () => {
    
    // Semua fungsi metadata Allure dipanggil sebagai properti dari objek 'test'
    test('Verify successful login using Page Object Model', async ({ page }) => {
        
        const loginPage = new LoginPage(page);
        
        test.info().title = 'SCENARIO 1: Login Sukses ke DemoBlaze';

        test.info().description = `
            ### Tujuan Test
            Test ini memverifikasi bahwa pengguna dapat **Login Sukses** ke aplikasi Demoblaze menggunakan pola Page Object Model (POM).
            
            **Langkah Kritis:**
            * Penanganan Alert Pop-up harus diimplementasikan.
            * Verifikasi pesan 'Welcome [Username]'.
        `;

        test.info().annotations.push({ type: 'tag', description: 'Smoke' });
        test.info().annotations.push({ type: 'tag', description: 'Regression' });

        // --- Metadata Allure (Koreksi Implementasi) ---
        test.info().annotations.push({ type: 'owner', description: 'Ainul idham' });
        test.info().annotations.push({ type: 'epic', description: 'UI - Automation Structure' });
        test.info().annotations.push({ type: 'feature', description: 'Page Object Model Implementation' }); 
                
        test.info().annotations.push({ type: 'story', description: 'User successfully logs in to the application' });
        test.info().annotations.push({ type: 'severity', description: 'critical' }); // Bisa 'blocker', 'critical', 'normal', 'minor', 'trivial'
        // --- Aliran Test Menggunakan Fungsi POM ---
        
        // Gunakan test.step untuk logging yang lebih baik di Allure
        await test.step('1. Navigate to Home Page', async () => {
            const metrics = await loginPage.navigate();
            
            //performance test
            await test.info().attach('Navigation Performance Metrics', { 
                body: `Page Load Time: ${metrics.pageLoadTime} ms\nDNS Lookup Time: ${metrics.dnsLookupTime} ms`, 
                contentType: 'text/plain' 
            });

        });

        await test.step('2. Open Login Modal', async () => {
            await loginPage.clickLoginLink();
        });

        await test.step(`3. Execute Login Action for user: ${USERNAME}`, async () => {
            await loginPage.login(USERNAME, PASSWORD); 
            
            // Penggunaan attachment yang benar:
            await test.info().attach('Post-Login Screenshot', { body: await page.screenshot(), contentType: 'image/png' });
        });

        await test.step('4. Verify Successful Login', async () => {
            await loginPage.verifySuccessfulLogin(USERNAME);
        });
    });
});