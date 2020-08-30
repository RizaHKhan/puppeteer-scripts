const puppeteer = require("puppeteer");
(async => {
  const page = await browser.newPage();

  await page.goto("https://example.com");

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
    };
  });

  console.log("Dimenions", dimensions);

  await browser.close();
})();