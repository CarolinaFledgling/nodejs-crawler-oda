import fetch from "node-fetch";
import * as cheerio from "cheerio";
import minimist from "minimist";
import fs from "fs";
import fetchHtml from "./util/fetchHtml.mjs";
import parseHtml from "./util/parseHtml.mjs";
import extractProductData from "./util/extractProductData.mjs";

async function crawl(
  url,
  maxPages,
  delay,
  productClassName,
  visitedPages,
  products
) {
  if (visitedPages.length >= maxPages) {
    console.log(`Reached max pages ${maxPages}`);
    return;
  }

  if (visitedPages.includes(url)) {
    console.log(`Already visited ${url}`);
    return;
  }

  console.log(`Crawling ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error fetching products from url:${url}, response status:${response.status}`
      );
    }

    const html = await fetchHtml(url);
    const $ = parseHtml(html);

    //Get array of all the links on the page
    const links = $("a").get();

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      let href = $(link).attr("href");

      if (!href) {
        continue;
      }

      if (href.startsWith("/")) {
        href = "https://oda.com" + href;
      }

      //Skip links that do not contain "/categories/"
      if (!href.includes("/categories/")) {
        continue;
      }

      if (visitedPages.length >= maxPages) {
        console.log(`Reached max pages (${maxPages})`);
        return;
      }

      visitedPages.push(href);

      // Get all the product elements on the page
      const productsElements = $(productClassName);

      for (const productEl of productsElements) {
        const productData = extractProductData($, productEl, url);
        products.push(productData);
      }

      // Wait for delay before making the next request
      await new Promise((resolve) => setTimeout(resolve, delay));

      //Recursively crawl the link
      await crawl(
        url,
        maxPages,
        delay,
        productClassName,
        visitedPages,
        products
      );
    }

    console.log(`Crawling stopped`);
  } catch (err) {
    console.error(`Error fetching products from url: ${url}`, err);
  }
}

async function crawlWebsite(config) {
  const { url, file, productClassName, maxPages, delay } = config;
  const visitedPages = []; // track of visited pages
  const products = []; // store the extracted products

  await crawl(url, maxPages, delay, productClassName, visitedPages, products);

  fs.writeFileSync(file, JSON.stringify(products, null, 2));

  return products;
}

// Command line interface
const argv = minimist(process.argv.slice(2));
const configFilePath = argv.config;
const configJson = JSON.parse(fs.readFileSync(configFilePath).toString());

crawlWebsite(configJson);
