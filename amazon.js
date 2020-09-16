"use strict";

const puppeteer = require("puppeteer");

async function checkPrice() {
  const itemsToCheck = [
    {
      url:
        "https://www.amazon.ca/Ryzen-3700X-Processeur-d%C3%A9bloqu%C3%A9-refroidisseur/dp/B07SXMZLPK/ref=sr_1_5?dchild=1&keywords=amd%2Bryzen%2B7&qid=1598837768&sr=8-5&th=1",
      price: 400
    },
    {
      url:
        "https://www.amazon.ca/Ryzen-3700X-Processeur-d%C3%A9bloqu%C3%A9-refroidisseur/dp/B07SXMZLPK/ref=sr_1_5?dchild=1&keywords=amd%2Bryzen%2B7&qid=1598837768&sr=8-5&th=1",
      price: 200
    },
    {
      url:
        "https://www.amazon.ca/Ryzen-3700X-Processeur-d%C3%A9bloqu%C3%A9-refroidisseur/dp/B07SXMZLPK/ref=sr_1_5?dchild=1&keywords=amd%2Bryzen%2B7&qid=1598837768&sr=8-5&th=1",
      price: 200
    },
    {
      url:
        "https://www.amazon.ca/Ryzen-3700X-Processeur-d%C3%A9bloqu%C3%A9-refroidisseur/dp/B07SXMZLPK/ref=sr_1_5?dchild=1&keywords=amd%2Bryzen%2B7&qid=1598837768&sr=8-5&th=1",
      price: 900
    }
  ];
  let prices = [];

  try {
    for (let x = 0; x < itemsToCheck.length; x++) {
      const price = await startBrowser(itemsToCheck[x].url);
      prices.push(price);
    }
  } catch (error) {
    throw error;
    return;
  }

  return prices;
}

async function startBrowser(url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"]
  });
  const page = await browser.newPage();
  await page.goto(url);
  const price = await page.evaluate(() => {
    const price = document.querySelector("#priceblock_ourprice").innerText;
    const parsedPrice = parseFloat(
      price.split("$")[1].split("").splice(1).join("")
    );
    return parsedPrice;
  });
  await browser.close();
  return price;
}

module.exports = checkPrice;
