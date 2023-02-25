import * as cheerio from "cheerio";

function parseHtml(html) {
  return cheerio.load(html);
}

export default parseHtml