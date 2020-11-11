const puppeteer = require("puppeteer");

const evalFunc = async function (args) {
  // Setup args
  const entries = Object.values(args);
  const url = entries[0];
  const email = entries[1];
  const password = entries[2];

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const context = browser.defaultBrowserContext();
  context.overridePermissions("https://www.youtube.com", ["notifications"]);

  const page = await browser.newPage();
  await page.goto(url);
  const signInButton = await page.waitForSelector('paper-button[aria-label="Sign in"]');

  await signInButton.click();
  await page.waitForNavigation();

  // Enter email
  const emailInput = await page.waitForSelector('input[type="email"]');
  await emailInput.type(email);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  // Enter password
  const passwordInput = await page.waitForSelector('input[type="password"]');
  await passwordInput.click({ clickCount: 3 });
  await page.keyboard.type(password);
  await page.keyboard.press("Enter");

  // This is where Google Authentication sends request to phone
  await page.waitForNavigation();
  // Wait for page load after authentication approved
  await page.waitForNavigation();

  await page.goto("https://www.youtube.com/feed/channels");
  await page.waitForNavigation();

  const subButtons = await page.$$(".ytd-subscribe-button-renderer");

  async for (let x = 0; x < subButtons.length; x++) {
    await page.evaluate(() => {
      document.querySelector('.ytd-subscribe-button-renderer').click();
    }

    await page.evaluate(() => {
      document.querySelector('paper-button[aria-label="Unsubscribe"]').click()
    })

    await page.goto("https://www.youtube.com/feed/channels");
    await page.waitForNavigation();
  }

  await browser.close();
};

crawl({
  url: "https://www.youtube.com",
  email: "khanriza@gmail.com",
  password: "87Z8VS8DsXyy",
});
