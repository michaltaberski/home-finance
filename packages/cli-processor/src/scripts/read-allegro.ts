#! ./node_modules/.bin/ts-node

import { groupBy, mapValues } from "lodash";
import { $ } from "zx";
import { getRowsFromCsvFile } from "../csvUtils";
import { saveJsonToFile, updateTextFile } from "../utils";

$.verbose = false;

type TransactionSegment = {
  tarnsactionTime: string;
  itemsCount: number;
  itemUnitPrice: number;
  itemTotalPrice: number;
  description: string;
  sellerLogin: string;
};

const round = (num: number) => Math.round(num * 100) / 100;

const csvRowToTransaction = (row): TransactionSegment => {
  const rawRow = mapValues(row, (value: string) =>
    value.replace(/^'/, "").replace(/'$/, "")
  );
  const count = parseInt(
    rawRow["Liczba zakupionych przedmiotów / zestawów / kompletów"]
  );
  return {
    tarnsactionTime: rawRow["Data zakupu"],
    itemsCount: count,
    itemUnitPrice: round(parseFloat(rawRow["Kwota transakcji"])),
    itemTotalPrice: round(parseFloat(rawRow["Kwota transakcji"]) * count),
    description: rawRow["Tytuł oferty"],
    sellerLogin: rawRow["Login sprzedawcy"],
  };
};

const squashAllegroTransaction = (
  transactionSegments: TransactionSegment[]
  // TODO fix types
): any => {
  return transactionSegments.reduce(
    (acc, { description, itemTotalPrice, tarnsactionTime, sellerLogin }) => ({
      tarnsactionTime,
      sellerLogin,
      totalPrice: round(acc.totalPrice + itemTotalPrice),
      items: [description, ...acc.items],
    }),
    { items: [], totalPrice: 0 }
  );
};

const MICHAL_ALLEGRO_FILE_PATH = "./input-data/zakupy-na-allegro-michal.csv";
const ANETA_ALLEGRO_FILE_PATH = "./input-data/zakupy-na-allegro-aneta.csv";

(async () => {
  await updateTextFile(MICHAL_ALLEGRO_FILE_PATH, (text) => {
    return text
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&gt;/g, ">");
  });
  await updateTextFile(ANETA_ALLEGRO_FILE_PATH, (text) => {
    return text
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&gt;/g, ">");
  });

  const michalsTransactions = await getRowsFromCsvFile(
    MICHAL_ALLEGRO_FILE_PATH,
    csvRowToTransaction,
    { separator: ";" }
  );
  const anetasTransactions = await getRowsFromCsvFile(
    ANETA_ALLEGRO_FILE_PATH,
    csvRowToTransaction,
    { separator: ";" }
  );
  const groupedTransactions = groupBy(
    [...michalsTransactions, ...anetasTransactions],
    ({ tarnsactionTime, sellerLogin }) =>
      [tarnsactionTime?.substring(0, 16), sellerLogin].join("-")
  );
  const squashedTransactions = Object.values(
    mapValues(groupedTransactions, squashAllegroTransaction)
  );
  const groupedByDay = groupBy(squashedTransactions, ({ tarnsactionTime }) =>
    tarnsactionTime?.substring(0, 10)
  );
  await saveJsonToFile(groupedByDay, "./output-data/allegro-by-day.json");
})();
