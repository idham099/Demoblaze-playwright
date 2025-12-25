class ContactPage {
    constructor(page) {
        this.page = page;
        this.contactLink = page.locator('//a[normalize-space()="Contact"]');
        this.emailInput = page.locator('#recipient-email');
        this.nameInput = page.locator('#recipient-name');
        this.messageInput = page.locator('#message-text');
        this.sendButton = page.locator('button[onclick="send()"]');
    }

    async openContactModal() {
        const metrics = await this.page.evaluate(() => {
            const [entry] = performance.getEntriesByType('navigation');
            if (!entry) return { pageLoadTime: 0, dnsLookupTime: 0 };
            return {
                pageLoadTime: Math.round(entry.loadEventEnd - entry.startTime),
                dnsLookupTime: Math.round(entry.domainLookupEnd - entry.domainLookupStart)
            };
        });

        await this.contactLink.click();
        await this.emailInput.waitFor({ state: 'visible' });
        
        return metrics;
    }

    async sendMessage(email, name, message) {
        let alertMessage = "";

        const dialogHandler = async (dialog) => {
        alertMessage = dialog.message();
        console.log(`Dialog muncul: ${alertMessage}`);
        await dialog.accept().catch(() => {});
        };

        this.page.on('dialog', dialogHandler);

        await this.emailInput.fill(email || "");
        await this.nameInput.fill(name || "");
        await this.messageInput.fill(message || "");

        this.preClickScreenshot = await this.page.screenshot();

        await this.sendButton.click();

        await this.page.waitForTimeout(2000);

        this.page.removeListener('dialog', dialogHandler);

        return alertMessage;
        }
}

module.exports = ContactPage;