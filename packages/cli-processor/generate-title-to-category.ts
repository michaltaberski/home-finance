#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import {
  CATEGORIES,
  CategorySuggestionMatch,
  Operation,
} from "@home-finance/shared";
import { readJsonFile, saveJsonToFile } from "@home-finance/fs-utils";
import { getSuggestion, operationToString } from "./src/utils";

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

  allOperations.forEach((operation) => {
    if (getSuggestion(operation, categorySuggestionMatch)) {
      console.log(operationToString(operation));
    }
  });

  await saveJsonToFile(categorySuggestionMatch, "output/category-match.json");
})();
