import { updateTextFile } from "@home-finance/fs-utils";
import { Operation, roundNumber } from "@home-finance/shared";
import { Dictionary, groupBy, mapValues } from "lodash";
import { getRowsFromCsvFile } from "./csvUtils";

type Buyer = "aneta" | "michal";

type TransactionSegment = {
  tarnsactionTime: string;
  itemsCount: number;
  itemUnitPrice: number;
  itemTotalPrice: number;
  description: string;
  sellerLogin: string;
  buyer: Buyer;
};

export type AllegroTransaction = {
  tarnsactionTime: string;
  sellerLogin: string;
  totalPrice: number;
  items: string[];
};

const getCsvRowToTransaction = (buyer: Buyer) => {
  return (row: { [key: string]: string }): TransactionSegment => {
    const rawRow = mapValues(row, (value: string) =>
      value.replace(/^'/, "").replace(/'$/, "")
    );
    const count = parseInt(
      rawRow["Liczba zakupionych przedmiotów / zestawów / kompletów"]
    );
    return {
      tarnsactionTime: rawRow["Data zakupu"],
      itemsCount: count,
      itemUnitPrice: roundNumber(parseFloat(rawRow["Kwota transakcji"])),
      itemTotalPrice: roundNumber(
        parseFloat(rawRow["Kwota transakcji"]) * count
      ),
      description: rawRow["Tytuł oferty"],
      sellerLogin: rawRow["Login sprzedawcy"],
      buyer,
    };
  };
};

const squashAllegroTransaction = (
  transactionSegments: TransactionSegment[]
): AllegroTransaction => {
  return transactionSegments.reduce<AllegroTransaction>(
    (
      acc,
      { description, itemTotalPrice, tarnsactionTime, sellerLogin, buyer }
    ) => ({
      tarnsactionTime,
      buyer,
      sellerLogin,
      totalPrice: roundNumber(acc.totalPrice + itemTotalPrice),
      items: [description, ...acc.items],
    }),
    { tarnsactionTime: "", sellerLogin: "", items: [], totalPrice: 0 }
  );
};

export const readAllegroDeals = async () => {
  const MICHAL_ALLEGRO_FILE_PATH = "input/zakupy-na-allegro-michal.csv";
  const ANETA_ALLEGRO_FILE_PATH = "input/zakupy-na-allegro-aneta.csv";

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
    getCsvRowToTransaction("michal"),
    { separator: ";" }
  );

  const anetasTransactions = await getRowsFromCsvFile(
    ANETA_ALLEGRO_FILE_PATH,
    getCsvRowToTransaction("aneta"),
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

  return groupBy(squashedTransactions, ({ tarnsactionTime }) =>
    tarnsactionTime?.substring(0, 10)
  );
};

export const getIsItAllegroOperation = (
  operation: Operation,
  allegroDealsByDate: Dictionary<AllegroTransaction[]>
) => {
  const descriptionMatch = !!operation.description.match(/allegro/i);
  const allegroDeals = allegroDealsByDate[operation.date];

  const priceMatch = !!allegroDeals?.find((deal) => {
    return Math.abs(operation.amount) === deal.totalPrice;
  });

  return priceMatch || descriptionMatch;
};
