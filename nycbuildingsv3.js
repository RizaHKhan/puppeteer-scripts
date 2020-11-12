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
  "http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?requestid=20&ecbin=38236472X"
  // "http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?requestid=20&ecbin=39016173H"
  // "http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?requestid=20&ecbin=35150318L"
);

let objectsArray = [];

Promise.all([one]).then((values) => {
  const one = values[0];
  values[0].forEach((item) => {
    item.split("\t").map((item, index, array) =>
      item
        .split("\n")
        .filter((item) => item.length)
        .forEach((item) => {
          let isTrimmed = item.trim();
          let isSplit = isTrimmed.split("/t");
          let isSplitByColon = isSplit.toString().split(":");
          let obj = {};
          // Items that split into pairs
          if (
            isTrimmed.includes("Premises") ||
            isTrimmed.includes("Filed At") ||
            isTrimmed.includes("Community Board") ||
            isTrimmed.includes("OATH/ECB Violation Number") ||
            isTrimmed.includes("DOB Violation Number") ||
            isTrimmed.includes("Issued as Aggravated Level")
          ) {
            obj[isSplitByColon[0]] = isSplitByColon[1]
              ? isSplitByColon[1].trim()
              : "Not available";
            objectsArray.push(obj);
            // Stuff to ignore
          } else if (
            isTrimmed.includes("A Certificate of Correction must be") ||
            isTrimmed.includes("OATH/ECB Violation Summary") ||
            isTrimmed.includes("Violation Details") ||
            isTrimmed.includes("OATH/ECB Hearing Information") ||
            isTrimmed.includes("OATH/ECB Penalty Information") ||
            isTrimmed.includes("BIN") ||
            isTrimmed.includes(
              "Dept. of Buildings Compliance History and Events"
            ) ||
            isTrimmed.includes("Respondent Information")
          ) {
          } else if (isTrimmed.includes("Scheduled Hearing Date/Time")) {
            obj[isTrimmed.split(/:(.+)/)[0]] = isTrimmed
              .split(/:(.+)/)[1]
              .trim();
            objectsArray.push(obj);
            // Singles
          } else if (
            isTrimmed.includes("Name") ||
            isTrimmed.includes("Served Date") ||
            isTrimmed.includes("Hearing Status") ||
            isTrimmed.includes("Issuing Inspector ID") ||
            isTrimmed.includes("Certification Status") ||
            isTrimmed.includes("Violation Date") ||
            isTrimmed.includes("Mailing Address") ||
            isTrimmed.includes("Violation Type") ||
            isTrimmed.includes("Inspection Unit") ||
            isTrimmed.includes("Compliance On") ||
            isTrimmed.includes("Specific Violation Condition") ||
            isTrimmed.includes("Amount Paid") ||
            isTrimmed.includes("Adjustments") ||
            isTrimmed.includes("Penalty Imposed") ||
            isTrimmed.includes("Penalty Balance Due")
          ) {
            obj[array[index]] = array[index + 1];
            objectsArray.push(obj);
          } else if (
            isTrimmed.includes("Infraction Code") ||
            isTrimmed.includes("")
          ) {
            console.log(isTrimmed.split("\n"));
            obj[array[index]] = array[index + 4];
            objectsArray.push(obj);
          } else {
            console.log(isTrimmed);
          }
        })
    );
  });
  console.log(objectsArray);
});
