const { expect } = require('@playwright/test');

class SignupPage{
    constructor(page){
        this.page = page;

        //--locator object 
        this.signupLink = page.locator('#signin2');
        this.signupUsername = page.locator('#sign-username');
        this.signupPassword = page.locator('#sign-password');
        this.signupButton = page.locator('button[onclick="register()"]');
    }

    async openSignupModal() {
    const metrics = await this.page.evaluate(() => {
        const [entry] = performance.getEntriesByType('navigation');
        if (!entry) return { pageLoadTime: 0, dnsLookupTime: 0 };
        return {
            pageLoadTime: Math.round(entry.loadEventEnd - entry.startTime),
            dnsLookupTime: Math.round(entry.domainLookupEnd - entry.domainLookupStart)
        };
    });
    await this.signupLink.click({ force: true });
    return metrics;
    }

    //Daftar test case
    //TC_L004
    async register(username, password){
        await this.signupUsername.waitFor({ state: 'visible' });
        const dialogPromise = this.page.waitForEvent('dialog', { timeout: 10000 });
        await this.signupUsername.fill(username);
        await this.signupPassword.fill(password);
        await this.signupButton.click();

        this.lastStepScreenshot = await this.page.screenshot();
        
        try{
            const dialog = await dialogPromise;
            const message = dialog.message();
            await dialog.accept();
            return message;
        } catch (e) {
            console.error("Dialog signup tidak muncul:", e);
            return "No Dialog Appeared";
        }
    }

    
}
module.exports = SignupPage;