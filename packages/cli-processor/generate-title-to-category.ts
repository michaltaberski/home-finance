#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import {
  CATEGORIES,
  CategorySuggestionMatch,
  Operation,
} from "@home-finance/shared";
import { readJsonFile, saveJsonToFile } from "@home-finance/fs-utils";
import {
  getSuggestion,
  operationToString,
  selectCategoryForOperation,
  selectCategoryPrompt,
} from "./src/utils";

$.verbose = false;

(async () => {
  const allOperations =
    (await readJsonFile<Operation[]>(`output/all-operations.json`)) || [];

  const categorySuggestionMatch =
    (await readJsonFile<CategorySuggestionMatch>(
      "output/category-match.json"
    )) || ({} as CategorySuggestionMatch);

  CATEGORIES.forEach((category) => {
    categorySuggestionMatch[category] ||= [];
  });

  for (const operation of allOperations) {
    if (getSuggestion(operation, categorySuggestionMatch)) {
      console.log(operationToString(operation));
    } else {
      const category = await selectCategoryPrompt(operation);
      if (category) {
        categorySuggestionMatch[category].push(operation.title);
        await saveJsonToFile(
          categorySuggestionMatch,
          "output/category-match.json"
        );
      }
    }
  }

  await saveJsonToFile(categorySuggestionMatch, "output/category-match.json");
})();
