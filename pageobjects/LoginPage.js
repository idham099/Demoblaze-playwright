const { expect } = require('@playwright/test');

class LoginPage {
    
    constructor(page) {
        this.page = page;
        
        // --- Locators (Selektor Elemen) ---
        this.loginLink = page.locator('#login2');
        this.usernameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.loginButton = page.locator('button[onclick="logIn()"]');
        this.welcomeMessage = page.locator('#nameofuser'); // Locator untuk verifikasi sukses
    }

    // --- Actions (Fungsi Halaman) ---

    async navigate() {
        //performance test
        await this.page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'load' });

        const metrics = await this.page.evaluate(() => {
            // Ambil entri navigasi utama
            const [entry] = performance.getEntriesByType('navigation'); 
            
            if (!entry) return {};

            // Konversi entri menjadi objek JSON untuk akses mudah
            const timing = entry.toJSON();
            
            // Hitung metrik yang diinginkan
            const pageLoadTime = timing.loadEventEnd - timing.startTime;
            const dnsLookupTime = timing.domainLookupEnd - timing.domainLookupStart;
            
            // Kembalikan objek metrik
            return { pageLoadTime, dnsLookupTime };
        });

        return metrics;

    }

    async clickLoginLink() {
        await this.loginLink.click();
    }

    async login(username, password) {
        this.page.on('dialog', async dialog => {
            console.log(`Alert Pop-up Ditemukan: ${dialog.message()}`);
            await dialog.accept(); // Secara otomatis menekan tombol OK
        });

        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        
    }
    
    // --- Assertion/Verification (Opsional, tapi membantu) ---
    
    async verifySuccessfulLogin(username) {
        await this.page.waitForSelector('#nameofuser', { state: 'visible', timeout: 15000 }); // Tunggu max 15 detik
        await expect(this.welcomeMessage).toHaveText(`Welcome ${username}`);
    }
}

module.exports = LoginPage;