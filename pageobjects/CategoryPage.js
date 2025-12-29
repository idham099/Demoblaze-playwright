class CategoryPage {
    constructor(page) {
        this.page = page;
        this.categoryMenu = (name) => page.locator('.list-group-item', { hasText: name });
        this.productItem = (name) => page.locator(`//a[normalize-space()="${name}"]`);
    }

    async selectCategory(categoryName, expectedProductName) {
        await this.page.waitForSelector('.list-group-item');

        const startTime = await this.page.evaluate(() => performance.now());

        const menu = this.categoryMenu(categoryName);
        await menu.waitFor({ state: 'visible' }); 
        await menu.click();
        
        const item = this.productItem(expectedProductName).first();
        await item.waitFor({ state: 'visible', timeout: 20000 });

        const endTime = await this.page.evaluate(() => performance.now());
        const ajaxLoadTime = Math.round(endTime - startTime);
        
        await this.page.waitForTimeout(1500);
        
        return { pageLoadTime: ajaxLoadTime };
    }

}

module.exports = CategoryPage;