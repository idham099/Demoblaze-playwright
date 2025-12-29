class ProductPage {
    constructor(page) {
        this.page = page;
        this.productNameHeader = (name) => page.locator(`//h2[normalize-space()="${name}"]`);
        this.productPrice = page.locator('//h3[@class="price-container"]');
        this.productDescription = page.locator('//div[@id="more-information"]//p');
        this.addToCartBtn = page.locator('//a[normalize-space()="Add to cart"]');
        this.alertScreenshot = null;
    }

    async selectProductFromHome(productName) {
        await this.page.locator(`//a[normalize-space()="${productName}"]`).click();
        const header = this.productNameHeader(productName);
        await header.waitFor({ state: 'visible' });
        const metrics = await this.page.evaluate(() => {
            const [entry] = performance.getEntriesByType('navigation');
            return {
                pageLoadTime: entry ? Math.round(entry.loadEventEnd - entry.startTime) : 0,
                dnsLookupTime: entry ? Math.round(entry.domainLookupEnd - entry.domainLookupStart) : 0
            };
        });

        return metrics;
    }

    async clickAddToCart() {
        const startTime = performance.now();
        const dialogPromise = this.page.waitForEvent('dialog');
        await this.addToCartBtn.click();
        
        const dialog = await dialogPromise;
        const message = dialog.message();

        await dialog.accept();
        const endTime = performance.now(); 
        const duration = Math.round(endTime - startTime);
        const screenshot = await this.page.screenshot({ animations: 'disabled' }).catch(() => null);
        return { message, screenshot, duration };
    }
}

module.exports = ProductPage;