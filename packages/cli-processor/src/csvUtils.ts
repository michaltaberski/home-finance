import { fs } from "zx";
import csv, { Options } from "csv-parser";
import { getDataPath } from "@home-finance/shared";

export const getRowsFromCsvFile = async <T, E>(
  filePath: string,
  csvRowToOperation: (row: T) => E,
  optionsOrHeaders?: Options | readonly string[]
): Promise<E[]> => {
  return new Promise<E[]>((resolve) => {
    const results = [];
    fs.createReadStream(getDataPath(filePath))
      .pipe(csv(optionsOrHeaders))
      .on("data", (data: T) => results.push(csvRowToOperation(data)))
      .on("end", () => resolve(results));
  });
};
