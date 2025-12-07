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
    async openLoginModal() {
        const metrics = await this.page.evaluate(async () => {
            const [entry] = performance.getEntriesByType('navigation'); 
            if (!entry) return {};
            const timing = entry.toJSON();
            const pageLoadTime = timing.loadEventEnd - timing.startTime;
            const dnsLookupTime = timing.domainLookupEnd - timing.domainLookupStart;
            return { pageLoadTime, dnsLookupTime };
        });

        await this.loginLink.click();

        return metrics;

    }

    async executeLogin(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
   
    async verifySuccessfulLogin(username) {
        await this.page.waitForSelector('#nameofuser', { state: 'visible', timeout: 15000 }); 
        await expect(this.welcomeMessage).toHaveText(`Welcome ${username}`);
    }
}

module.exports = LoginPage;