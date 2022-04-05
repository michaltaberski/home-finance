import { Operation, Source } from "./types";

type SantanderCreditCardRow = {
  id: string; // quite meaning less, don't use it
  dataKsiegowania?: string; // FORMAT !!! '12-04-2021', !!! can be null
  dataTransakcji: string; // FORMAT !!! '09-04-2021',
  tytulOperacji: string;
  kwota: string;
};

const toIsoDate = (date: string) => {
  if (!date) return "";
  const [, day, month, year] = date.match(/(\d\d)-(\d\d)-(\d\d\d\d)/);
  return [year, month, day].join("-");
};

const getUniqSortableId = (row: SantanderCreditCardRow) =>
  toIsoDate(row.dataTransakcji).replace(/-/g, "") + row.id.padStart(4, "0");

export const santanderCreditCardCsvRowToOperation = (
  row: SantanderCreditCardRow
): Operation => {
  return {
    id: getUniqSortableId(row),
    date: toIsoDate(row.dataTransakcji),
    source: Source.SANTANDER_CREDIT_CARD,
    amount: parseFloat(row.kwota.replace(",", ".")),
    description: row.tytulOperacji,
    category: null,
    balanceAfterOperation: 0,
    otherSide: null,
  };
};
