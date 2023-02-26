function getLinks($, visitedPages) {
  return $("a")
    .get()
    .map((element) => {
      let href = $(element).attr("href");

      if (!href) {
        
        return undefined;
      }

      if (href.startsWith("/")) {
        href = "https://oda.com" + href;
      }
      return href;
    })
    .filter(
      (href) =>
        href && href.includes("/categories/") && !visitedPages.includes(href)
    );
}

export default getLinks;
