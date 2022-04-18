#! ./node_modules/.bin/ts-node

import { $, chalk } from "zx";
import {
  Category,
  CategorySuggestionMatch,
  SOURCES,
} from "@home-finance/shared";
import { getSuggestion, operationToString } from "./src/utils";
import {
  concatOperations,
  readJsonFile,
  readOutputData,
  saveJsonToFile,
} from "@home-finance/fs-utils";

$.verbose = false;

(async () => {
  const categorySuggestionMatch =
    (await readJsonFile<CategorySuggestionMatch>(
      "output/category-match.json"
    )) || ({} as CategorySuggestionMatch);

  for (const source of SOURCES) {
    const operationsFromCurrentOutputFile = await readOutputData(source);
    const operationsAfterUpdate =
      operationsFromCurrentOutputFile?.map((operation) => {
        if (operation.category !== Category.UNCATEGORIZED) return operation;
        const suggestedCategory = getSuggestion(
          operation,
          categorySuggestionMatch
        );
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
