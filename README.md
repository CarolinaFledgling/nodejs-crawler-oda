# Web Crawler

This is a web crawler script that extracts product data from a website and saves it to JSON
file and CSV file based on configuration file provided via command line arguments.
Built with Node.js and Cheerio.
Currently, it is set up to work with the Oda website.

## Prerequisites

Before you can use the web crawler, you must have the following installed on your machine:

- Node.js (version 12 or higher)
- npm (the Node.js package manager)

## Installation

To install the web crawler, follow these steps:

1. Clone this repository to your local machine.
2. Open a terminal window and navigate to the directory where you cloned the repository.
3. Run `npm install` to install the required packages.

### Customization

Currently, the scraper is set up to work specifically with the Oda website. If you want to use it with other websites, you will need to implement a new extract function.

To make this process easier, a `odaProductExtract` function has been exported from the `odaProductExtract.mjs` file.
To extract data from product details, you can create a new function similar to odaProductExtract that is specific to the website you are crawling.

Example:

```javascript
export const myProductExtract = ($, productEl, url) => {

  const nameEl = $(productEl).find(".product-title");
  const name = nameEl.text().trim();
  const description = $(productEl).find(".product-description")?.text().trim();
  const imageUrl = $(productEl).find(".product-image img")?.attr("src");
  const price = $(productEl).find(".product-price")?.text().trim();
  const brand = $(productEl).find(".product-brand")?.text().trim();

  return {
    name,
    description,
    imageUrl,
    price,
    brand,
  };
};
```

You can customize this function to extract any additional fields that you need for your specific use case. Once you have created the function, you can use it in your crawler by importing it and calling it in place of `odaProductExtract`.

Here's an example of how to use the odaProductExtract function:

```javascript
import { odaProductExtract } from "./odaProductExtract.mjs";

function extractProductData($, productEl, url) {
  // Implement new extract function when crawling other websites then Oda.
  return odaProductExtract($, productEl, url);
}

export default extractProductData;
```

In the future, I plan to add more customization options to extract data from product details so that it can be easily configured through a file.

## Usage

To use the web crawler, you need to create a configuration file that specifies the **required** information.
If any of the required information is missing, the program will not function properly and may crash.

- `url`: the URL of the website you want to crawl
- `file`: the path to the file where you want to save the extracted product data
- `productClassName`: the class name of the HTML element that contains the product data on each page
- `maxPages`: the maximum number of pages you want to crawl. Use 0 to crawl without page limit.
- `delay`: the delay (in milliseconds) between requests to avoid overwhelming (DDOS-ing) the website with requests.

Here is an example configuration file for **Oda website**

```json
{
  "url": "https://oda.com/no/",
  "file": "output/oda.result.json",
  "productClassName": ".product-list-item",
  "maxPages": 20,
  "delay": 1000
}
```

To run, use following command

```bash
node ./src/index.mjs --config=config.oda.json
```

The crawler will start crawling the website and extracting product data. Once it's done, it will save the data to the file you specified in the configuration file.

### Important: Product Information Extraction

In the `crawl` function `for` loop extracts information from each product element on the page using selectors with the `cheerio`library.
The specific selectors used depend on the structure of the HTML for the website you are crawling

By default the code have that the products elements have class of `.product-list-item`.
You can change this selector by updating the `productClassName` parameter in your configuration file

For example, if the product elements on your target website have a class of .item, you would update the configuration file as follows:

```json
{
  "url": "https://www.example.com/",
  "file": "output/example.result.json",
  "productClassName": ".item",
  "maxPages": 20,
  "delay": 1000
}

```


### Using the JSON Result File in a Next.js App

After you have run the web crawler and obtained a JSON result file, you can use the data in a Next.js app to display the extracted product information in a tabular format by using [Next.js Web scraping](https://github.com/CarolinaFledgling/nextjs-product-information-extraction)
