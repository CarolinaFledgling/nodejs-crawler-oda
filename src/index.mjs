import fetchHtml from "./util/fetchHtml.mjs";
import parseHtml from "./util/parseHtml.mjs";
import extractProductData from "./util/extractProductData.mjs";
import getLinks from "./util/getLinks.mjs";
import saveJsonAndCsvFiles from "./util/saveJsonAndCsvFiles.mjs";
import getConfigFromCommandLine from "./util/getConfigFromCommandLine.mjs";

let pageCount = 0; // keep track of the number of pages that have been crawled so far.

async function crawl(
  url,
  maxPages,
  delay,
  productClassName,
  visitedPages,
  products
) {
  if (visitedPages.has(url)) {
    console.log(`Already visited ${url}`);
    return;
  } else {
    visitedPages.add(url);
  }

  console.log(`Crawling starting for. ${url}`);

  try {
    const html = await fetchHtml(url);
    const $ = parseHtml(html);

    //Get array of links must not be undefined, contain  "/categories/" and must not have already been visited
    const links = getLinks($, visitedPages);

    //Get all the product elements on the page
    const productsElements = $(productClassName);

    for (const productEl of productsElements) {
      const productData = extractProductData($, productEl, url);
      products.push(productData);
    }

    console.log("Crawling completed for:", url);

    console.log(
      `Starting crawling for product links found on the page: ${url}. Links count:`,
      links.length
    );

    for (let i = 0; i < links.length; i++) {
      if (pageCount < maxPages || maxPages === 0) {
        pageCount++;

        // Wait for delay before making the next request
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Recursively crawl the link
        await crawl(
          links[i],
          maxPages,
          delay,
          productClassName,
          visitedPages,
          products
        );
      } else {
        // console.log("limit reached for:", url);
      }
    }
  } catch (err) {
    console.error(`Error fetching products from url: ${url}`, err);
  }
}

async function crawlWebsite(config) {
  const { url, file, productClassName, maxPages, delay } = config;
  const visitedPages = new Set(); // track of visited pages
  const products = []; // store the extracted products

  pageCount = 1;
  await crawl(url, maxPages, delay, productClassName, visitedPages, products);

  console.log("Visited pages count: ", visitedPages.size);

  console.log("Saving file...");

  await saveJsonAndCsvFiles(file, products);

  console.log("Saving file completed");

  return products;
}

const configJson = getConfigFromCommandLine();

crawlWebsite(configJson);
