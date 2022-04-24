#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { AutoConfigRule, Operation, SOURCES } from "@home-finance/shared";
import {
  concatOperations,
  readJsonFile,
  readOutputData,
  saveJsonToFile,
} from "@home-finance/fs-utils";

$.verbose = false;

const findConfigRule = (
  operation: Operation,
  autoConfigRules: AutoConfigRule[]
): AutoConfigRule | null =>
  autoConfigRules.find((configRule) => {
    return (
      configRule.rules.matchPhrase &&
      [operation.title, operation.description]
        .join(" ")
        .toLowerCase()
        .includes(configRule.rules.matchPhrase.toLowerCase())
    );
  }) || null;

(async () => {
  const autoConfigRules =
    (await readJsonFile<AutoConfigRule[]>("output/new-category-match.json")) ||
    [];

  for (const source of SOURCES) {
    const operationsFromCurrentOutputFile = await readOutputData(source);
    const operationsAfterUpdate =
      operationsFromCurrentOutputFile?.map((operation) => {
        const configRule = findConfigRule(operation, autoConfigRules);
        if (!configRule) return operation;
        return { ...operation, ...configRule.applyProps };
      }) || [];
    await saveJsonToFile(operationsAfterUpdate, `output/${source}.json`);
  }
  await saveJsonToFile(
    await concatOperations(SOURCES),
    `output/all-operations.json`
  );
})();
