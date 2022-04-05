import { Operation, Source } from "./types";

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

export const revoultCsvRowToOperation = (row: RevoultCsvRow): Operation => ({
  id: row["Started Date"].replace(/[\s\-\:]+/g, ""),
  date: row["Started Date"].slice(0, 10),
  source: Source.REVOLUT,
  amount: parseFloat(row["Amount"]) - parseFloat(row["Fee"]),
  description: row["Description"],
  category: null,
  balanceAfterOperation: parseFloat(row["Balance"]),
  otherSide: null,
});
