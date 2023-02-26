import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

export const writeCsv = async (path, data) => {
  const csvWriter = createCsvWriter({
    path: `${path}.csv`,
    header: [
      { id: "name", title: "name" },
      { id: "description", title: "description" },
      { id: "imageUrl", title: "imageUrl" },
      { id: "price", title: "price" },
      { id: "unitPrice", title: "unitPrice" },
      { id: "url", title: "url" },
      { id: "outOfStock", title: "outOfStock" },
      { id: "hasMissingPrice", title: "hasMissingPrice" },
      { id: "hasAltText", title: "hasAltText" },
    ],
  });

  return csvWriter.writeRecords(data);
};
