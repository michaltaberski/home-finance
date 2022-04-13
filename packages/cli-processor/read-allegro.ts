#! ./node_modules/.bin/ts-node

import { saveJsonToFile, updateTextFile } from "@home-finance/fs-utils";
import { roundNumber } from "@home-finance/shared";
import { groupBy, mapValues } from "lodash";
import { $ } from "zx";
import { getRowsFromCsvFile } from "./src/csvUtils";

$.verbose = false;

const MICHAL_ALLEGRO_FILE_PATH = "input/zakupy-na-allegro-michal.csv";
const ANETA_ALLEGRO_FILE_PATH = "input/zakupy-na-allegro-aneta.csv";

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

  await saveJsonToFile(groupedByDay, "output/allegro-by-day.json");

  console.log("groupedByDay ", groupedByDay);
})();
