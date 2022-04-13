#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { Category, Operation, SOURCES } from "@home-finance/shared";
import { concatOperations, readOutputData } from "./src/utils";
import { readJsonFile, saveJsonToFile } from "@home-finance/fs-utils";
import {
  AllegroTransaction,
  findPriceMatchDeal,
  getIsItAllegroOperation,
  readAllegroDeals,
  selectCategoryForOperation,
} from "./src/allegroUtils";
import { Dictionary, take } from "lodash";

$.verbose = false;

const getRelatedAllegroDeals = (
  operation: Operation,
  allegroDealsByDate: Dictionary<AllegroTransaction[]>
) => {
  return allegroDealsByDate[operation.date];
};

const applyAllegroDealToOperation = async (
  operation: Operation,
  allegroDealsByDate: Dictionary<AllegroTransaction[]>
): Promise<Operation | null> => {
  const isItAllegroOperation = getIsItAllegroOperation(
    operation,
    allegroDealsByDate
  );
  if (!isItAllegroOperation) return null;
  const isItReturn = operation.amount > 0;
  const relatedAllegroDeals =
    getRelatedAllegroDeals(operation, allegroDealsByDate) || [];
  if (isItReturn) {
    return { ...operation, title: "Zwrot Allegro", category: Category.RETURN };
  } else {
    const matchingDeal = findPriceMatchDeal(operation, allegroDealsByDate);
    const title = matchingDeal
      ? `Allegro ${matchingDeal.buyer}: ${matchingDeal.items[0]}`
      : operation.title;
    const description = [
      operation.description,
      matchingDeal?.items.join("\n"),
    ].join("\n");

    const category = await selectCategoryForOperation(
      operation,
      relatedAllegroDeals
    );
    console.log("category ", category);
    return { ...operation, category, title, description };
  }
};

const ALLEGRO_OPERATIONS_PATH = "output/allegroOperations.json";

(async () => {
  const allegroDealsByDate = await readAllegroDeals();
  const allegroOperations =
    (await readJsonFile<Operation[]>(ALLEGRO_OPERATIONS_PATH)) || [];

  for (const source of SOURCES) {
    const operationsFromCurrentOutputFile = await readOutputData(source);
    const outputOperations: Operation[] = [];

    for (const operation of operationsFromCurrentOutputFile || []) {
      const allegroOperation = await applyAllegroDealToOperation(
        operation,
        allegroDealsByDate
      );
      if (allegroOperation) {
        allegroOperations.push(allegroOperation);
        await saveJsonToFile(allegroOperations, ALLEGRO_OPERATIONS_PATH);
      }
      outputOperations.push(allegroOperation || operation);
    }
    await saveJsonToFile(outputOperations, `output/${source}.json`);
  }
  await saveJsonToFile(
    await concatOperations(SOURCES),
    `output/all-operations.json`
  );
})();
