const puppeteer = require("puppeteer");

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
  "http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?requestid=17&ecbin=39017239X"
);

let objectsArray = [];

Promise.all([one]).then((values) => {
  const one = values[0];
  for (let x = 0; x < one.length; x++) {
    if (x === 0) {
      values.forEach((item) => {
        item[x].split("\t").forEach((item) => {
          if (item) {
            let obj = {};
            obj[item.split(":")[0]] = item.split(":")[1].trim();
            objectsArray.push(obj);
          }
        });
      });
    }
    if (x === 1) {
      values.forEach((item) => {
        item[x].split("\t").forEach((item) => {
          if (item) {
            let obj = {};
            obj[item.split(":")[0]] = item.split(":")[1].trim();
            objectsArray.push(obj);
          }
        });
      });
    }

    if (x === 3) {
      values.forEach((item) => {
        let obj = {};
        obj[item[x].split("\t")[0]] = item[x].split("\t")[1].trim();
        objectsArray.push(obj);
      });
    }

    if (x === 4) {
      values.forEach((item) => {
        let obj = {};
        obj[item[x].split(":")[0]] = item[x].split(":")[1].trim();
        objectsArray.push(obj);
      });
    }

    if (x === 5) {
      values.forEach((item) => {
        let obj = {};
        obj[item[x].split("\t")[0].split(":")[0]] = item[x]
          .split("\t")[0]
          .split(":")[1]
          .trim();
        objectsArray.push(obj);

        obj = {};
        obj[item[x].split("\t")[1]] = item[x].split("\t")[2];
        objectsArray.push(obj);
      });
    }

    if (x === 6) {
      values.forEach((item) => {
        let obj = {};
        obj[item[x].split("\t")[0].split(":")[0]] = item[x]
          .split("\t")[0]
          .split(":")[1]
          .trim();
        objectsArray.push(obj);

        obj = {};
        obj[item[x].split("\t")[1]] = item[x].split("\t")[2];
        objectsArray.push(obj);
      });
    }

    if (x === 8) {
      values.forEach((item) => {
        let obj = {};
        obj[item[x].split("\t")[1]] = item[x].split("\t")[2];
        objectsArray.push(obj);
      });
    }

    if (x === 9) {
      values.forEach((item) => {
        let obj = {};
        obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
        objectsArray.push(obj);
      });
    }

    if (x === 10) {
      values.forEach((item) => {
        let obj = {};
        if (!item[x].includes("Violation Details")) {
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
        } else {
          obj["License/Registration/Tracking Number"] = "N/A";
        }
        objectsArray.push(obj);
      });
    }

    if (x === 11) {
      values.forEach((item) => {
        let obj = {};
        obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
        objectsArray.push(obj);

        obj = {};
        obj[item[x].trim().split("\t")[3]] = item[x].trim().split("\t")[4];
        objectsArray.push(obj);
      });
    }

    if (x === 12) {
      values.forEach((item) => {
        let obj = {};
        obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
        objectsArray.push(obj);

        obj = {};
        obj[item[x].trim().split("\t")[3]] = item[x].trim().split("\t")[4];
        objectsArray.push(obj);
      });
    }

    if (x === 13) {
      values.forEach((item) => {
        let len = item[x].trim().split("\t").length;
        let obj = {};
        if (len === 2) {
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
        } else if (len === 5) {
          obj[item[x].trim().split("\t")[1]] = item[x].trim().split("\t")[2];
          obj = {};
          obj[item[x].trim().split("\t")[3]] = item[x].trim().split("\t")[4];
        }
      });
    }

    if (x === 14) {
      values.forEach((item) => {
        let obj = {};
        if (item[x].trim().includes("Device Number")) {
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
        } else if (item[x].trim().includes("Infraction Codes")) {
          // console.log(item[x].trim().split("\t"));
        }
      });
    }
  }

  console.log(objectsArray);
});
