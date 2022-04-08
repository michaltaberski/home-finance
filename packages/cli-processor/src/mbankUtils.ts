import { Operation, Source } from "@home-finance/shared";

type MBankCsvRow = {
  date: string;
  description: string;
  account: string;
  _cat: string;
  amountString: string;
};

export const getMBankCsvRowToOperation =
  (source: Source) =>
  ({ date, description, amountString }: MBankCsvRow): Operation | null => {
    if (!amountString) return null;
    return {
      id: [date, amountString.replace(/[\s,]/g, "-")].join(""),
      source,
      date,
      description,
      amount: parseFloat(amountString.replace(/\s/g, "").replace(/,/g, ".")),
      category: null,
      otherSide: null,
      balanceAfterOperation: 0,
    };
  };
