// $ variable to pass the Cheerio instance to the function
// that it can select and extract data from the HTML element specified by the productEl parameter.

function extractProductData($, productEl, url) {
  const nameEl = $(productEl).find(".name .name-main");
  const name = nameEl.text().trim();
  const alt = nameEl.find("img").attr("alt"); 
  const description = $(productEl).find(".name .name-extra")?.text().trim();
  const imageUrl = $(productEl).find(".image-container img")?.attr("src");
  const price = $(productEl).find(".price")?.text().trim();
  const unitPrice = $(productEl).find(".unit-price")?.text().trim();

  // Check if the product is out of stock
  const outOfStockText = $(productEl)
    .find(".label.lead-time-label")
    ?.text()
    .trim();
  const outOfStock = outOfStockText === "Utsolgt fra leverandør";

  //Check if the price is missing

  const hasMissingPrice = price === "";

  //Check if the product name has alt attr with text
  const hasAltText = alt !== undefined && alt.trim() !== "";

  return {
    name,
    description,
    imageUrl,
    price,
    unitPrice,
    url,
    outOfStock,
    hasMissingPrice,
    hasAltText,
  };
}

export default extractProductData;
