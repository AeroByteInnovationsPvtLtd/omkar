const { chromium } = require('playwright');

(async () => {
    try {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text()));
        page.on('pageerror', (err) => console.log('PAGE ERROR:', err.toString()));

        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

        const html = await page.content();
        console.log('---PAGE HTML START---');
        console.log(html);
        console.log('---PAGE HTML END---');

        await browser.close();
    } catch (err) {
        console.error('Script error:', err);
        process.exit(1);
    }
})();
