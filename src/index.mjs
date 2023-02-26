import fetch from "node-fetch";
import minimist from "minimist";
import fs from "fs";
import fetchHtml from "./util/fetchHtml.mjs";
import parseHtml from "./util/parseHtml.mjs";
import extractProductData from "./util/extractProductData.mjs";
import getLinks from "./util/getLinks.mjs";

let pageCount = 1; // keep track of the number of pages that have been crawled so far.

async function crawl(
  url,
  maxPages,
  delay,
  productClassName,
  visitedPages,
  products
) {
  if (visitedPages.includes(url)) {
    console.log(`Already visited ${url}`);
    return;
  } else {
    visitedPages.push(url);
  }

  console.log(`Crawling ${url}`);

  try {
    const html = await fetchHtml(url);
    const $ = parseHtml(html);

    //Get array of links must not be undefined ,contain  "/categories/" and must not have already been visited
    const links = getLinks($, visitedPages);

    //Get all the product elements on the page
    const productsElements = $(productClassName);

    for (const productEl of productsElements) {
      const productData = extractProductData($, productEl, url);
      products.push(productData);
    }

    for (let i = 0; i < links.length; i++) {
      pageCount++;

      if (pageCount <= maxPages) {
        
        // Wait for delay before making the next request
        await new Promise((resolve) => setTimeout(resolve, delay));

        //Recursively crawl the link
        await crawl(
          links[i],
          maxPages,
          delay,
          productClassName,
          visitedPages,
          products
        );
      } else {
        console.log("limit reached");
      }
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
