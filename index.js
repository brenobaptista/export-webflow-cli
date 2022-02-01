const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const downloadPath = path.resolve(__dirname, "download");

const arguments = process.argv.slice(2);

if (arguments.length != 1) {
  console.error("Usage: node index.js <project>");
  process.exit(1);
}

dotenv.config();

const waitForFile = async (filename) => {
  const delay = (time) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  };

  return new Promise(async (resolve) => {
    if (!fs.existsSync(filename)) {
      await delay(1000);
      await waitForFile(filename);
      resolve();
    } else {
      resolve();
    }
  });
};

const exportWebflow = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768,
  });

  await page.goto("https://webflow.com/dashboard/login", {
    waitUntil: "networkidle2",
    timeout: 0,
  });
  await page.type(
    '[data-automation-id="username-input"]',
    process.env[`${arguments[0].toUpperCase()}_WEBFLOW_USERNAME`]
  );
  await page.type(
    '[data-automation-id="password-input"]',
    process.env[`${arguments[0].toUpperCase()}_WEBFLOW_PASSWORD`]
  );
  await page.click('[data-automation-id="login-button"]');
  await page.waitForNavigation({
    waitUntil: "networkidle2",
    timeout: 0,
  });

  await page.goto(`https://webflow.com/design/${arguments[0]}`, {
    waitUntil: "networkidle0",
    timeout: 0,
  });
  await page.click("div.bem-TopBar_Body_Button.bem-TopBar_Body_ExportButton");
  const prepareZip = await page.waitForXPath(
    "//button[contains(., 'Prepare ZIP')]"
  );
  await prepareZip.click();
  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });
  const downloadZip = await page.waitForXPath(
    "//button[contains(., 'Download ZIP')]"
  );
  await downloadZip.click();
  const filename = `${arguments[0]}.webflow.zip`;
  const pathWithFilename = `${downloadPath}/${filename}`;
  await waitForFile(pathWithFilename);

  await browser.close();
};

exportWebflow();
