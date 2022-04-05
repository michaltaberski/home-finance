import { fs } from "zx";
import { Operation, Source } from "./types";
import csv from "csv-parser";

type MbankCsvRow = {};

const mbankCsvRowToOperation = (
  row: MbankCsvRow,
  source: Source
): Operation => ({
  id: "",
  date: "",
  source,
  amount: 0,
  description: "",
  category: null,
  balanceAfterOperation: 0,
  otherSide: null,
});

export const getOperationsFromRevolutCsvFile = async (
  filePath: string,
  source: Source
): Promise<Operation[]> => {
  return new Promise<Operation[]>((resolve) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(mbankCsvRowToOperation(data, source)))
      .on("end", () => resolve(results));
  });
};
