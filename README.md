# Web Crawler

This is a web crawler script that extracts product data from a website and saves it to JSON
file based on configuration file provided via command line arguments.

## Prerequisites

Before you can use the web crawler, you must have the following installed on your machine:

- Node.js (version 12 or higher)
- npm (the Node.js package manager)

## Installation

To install the web crawler, follow these steps:

1. Clone this repository to your local machine.
2. Open a terminal window and navigate to the directory where you cloned the repository.
3. Run npm install to install the required packages.

## Usage

To use the web crawler, you need to create a configuration file that specifies the following that specifies the **required** information.
If any of the required information is missing, the program will not function properly and may crash. 

- `url`: the URL of the website you want to crawl
- `file`: the path to the file where you want to save the extracted product data
- `productClassName`: the class name of the HTML element that contains the product data on each page
- `maxPages`: the maximum number of pages you want to crawl
- `delay`: the delay (in milliseconds) between requests to avoid overwhelming the website with requests

Here is an example configuration file for **Oda website**

```bash
{
    "url":"https://oda.com/no/",
    "file":"output/oda.result.json",
    "productClassName": ".product-list-item",
    "maxPages":20,
    "delay":1000
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

```bash

{
    "url":"https://www.example.com/",
    "file":"output/example.result.json",
    "productClassName": ".item",
    "maxPages":20,
    "delay":1000
}

```

The specific information that is extract from each product element (such as name,description,price, and unit price) is determined by the selectors
used in the `const` statements.
You can update theses selectors to match the specific structure of the products elements on your target website.

For example, if the product name is stored in an element with a class of .product-name, you would update the name constant as follows:

```bash

const name = $(productEl).find(".product-name").text().trim();

```

You can repeat this process for each piece of information you want to extract from the product elements on your target website.
