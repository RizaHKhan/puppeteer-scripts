require('dotenv').config()
const puppeteer = require("puppeteer");

async function startBrowser(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const signInButton = await page.waitForSelector(
    'paper-button[aria-label="Sign in"]'
  );
  await signInButton.click();
  await page.waitForNavigation();

  // Enter email
  const emailInput = await page.waitForSelector('input[type="email"]');
  await emailInput.type(process.env.EMAIL);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  // Enter password
  const passwordInput = await page.waitForSelector('input[type="password"]');
  await passwordInput.click({ clickCount: 3 });
  await page.keyboard.type(process.env.EPASS);
  await page.keyboard.press("Enter");

  // This is where Google Authentication sends request to phone
  await page.waitForNavigation();
  // Wait for page load after authentication approved
  await page.waitForNavigation();

  await page.goto("https://www.youtube.com/feed/channels");

  // Start the process to remove all the channels (this could take a while)
  var subscribeButton = await page.$$(".ytd-subscribe-button-renderer");

  for (let x = 0; x < subscribeButton.length; x++) {
    await page.goto("https://www.youtube.com/feed/channels");
    await page.click(".ytd-subscribe-button-renderer");
    await page.screenshot({ path: "subscribeClicked1.png" });
    await page.click("paper-button[aria-label=Unsubscribe]");
    await page.screenshot({ path: "subscribeClicked2.png" });
  }

  await browser.close();
}

adminSectionUrl = "https://www.youtube.com";

startBrowser(adminSectionUrl);
