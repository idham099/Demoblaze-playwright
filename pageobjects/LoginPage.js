const { expect } = require('@playwright/test');

class LoginPage {
    
    constructor(page) {
        this.page = page;
        
        // --- Locators (Selektor Elemen) ---
        this.loginLink = page.locator('#login2');
        this.usernameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.loginButton = page.locator('button[onclick="logIn()"]');
        this.logoutLink = page.locator('#logout2');
        this.welcomeMessage = page.locator('#nameofuser'); // Locator untuk verifikasi sukses
    }

    // --- Performance Test---
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


    //Daftar UI Test Case    
    //TC_L001
    async loginSuccessfully(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    }
    async verifySuccessfulLogin(username) {
        await this.page.waitForSelector('#nameofuser', { state: 'visible', timeout: 15000 }); 
        await expect(this.welcomeMessage).toHaveText(`Welcome ${username}`);
    }
   

    //TC_L002
    async loginAndVerifyFailure(username, password) {
        await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
        const dialogPromise = this.page.waitForEvent('dialog', { timeout: 30000 }); 
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        try {
            const dialog = await dialogPromise;
            const message = dialog.message();
            console.log(`Alert Pop-up Ditemukan: ${message}`);
            await dialog.accept();
            return message; 
        } catch (e) {
            throw new Error("Login failed, but no expected error dialog appeared within the timeout.");
            }
    }

    
    //TC_L003
    async clickLogout() {
    await this.logoutLink.click();
    }
    async verifySuccessfulLogout() {
    await expect(this.welcomeMessage).toBeHidden(); 
    await expect(this.loginLink).toBeVisible(); 
    }


}
module.exports = LoginPage;