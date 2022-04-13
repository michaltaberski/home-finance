import {
  Category,
  getOeprationType,
  Operation,
  Source,
} from "@home-finance/shared";

type IngCsvRow = {
  dataTransakcji: string;
  dataKsiegowania: string;
  daneKontrahenta: string;
  tytul: string;
  nrRachunku: string;
  nazwaBanku: string;
  szczegoly: string;
  nrTransakcji: string;
  kwotaTransakcji: string;
  walutaTransakcji: string;
  kwotaBlokady: string;
  walutaBlokady: string;
  kwotaPlatnosci: string;
  walutaPlatnosci: string;
  saldoPoTransakcji: string;
  walutaSalda: string;
};

export const ingCsvRowToOperation = (row: IngCsvRow): Operation | null => {
  if (!row.dataTransakcji || !row.saldoPoTransakcji) return null;
  const amount = parseFloat(row.kwotaTransakcji || row.kwotaBlokady);
  return {
    id: [row.dataTransakcji, row.saldoPoTransakcji].join(":"),
    date: row.dataTransakcji,
    source: Source.ING,
    amount,
    type: getOeprationType(amount),
    title: row.tytul,
    description: row.tytul,
    category: Category.UNCATEGORIZED,
    balanceAfterOperation: parseFloat(row.saldoPoTransakcji),
    otherSide: null,
  };
};
