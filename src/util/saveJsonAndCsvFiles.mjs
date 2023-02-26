import fs from "fs";
import { writeCsv } from "./writeCsv.mjs";

async function saveJsonAndCsvFiles(file, data) {
  try {
    // Save JSON file
    fs.writeFileSync(`${file}.json`, JSON.stringify(data, null, 2));
    console.log("Saving json file completed");

    // Save CSV file
    await writeCsv(file, data);
    console.log("Saving csv file completed");
  } catch (error) {
    console.error("Saving files failed", error);
  }
}


export default saveJsonAndCsvFiles