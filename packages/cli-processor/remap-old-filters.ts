#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import {
  AutoConfigRule,
  Category,
  CategorySuggestionMatch,
  Operation,
} from "@home-finance/shared";
import { readJsonFile, saveJsonToFile } from "@home-finance/fs-utils";

$.verbose = false;

(async () => {
  const categorySuggestionMatch =
    (await readJsonFile<CategorySuggestionMatch>(
      "output/category-match.json"
    )) || ({} as CategorySuggestionMatch);

  const autoConfigRules: AutoConfigRule[] = [];
  Object.entries(categorySuggestionMatch).forEach(([cat, phrases]) => {
    const category = cat as Category;
    phrases.forEach((phrase) => {
      autoConfigRules.push({
        rules: { matchPhrase: phrase },
        applyProps: { category },
      });
    });
  });

  await saveJsonToFile(autoConfigRules, "output/new-category-match.json");
})();
