const puppeteer = require("puppeteer");

const crawler = async (args) => {
  // Get the category from the req.body object
  const entries = Object.values(args);
  const category = entries[0];

  const extractList = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    const listOnPage = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("table.tableList > tbody > tr")
      ).map((table) => ({
        title: table.querySelector("a.bookTitle").innerText.trim(),
        author: table.querySelector("a.authorName").innerText.trim(),
        averageRating: table
          .querySelector("span.minirating")
          .innerText.split(" ")[1],
        totalRatings: table
          .querySelector("span.minirating")
          .innerText.split(" ")[5],
      }));
    });
    await page.close();

    if (listOnPage.length < 1) {
      return listOnPage;
    } else {
      const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
      const nextUrl = `https://www.goodreads.com/list/show/${category}?page=${nextPageNumber}`;
      return listOnPage.concat(await extractList(nextUrl));
    }
  };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const firstUrl = `https://www.goodreads.com/list/show/${category}?page=1`;
  const list = await extractList(firstUrl);

  await browser.close();
  // return list;
  console.log(list)
};

module.exports = crawler;

crawler({ category: "2602.Best_Female_Lead_Characters" });
