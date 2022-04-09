import {
  getOeprationType,
  Operation,
  sanitizeTitle,
  sanitzeString,
  Source,
} from "@home-finance/shared";

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
    const amount = parseFloat(
      amountString.replace(/\s/g, "").replace(/,/g, ".")
    );
    return {
      id: [date, amountString.replace(/[\s,]/g, "-")].join(""),
      source,
      date,
      title: sanitizeTitle(description),
      description: sanitzeString(description),
      amount,
      type: getOeprationType(amount),
      category: null,
      otherSide: null,
      balanceAfterOperation: 0,
    };
  };
