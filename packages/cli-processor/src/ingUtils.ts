import { Operation, Source } from "@home-finance/shared";

type IngCsvRow = {};

export const revoultCsvRowToOperation = (row: IngCsvRow): Operation | null => {
  return null;
  // return {
  //   id: row["Started Date"].replace(/[\s\-\:]+/g, ""),
  //   date: row["Started Date"].slice(0, 10),
  //   source: Source.REVOLUT,
  //   amount: parseFloat(row["Amount"]) - parseFloat(row["Fee"]),
  //   description: row["Description"],
  //   category: null,
  //   balanceAfterOperation: parseFloat(row["Balance"]),
  //   otherSide: null,
  // };
};
