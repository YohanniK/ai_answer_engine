import puppeteer, { Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import * as cheerio from "cheerio";

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

export async function scrapeUrl(url: string) {
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    args: isLocal
      ? puppeteer.defaultArgs()
      : [...chromium.args, "--hide-scrollbars", "--incognito", "--no-sandbox"],
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
    headless: chromium.headless, // Explicitly set to true
  });

  const page = await browser.newPage();
  await Promise.all([
    page.goto(url, {
      waitUntil: "domcontentloaded",
    }),
    // page.waitForNetworkIdle({ idleTime: 250 }),
    await waitForDOMToSettle(page),
  ]);

  const pageTitle = await page.title();
  const html = await page.content();
  const $ = cheerio.load(html);

  const description =
    $('meta[name="description"]').attr("content") || "No description available";

  await page.close();
  await browser.close();

  console.log("scraping completed successfully");
  return {
    url,
    pageTitle,
    description,
  };
}

const waitForDOMToSettle = (page: Page, timeoutMs = 30000, debounceMs = 1000) =>
  page.evaluate(
    (timeoutMs: any, debounceMs: any) => {
      let debounce = (func: any, ms = 1000) => {
        let timeout: any;
        return (...args: any) => {
          console.log("in debounce, clearing timeout again");
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            func.apply(this, args);
          }, ms);
        };
      };
      return new Promise((resolve, reject) => {
        let mainTimeout = setTimeout(() => {
          observer.disconnect();
          reject(new Error("Timed out whilst waiting for DOM to settle"));
        }, timeoutMs);

        let debouncedResolve = debounce(async () => {
          observer.disconnect();
          clearTimeout(mainTimeout);
          resolve(null);
        }, debounceMs);

        const observer = new MutationObserver(() => {
          debouncedResolve();
        });
        const config = {
          attributes: true,
          childList: true,
          subtree: true,
        };
        observer.observe(document.body, config);
      });
    },
    timeoutMs,
    debounceMs
  );
