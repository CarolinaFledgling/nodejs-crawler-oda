import fetch from "node-fetch";

async function fetchHtml(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error fetching HTML from url:${url}, response status:${response.status}`
    );
  }

  return response.text();
}

export default fetchHtml;
