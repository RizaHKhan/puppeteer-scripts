"use strict";
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const page = await browser.newPage();
  await page.goto("https://www.tradingview.com/symbols/TVC-NDX/", {
    waitUntil: "networkidle2",
  });

  const fiveYear = await page.evaluateHandle(
    () =>
      document.querySelector("div[data-name='date-ranges-tabs']").childNodes[8]
  );

  await fiveYear.click();
  await page.mouse.move(24, 24);
})();
