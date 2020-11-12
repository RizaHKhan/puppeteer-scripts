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

let objectsArray = [];

const one = crawler(
  "http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?requestid=20&ecbin=38236472X"
);

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
          obj[item[x].trim().split("\t")[0]] = item[x]
            .trim()
            .split("\t")[2]
            .split("\n")[1];

          objectsArray.push(obj);

          let obj1 = {};
          obj1[item[x].trim().split("\t")[1]] = item[x].trim().split("\t")[3];
          objectsArray.push(obj1);

          let obj2 = {};
          obj2[item[x].trim().split("\t")[2].split("\n")[0]] = item[x]
            .trim()
            .split("\t")[4];
          objectsArray.push(obj2);
        }
      });
    }

    if (x === 15) {
      values.forEach((item) => {
        if (item[x].trim().includes("Infraction Codes")) {
          let obj = {};
          obj[item[x].trim().split("\t")[0]] = item[x]
            .trim()
            .split("\t")[2]
            .split("\n")[1];

          objectsArray.push(obj);

          let obj1 = {};
          obj1[item[x].trim().split("\t")[1]] = item[x].trim().split("\t")[3];
          objectsArray.push(obj1);

          let obj2 = {};
          obj2[item[x].trim().split("\t")[2].split("\n")[0]] = item[x]
            .trim()
            .split("\t")[4];
          objectsArray.push(obj2);
        }
      });
    }

    if (x === 16) {
      values.forEach((item) => {
        if (item[x].trim().includes("Infraction Code")) {
          // console.log(true);
        } else {
          let obj = {};
          let obj1 = {};
          let obj2 = {};
          obj["Infraction Code"] = item[x].trim().split("\t")[0];
          obj1["Section of Law"] = item[x].trim().split("\t")[1];
          obj2["Standard Description"] = item[x].trim().split("\t")[2];
        }
      });
    }

    if (x === 17) {
      values.forEach((item) => {
        if (item[x].trim().includes("Infraction Code")) {
          // console.log(true);
        } else {
          let obj = {};
          let obj1 = {};
          let obj2 = {};
          obj["Infraction Code"] = item[x].trim().split("\t")[0];
          obj1["Section of Law"] = item[x].trim().split("\t")[1];
          obj2["Standard Description"] = item[x].trim().split("\t")[2];
          objectsArray.push(obj);
          objectsArray.push(obj1);
          objectsArray.push(obj2);
        }
      });
    }

    if (x === 18) {
      values.forEach((item) => {
        if (
          item[x].trim().includes("Specific Violation Condition(s) and Remedy")
        ) {
          // console.log(true);
        } else {
          let obj = {};
          obj["Specific Violation Conditions(s) and Remedy"] = item[x]
            .trim()
            .split("\t")[0];
          objectsArray.push(obj);
        }
      });
    }

    if (x === 19) {
      values.forEach((item) => {
        if (item[x].trim().includes("Issuing Inspector ID")) {
          let obj = {};
          obj[item[x].trim().split("\t")[1]] = item[x].trim().split("\t")[2];
          objectsArray.push(obj);
        } else {
          let obj = {};
          obj["Specific Violation Conditions(s) and Remedy"] = item[x]
            .trim()
            .split("\t")[0];
          objectsArray.push(obj);
        }
      });
    }

    if (x === 20) {
      values.forEach((item) => {
        if (item[x].trim().includes("Issued as Aggravated Level")) {
          let obj = {};
          obj[item[x].trim().split("\t")[0].split(":")[0]] = item[x]
            .trim()
            .split("\t")[0]
            .split(":")[1]
            .trim();
          objectsArray.push(obj);
        } else {
          let obj = {};
          let obj1 = {};

          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          obj1[item[x].trim().split("\t")[2].split(":")[0].trim()] = item[x]
            .trim()
            .split("\t")[2]
            .split(":")[1]
            .trim();

          objectsArray.push(obj);
          objectsArray.push(obj1);
        }
      });
    }

    if (x === 21) {
      values.forEach((item) => {
        if (item[x].trim().includes("Issued as Aggravated Level")) {
          let obj = {};
          obj[item[x].trim().split("\t")[0].split(":")[0]] = item[x]
            .trim()
            .split("\t")[0]
            .split(":")[1]
            .trim();
          objectsArray.push(obj);
        } else {
        }
      });
    }

    if (x === 22) {
      values.forEach((item) => {
        if (item[x].trim().includes("Certification Status")) {
          let obj = {};
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          objectsArray.push(obj);
        } else {
        }
      });
    }

    if (x === 23) {
      values.forEach((item) => {
        if (item[x].trim().includes("A Certificate of Correction must")) {
        } else if (item[x].trim().includes("CERTIFICATE ACCEPTED")) {
          let obj = {};
          let obj1 = {};

          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          obj1[item[x].trim().split("\t")[2]] = item[x].trim().split("\t")[3];

          objectsArray.push(obj);
          objectsArray.push(obj1);
        } else {
          let obj = {};
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          objectsArray.push(obj);
        }
      });
    }

    if (x === 24) {
      values.forEach((item) => {
        if (
          item[x].trim().includes("OATH/ECB Hearing Information") ||
          item[x].trim().includes("A Certificate of Correction must")
        ) {
        } else {
          // console.log(item[x].trim().split("\t"));
          if (item[x].trim().split("\t").length === 4) {
            let obj = {};
            let obj1 = {};

            obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
            obj1[item[x].trim().split("\t")[2]] = item[x].trim().split("\t")[3];

            objectsArray.push(obj);
            objectsArray.push(obj1);
          } else {
            let obj = {};
            obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
            objectsArray.push(obj);
          }
        }
      });
    }

    if (x === 25) {
      values.forEach((item) => {
        if (
          item[x].trim().includes("A Certificate of Correction must") ||
          item[x].trim().includes("OATH/ECB Hearing Information")
        ) {
        } else {
          if (item[x].trim().split("\t").length === 2) {
            let obj = {};
            obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
            objectsArray.push(obj);
          } else {
            let obj = {};
            let obj1 = {};
            obj[item[x].trim().split("\t")[0].split(/:(.+)/)[0]] = item[x]
              .trim()
              .split("\t")[0]
              .split(/:(.+)/)[1]
              .trim();
            obj1[item[x].trim().split("\t")[2]] = item[x].trim().split("\t")[3];
            objectsArray.push(obj);
            objectsArray.push(obj1);
          }
        }
      });
    }

    if (x === 26) {
      values.forEach((item) => {
        if (
          item[x].trim().includes("A Certificate of Correction must") ||
          item[x].trim().includes("OATH/ECB Hearing Information") ||
          item[x].trim().includes("OATH/ECB Penalty Information")
        ) {
        } else {
          let obj = {};
          let obj1 = {};
          obj[item[x].trim().split("\t")[0].split(/:(.+)/)[0]] = item[x]
            .trim()
            .split("\t")[0]
            .split(/:(.+)/)[1]
            .trim();
          obj1[item[x].trim().split("\t")[2]] = item[x].trim().split("\t")[3];
          objectsArray.push(obj);
          objectsArray.push(obj1);
        }
      });
    }

    if (x === 27) {
      values.forEach((item) => {
        if (item[x].trim().split("\t").length === 4) {
          let obj = {};
          let obj1 = {};
          obj[item[x].trim().split("\t")[0].split(/:(.+)/)[0]] = item[x]
            .trim()
            .split("\t")[0]
            .split(/:(.+)/)[1]
            .trim();
          obj1[item[x].trim().split("\t")[2]] = item[x].trim().split("\t")[3];
          objectsArray.push(obj);
          objectsArray.push(obj1);
        } else if (item[x].trim().split("\t").length === 2) {
          let obj = {};
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          objectsArray.push(obj);
        }
      });
    }

    if (x === 28) {
      values.forEach((item) => {
        if (item[x].trim().includes("OATH/ECB Penalty Information")) {
        } else if (item[x].trim().split("\t").length === 2) {
          let obj = {};
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          objectsArray.push(obj);
        } else {
          if (item[x].trim().includes("Adjustments")) {
            let obj = {};
            let obj1 = {};
            obj[item[x].trim().split("\t")[0]] = item[x]
              .trim()
              .split("\t")[1]
              .trim();
            obj1[item[x].trim().split("\t")[3]] = item[x].trim().split("\t")[4];
            objectsArray.push(obj);
            objectsArray.push(obj1);
          } else {
            let obj = {};
            let obj1 = {};
            obj[item[x].trim().split("\t")[0].split(/:(.+)/)[0]] = item[x]
              .trim()
              .split("\t")[0]
              .split(/:(.+)/)[1]
              .trim();
            obj1[item[x].trim().split("\t")[2]] = item[x].trim().split("\t")[3];
            objectsArray.push(obj);
            objectsArray.push(obj1);
          }
        }
      });
    }

    if (x === 29) {
      values.forEach((item) => {
        if (item[x].trim().includes("OATH/ECB Penalty Information")) {
        } else if (item[x].trim().split("\t").length === 2) {
          let obj = {};
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          objectsArray.push(obj);
        } else {
          let obj = {};
          let obj1 = {};
          obj[item[x].trim().split("\t")[0]] = item[x]
            .trim()
            .split("\t")[1]
            .trim();
          obj1[item[x].trim().split("\t")[3]] = item[x].trim().split("\t")[4];
          objectsArray.push(obj);
          objectsArray.push(obj1);
        }
      });
    }

    if (x === 30) {
      values.forEach((item) => {
        if (item[x]) {
          if (item[x].trim().split("\t").length === 2) {
            let obj = {};
            obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
            objectsArray.push(obj);
          } else {
            let obj = {};
            let obj1 = {};
            obj[item[x].trim().split("\t")[0]] = item[x]
              .trim()
              .split("\t")[1]
              .trim();
            obj1[item[x].trim().split("\t")[3]] = item[x].trim().split("\t")[4];
            objectsArray.push(obj);
            objectsArray.push(obj1);
          }
        }
      });
    }

    if (x === 31) {
      values.forEach((item) => {
        if (item[x]) {
          if (item[x].trim().split("\t").length === 2) {
            let obj = {};
            obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
            objectsArray.push(obj);
          } else {
            let obj = {};
            let obj1 = {};
            obj[item[x].trim().split("\t")[0]] = item[x]
              .trim()
              .split("\t")[1]
              .trim();
            obj1[item[x].trim().split("\t")[3]] = item[x].trim().split("\t")[4];
            objectsArray.push(obj);
            objectsArray.push(obj1);
          }
        }
      });
    }

    if (x === 32) {
      values.forEach((item) => {
        if (item[x]) {
          let obj = {};
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          objectsArray.push(obj);
        }
      });
    }

    if (x === 32) {
      values.forEach((item) => {
        if (item[x]) {
          let obj = {};
          obj[item[x].trim().split("\t")[0]] = item[x].trim().split("\t")[1];
          objectsArray.push(obj);
        }
      });
    }
    // end of for loop
  }
  console.log(objectsArray);
});
