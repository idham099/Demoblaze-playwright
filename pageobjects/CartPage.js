const { expect } = require('@playwright/test');
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
        await this.page.route('**/*.{png,jpg,jpeg,gif,webp}', route => route.abort());
            await expect(async () => {
                const response = await this.page.goto('https://www.demoblaze.com/cart.html', { 
                    waitUntil: 'commit', 
                    timeout: 15000       
                });
                if (!response || response.status() !== 200) {
                    throw new Error(`Gagal memuat halaman, Status: ${response?.status()}`);
                    }
                }).toPass({
                    intervals: [2000, 5000], 
                    timeout: 90000
                });
        await this.page.locator('#nava').waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForSelector('#tbodyid tr', { state: 'visible', timeout: 10000 })
            .catch(() => console.log("Tabel belum muncul, mungkin cart kosong."));
        
        this.cartScreenshot = await this.page.screenshot({ 
            timeout: 5000, 
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
                await item.waitFor({ state: 'visible', timeout: 10000 });
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

    async deleteProduct(productName) {
        const row = this.page.locator('tr', { hasText: productName });
        const deleteBtn = row.locator('text=Delete');
        
        if (await row.count() > 0) {
            const startTime = Date.now();
            await deleteBtn.click();
            await row.waitFor({ state: 'hidden', timeout: 5000 });
            const duration = Date.now() - startTime;
            console.log(`Produk ${productName} berhasil dihapus dalam ${duration} ms.`);
            return { duration };
        } else {
            console.log(`Produk ${productName} sudah tidak ada di keranjang, melewati proses delete.`);
            return { duration: 0 };
        }
    }

    async placeOrder(customerData) {
        await this.page.click('button:has-text("Place Order")');
        await this.page.waitForSelector('#orderModal', { state: 'visible' });
        await this.page.fill('#name', String(customerData.name || "Default Name"));
        await this.page.fill('#country', String(customerData.country || "Indonesia"));
        await this.page.fill('#city', String(customerData.city || "Jakarta"));
        await this.page.fill('#card', String(customerData.card || "123456789"));
        await this.page.fill('#month', String(customerData.month || "12"));
        await this.page.fill('#year', String(customerData.year || "2025"));

        const startTime = Date.now();
        await this.page.click('button:has-text("Purchase")');
        
        const successMsgLocator = this.page.locator('h2:has-text("Thank you for your purchase!")');
        await successMsgLocator.waitFor({ state: 'visible', timeout: 5000 });
        
        const duration = Date.now() - startTime;
        const confirmationText = await successMsgLocator.innerText();

        return {
            message: confirmationText,
            duration: duration
        };
    }

    async placeOrderNegative(data) {
        const placeOrderBtn = this.page.locator('button:has-text("Place Order")');
        await placeOrderBtn.waitFor({ state: 'visible' });
        await placeOrderBtn.click();

        await this.page.waitForSelector('#orderModal', { state: 'visible' });

        await this.page.fill('#name', String(data.name || ""));
        await this.page.fill('#country', String(data.country || ""));
        await this.page.fill('#city', String(data.city || ""));
        await this.page.fill('#card', String(data.card || ""));
        await this.page.fill('#month', String(data.month || ""));
        await this.page.fill('#year', String(data.year || ""));

        let alertMessage = "";
        this.page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.dismiss();
        });

        const startTime = Date.now();
        await this.page.click('button:has-text("Purchase")');
        
        await this.page.waitForTimeout(1000); 
        const duration = Date.now() - startTime;

        return {
            alertMessage: alertMessage,
            duration: duration
        };
    }
}

module.exports = CartPage;