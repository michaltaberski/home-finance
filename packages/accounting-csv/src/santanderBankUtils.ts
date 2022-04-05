import { Operation, Source } from "./types";

type SantanderBankRow = {};

export const santanderBankCsvRowToOperation = (
  row: SantanderBankRow
): Operation => ({
  id: "",
  date: "",
  source: Source.SANTANDER_BANK,
  amount: 0,
  description: "",
  category: null,
  balanceAfterOperation: 0,
  otherSide: null,
});
