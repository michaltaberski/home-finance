import { fs } from "zx";
import csv, { Options } from "csv-parser";
import { getDataPath } from "@home-finance/fs-utils";

export const getRowsFromCsvFile = async <T, E>(
  filePath: string,
  csvRowMapper: (row: T) => E | null,
  optionsOrHeaders?: Options | readonly string[]
): Promise<E[]> => {
  return new Promise<E[]>((resolve) => {
    const results: E[] = [];
    fs.createReadStream(getDataPath(filePath))
      .pipe(csv(optionsOrHeaders))
      .on("data", (data: T) => {
        const result = csvRowMapper(data);
        if (result) results.push(result);
      })
      .on("end", () => resolve(results));
  });
};
