#! ./node_modules/.bin/ts-node

import { $, chalk } from "zx";
import { CategorySuggestionMatch, Source, SOURCES } from "@home-finance/shared";
import {
  concatOperations,
  getSuggestion,
  operationToString,
  readOutputData,
} from "./src/utils";
import { readJsonFile, saveJsonToFile } from "@home-finance/fs-utils";

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
        if (operation.category) return operation;
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
