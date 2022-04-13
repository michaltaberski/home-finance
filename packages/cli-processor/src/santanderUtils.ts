import {
  Category,
  getOeprationType,
  Operation,
  Source,
} from "@home-finance/shared";

type SantanderBankRow = {
  id: string;
  dataKsiegowania?: string;
  dataTransakcji: string;
  tytulOperacji: string;
  numerKonta: string;
  kwota: string;
};

const toIsoDate = (date: string) => {
  if (!date) return "";
  const [, day, month, year] = date.match(/(\d\d)-(\d\d)-(\d\d\d\d)/) || [];
  return [year, month, day].join("-");
};

const getUniqSortableId = (row: SantanderBankRow) =>
  toIsoDate(row.dataTransakcji).replace(/-/g, "") + row.id.padStart(4, "0");

const santanderBankRowToOperation = (
  row: SantanderBankRow,
  source: Source
): Operation | null => {
  if (!row.kwota) return null;
  const amount = parseFloat(row.kwota.replace(",", "."));
  return {
    id: getUniqSortableId(row),
    date: toIsoDate(row.dataTransakcji),
    source,
    amount,
    type: getOeprationType(amount),
    title: row.tytulOperacji,
    description: row.tytulOperacji,
    category: Category.UNCATEGORIZED,
    balanceAfterOperation: 0,
    otherSide: null,
  };
};

export const santanderCreditCardCsvRowToOperation = (
  row: SantanderBankRow
): Operation | null =>
  santanderBankRowToOperation(row, Source.SANTANDER_CREDIT_CARD);

export const santanderBankCsvRowToOperation = (
  row: SantanderBankRow
): Operation | null => santanderBankRowToOperation(row, Source.SANTANDER_BANK);
