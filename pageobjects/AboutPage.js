class AboutPage {
    constructor(page) {
        this.page = page;
        this.aboutLink = page.locator('//a[normalize-space()="About us"]');
        this.modalTitle = page.locator('#videoModalLabel');
        this.videoElement = page.locator('.vjs-poster');
        this.closeButton = page.locator('//div[@id="videoModal"]//button[@type="button"][normalize-space()="Close"]');
    }

    async openAboutModal() {
        const metrics = await this.page.evaluate(() => {
            const [entry] = performance.getEntriesByType('navigation');
            if (!entry) return { pageLoadTime: 0, dnsLookupTime: 0 };
            return {
                pageLoadTime: Math.round(entry.loadEventEnd - entry.startTime),
                dnsLookupTime: Math.round(entry.domainLookupEnd - entry.domainLookupStart)
            };
        });

        await this.aboutLink.click();
        await this.modalTitle.waitFor({ state: 'visible' });
        
        return metrics;
    }

    async isVideoVisible() {
        return await this.videoElement.isVisible();
    }

    async playVideo() {
    await this.page.locator('.vjs-big-play-button').click();
    }

    async closeModal() {
        await this.closeButton.click();
        await this.modalTitle.waitFor({ state: 'hidden' });
    }
}

module.exports = AboutPage;