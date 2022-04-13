#! ./node_modules/.bin/ts-node

import { $, chalk } from "zx";
import {
  Category,
  CategorySuggestionMatch,
  Operation,
  SOURCES,
} from "@home-finance/shared";
import {
  concatOperations,
  getSuggestion,
  operationToString,
  readOutputData,
} from "./src/utils";
import { readJsonFile, saveJsonToFile } from "@home-finance/fs-utils";
import {
  AllegroTransaction,
  getIsItAllegroOperation,
  readAllegroDeals,
} from "./src/allegroUtils";
import { Dictionary, take } from "lodash";

$.verbose = false;

const getRelatedAllegroDeals = (
  operation: Operation,
  allegroDealsByDate: Dictionary<AllegroTransaction[]>
) => {
  return allegroDealsByDate[operation.date];
};

const applyAllegroDealToOperation = (
  operation: Operation,
  allegroDealsByDate: Dictionary<AllegroTransaction[]>
): Operation => {
  const isItAllegroOperation = getIsItAllegroOperation(
    operation,
    allegroDealsByDate
  );
  if (isItAllegroOperation) {
    const isItReturn = operation.amount > 0;
    const relatedAllegroDeals = getRelatedAllegroDeals(
      operation,
      allegroDealsByDate
    );
    if (isItReturn) {
      return { ...operation, category: Category.RETURN };
    } else {
      console.log(chalk.redBright(JSON.stringify(relatedAllegroDeals)));
    }
  }
  return operation;
};

(async () => {
  const allegroDealsByDate = await readAllegroDeals();

  for (const source of SOURCES) {
    const operationsFromCurrentOutputFile = await readOutputData(source);

    const operationsAfterUpdate = operationsFromCurrentOutputFile?.map(
      (operation) => applyAllegroDealToOperation(operation, allegroDealsByDate)
    );

    // const operationsAfterUpdate =
    //   operationsFromCurrentOutputFile?.map((operation) => {
    //     if (operation.category !== Category.UNCATEGORIZED) return operation;
    //     const suggestedCategory = getSuggestion(
    //       operation,
    //       categorySuggestionMatch
    //     );
    //     const suggestedCategoryLog =
    //       (operation.category && chalk.green(operation.category)) ||
    //       (suggestedCategory && chalk.blue(suggestedCategory)) ||
    //       chalk.red(suggestedCategory);
    //     console.log(operationToString(operation), " | ", suggestedCategoryLog);
    //     return { ...operation, category: suggestedCategory };
    //   }) || [];
    // await saveJsonToFile(operationsAfterUpdate, `output/${source}.json`);
  }
  // await saveJsonToFile(
  //   await concatOperations(SOURCES),
  //   `output/all-operations.json`
  // );
})();
