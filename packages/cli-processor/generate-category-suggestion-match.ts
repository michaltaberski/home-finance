#! ./node_modules/.bin/ts-node

import { $, chalk } from "zx";
import {
  CATEGORIES,
  CategorySuggestionMatch,
  Operation,
} from "@home-finance/shared";
import { readJsonFile, saveJsonToFile } from "@home-finance/fs-utils";
import { getSuggestion, selectCategoryPrompt } from "./src/utils";

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
    if (operation.title.toLowerCase().indexOf("allegro") !== -1) {
      console.log(chalk.yellow("SKIP (Allegro)"));
    } else if (getSuggestion(operation, categorySuggestionMatch)) {
      console.log(chalk.green("DONE"));
    } else {
      const category = await selectCategoryPrompt(operation);
      if (category) {
        categorySuggestionMatch[category].push(operation.title.toLowerCase());
        await saveJsonToFile(
          categorySuggestionMatch,
          "output/category-match.json"
        );
      }
    }
  }

  await saveJsonToFile(categorySuggestionMatch, "output/category-match.json");
})();
