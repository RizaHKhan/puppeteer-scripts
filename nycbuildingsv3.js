const puppeteer = require("puppeteer");
const fs = require("fs");

const crawler = async (url) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    ignoreDefaultArgs: ["--disable-exteions"],
    // headless: false,
  });

  const page = await browser.newPage();
  await page.goto(url);

  const generalInfo = await page.evaluate(() => {
    return Array(
      document.querySelectorAll("table")[3].querySelectorAll("tr")
    ).map((tr) => {
      let results = [];
      tr.forEach((td) => {
        results.push(td.innerText.trim());
      });
      return results;
    });
    return results;
  });

  const violationSummary = await page.evaluate(() => {
    return Array(
      document.querySelectorAll("table")[4].querySelectorAll("tr")
    ).map((tr) => {
      let results = [];
      tr.forEach((td) => {
        if (td.innerText) {
          results.push(td.innerText);
        }
      });
      return results;
    });
    return results;
  });

  let aggregatedArray = [];
  generalInfo.forEach((item) =>
    item.forEach((item) => aggregatedArray.push(item))
  );
  violationSummary.forEach((item) =>
    item.forEach((item) => aggregatedArray.push(item))
  );

  await browser.close();
  return aggregatedArray;
};

const one = crawler(
  // "http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?requestid=20&ecbin=38236472X"
  "http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?requestid=20&ecbin=39016173H"
  // "http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?requestid=20&ecbin=35150318L"
);

let objectsArray = [];

function splitByColon(item, array) {
  let obj = {};
  const key = item.split(":")[0];
  const val = item.split(":")[1].trim();
  obj[key] = val;
  array.push(obj);
}

function byNextInArray(key, value, array) {
  let obj = {};
  obj[key] = value.trim();
  array.push(obj);
}

Promise.all([one]).then((values) => {
  const one = values[0];
  values[0].forEach((i, index, array) => {
    // splits into 3
    if (i.includes("Premises") || i.includes("OATH/ECB Violation Number")) {
      i.split("\t").forEach((item) =>
        item.length ? splitByColon(item, objectsArray) : ""
      );
    } else {
      console.log(i.split("\t"));
    }
  });
  console.log(objectsArray);
});
