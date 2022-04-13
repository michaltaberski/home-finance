import {
  Category,
  getOeprationType,
  Operation,
  Source,
} from "@home-finance/shared";

type RevoultCsvRow = {
  Type: "CARD_PAYMENT" | "EXCHANGE" | "TRANSFER";
  Product: "Current";
  "Started Date": string;
  "Completed Date": string;
  Description: string;
  Amount: string;
  Fee: string;
  Currency: "PLN";
  State: "COMPLETED";
  Balance: string;
};

export const revoultCsvRowToOperation = (row: RevoultCsvRow): Operation => {
  const amount = parseFloat(row["Amount"]) - parseFloat(row["Fee"]);
  return {
    id: row["Started Date"].replace(/[\s\-\:]+/g, ""),
    date: row["Started Date"].slice(0, 10),
    source: Source.REVOLUT,
    amount,
    type: getOeprationType(amount),
    title: row["Description"],
    description: row["Description"],
    category: Category.UNCATEGORIZED,
    balanceAfterOperation: parseFloat(row["Balance"]),
    otherSide: null,
  };
};
