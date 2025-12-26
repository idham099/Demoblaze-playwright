class CartPage {
    constructor(page) {
        this.page = page;
        this.cartLink = page.locator('#cartur');
        this.cartTable = page.locator('#tbodyid');
        this.totalPrice = page.locator('#totalp');
        this.productInCart = (name) => page.locator(`#tbodyid tr:has-text("${name}")`);
        this.cartScreenshot = null;
    }

    async goToCart() {
        await this.page.goto('https://www.demoblaze.com/cart.html', { 
            waitUntil: 'commit', 
            timeout: 10000 
        });

        await this.page.waitForSelector('#tbodyid tr', { state: 'visible', timeout: 5000 })
            .catch(() => console.log("Tabel belum muncul, mungkin cart kosong."));
        
        this.cartScreenshot = await this.page.screenshot({ 
            timeout: 2000, 
            animations: 'disabled' 
        }).catch(() => null);
        
        let metrics = { pageLoadTime: 0, dnsLookupTime: 0 };
        try {
            metrics = await this.page.evaluate(() => {
                const entry = performance.getEntriesByType('navigation')[0];
                return {
                    pageLoadTime: entry ? Math.round(entry.loadEventEnd - entry.startTime) : 0,
                    dnsLookupTime: entry ? Math.round(entry.domainLookupEnd - entry.domainLookupStart) : 0
                };
            });
        } catch (e) {
            console.log("Gagal mengambil metrik karena timeout/browser closed.");
        }

        return metrics;
    }

    async isProductDisplayed(productName) {
        const item = this.productInCart(productName);
        for (let i = 0; i < 2; i++) {
        try {
            // Tunggu baris produk muncul
            await item.waitFor({ state: 'visible', timeout: 5000 });
            return await item.isVisible();
        } catch (e) {
            if (i === 0) {
                console.log(`Produk ${productName} belum muncul, mencoba refresh halaman...`);
                await this.page.reload({ waitUntil: 'domcontentloaded' });
                await this.page.waitForSelector('#tbodyid tr', { state: 'visible', timeout: 5000 }).catch(() => {});
            }
        }
    }
    }
}

module.exports = CartPage;