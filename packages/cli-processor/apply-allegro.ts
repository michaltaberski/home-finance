#! ./node_modules/.bin/ts-node

import { $, chalk } from "zx";
import { Category, Operation, Source, SOURCES } from "@home-finance/shared";
import {
  concatOperations,
  operationToString,
  readOutputData,
} from "./src/utils";
import { readJsonFile, saveJsonToFile } from "@home-finance/fs-utils";
import {
  AllegroTransaction,
  findPriceMatchDeal,
  getIsItAllegroOperation,
  readAllegroDeals,
  selectCategoryForOperation,
  selectDeal,
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
    const dealsFromThatDay = allegroDealsByDate[operation.date] || [];
    if (operation.category !== Category.UNCATEGORIZED) {
      return operation;
    }

    console.log(chalk.green("\n\n" + operationToString(operation)));

    const matchingDeal =
      findPriceMatchDeal(operation, allegroDealsByDate) ||
      (dealsFromThatDay.length && (await selectDeal(dealsFromThatDay))) ||
      null;
    if (!matchingDeal) console.log(chalk.redBright("no matching deal"));

    const title = matchingDeal
      ? `Allegro ${matchingDeal.buyer}: ${matchingDeal.items[0]}`
      : operation.title;

    const description = [
      operation.description,
      matchingDeal?.items.join("\n"),
    ].join("\n");

    const category = await selectCategoryForOperation(
      { ...operation, title, description },
      matchingDeal ? [] : relatedAllegroDeals
    );

    return { ...operation, category, title, description };
  }
};

const ALLEGRO_OPERATIONS_PATH = "output/allegro-operations.json";

const updateOrCreateAllegroOperations = (
  operation: Operation,
  allOperations: Operation[]
) => {
  const index = allOperations.findIndex(({ id }) => operation.id === id);
  if (index !== -1) {
    allOperations[index] = operation;
  } else {
    allOperations.push(operation);
  }
  return allOperations;
};

(async () => {
  const allegroDealsByDate = await readAllegroDeals();
  const allegroOperations =
    (await readJsonFile<Operation[]>(ALLEGRO_OPERATIONS_PATH)) || [];

  for (const source of SOURCES) {
    const operationsFromCurrentOutputFile = await readOutputData(source);
    const outputOperations: Operation[] = [];

    for (const operation of operationsFromCurrentOutputFile || []) {
      const restoredAllegroOperation = allegroOperations.find(
        ({ id }) => operation.id == id
      );
      if (restoredAllegroOperation) {
        console.log(chalk.greenBright("Skipping..."));
      }
      const allegroOperation =
        restoredAllegroOperation ||
        (await applyAllegroDealToOperation(operation, allegroDealsByDate));
      if (
        allegroOperation &&
        allegroOperation.category !== Category.UNCATEGORIZED
      ) {
        const updatedAllegroOperations = updateOrCreateAllegroOperations(
          allegroOperation,
          allegroOperations
        );
        await saveJsonToFile(updatedAllegroOperations, ALLEGRO_OPERATIONS_PATH);
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
