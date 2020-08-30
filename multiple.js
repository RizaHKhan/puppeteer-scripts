const puppeteer = require("puppeteer");

async function startBrowser(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page.screenshot({ path: url.split(".")[1] + ".png" });
  await browser.close();
}

async function processArray(items) {
  for (const item of items) {
    await startBrowser(item);
  }
}

const sites = [
  "https://www.google.com",
  "https://www.youtube.com",
  "https://www.github.com",
];

processArray(sites);
