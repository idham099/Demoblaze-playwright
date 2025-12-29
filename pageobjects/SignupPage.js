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
        await this.signupUsername.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(500);
        const dialogPromise = this.page.waitForEvent('dialog', { timeout: 30000 });
        await this.signupUsername.fill(username, { force: true, timeout: 30000});
        await this.signupPassword.fill(password, { force: true, timeout: 30000});
        await this.signupButton.click();

        this.lastStepScreenshot = await this.page.screenshot({ 
            timeout: 5000 
        }).catch(() => null);
        
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