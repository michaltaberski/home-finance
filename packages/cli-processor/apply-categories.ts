#! ./node_modules/.bin/ts-node

import { $, chalk } from "zx";
import { Operation, SOURCES, toLabel } from "@home-finance/shared";
import { concatOperations, readOutputData } from "./src/utils";
import { categorySuggestion } from "./src/filterUtils";
import { saveJsonToFile } from "@home-finance/fs-utils";

$.verbose = false;

const operationToString = ({ source, description, amount }: Operation) =>
  [toLabel(source), description, amount].join(" | ");

(async () => {
  for (const source of SOURCES) {
    const operationsFromCurrentOutputFile = await readOutputData(source);
    const operationsAfterUpdate =
      operationsFromCurrentOutputFile?.map((operation) => {
        if (operation.category) return operation;
        const suggestedCategory = categorySuggestion(operation, source);
        const suggestedCategoryLog =
          (operation.category && chalk.green(operation.category)) ||
          (suggestedCategory && chalk.blue(suggestedCategory)) ||
          chalk.red(suggestedCategory);
        console.log(operationToString(operation), " | ", suggestedCategoryLog);
        return { ...operation, category: suggestedCategory };
      }) || [];
    await saveJsonToFile(operationsAfterUpdate, `output/${source}.json`);
  }
  await saveJsonToFile(
    await concatOperations(SOURCES),
    `output/all-operations.json`
  );
})();
