// $ variable to pass the Cheerio instance to the function
// that it can select and extract data from the HTML element specified by the productEl parameter.

import { odaProductExtract } from "./odaProductExtract.mjs";

function extractProductData($, productEl, url) {
  // Implement new extract function when crawling other websites then Oda.
  return odaProductExtract($, productEl, url);
}

export default extractProductData;
