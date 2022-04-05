import { $ } from "zx";
import { getOperationsFromInteligoXmlFile } from "./inteligoUtils";
import * as inquirer from "inquirer";
import { keyBy, sortBy } from "lodash";
import { revoultCsvRowToOperation } from "./revolutUtils";
import { getRowsFromCsvFile } from "./csvUtils";
import { santanderBankCsvRowToOperation } from "./santanderBankUtils";
import { santanderCreditCardCsvRowToOperation } from "./santanderCreditCardUtils";
import { categorySuggestion } from "./filterUtils";
// import allegroTransactions from "../output-data/allegro-by-day.json";
import {
  CATEGORY_TO_LABEL_MAP,
  EXPENSE_CATGORIES,
  INCOME_CATEGORIES,
  LABEL_TO_CATEGORY_MAP,
  Category,
  ExcludeFalsy,
  Operation,
  OutputData,
  Source,
  readTextFile,
  saveTextToFile,
} from "@home-finance/shared";

const getAllegroTransactionsByDay = (date: string) => {
  console.log("FIXME");
  return [];
  // return allegroTransactions[date];
};

export const selectCategoryForOperation = async (
  operation: Operation,
  source: Source
): Promise<Operation> => {
  // SKIP
  if (operation.category) return operation;
  // SUGGESTION SELECTED
  const suggestedCategory = categorySuggestion(operation, source);
  if (suggestedCategory) {
    console.log("Suggested category assigned: ", suggestedCategory);
    return { ...operation, category: suggestedCategory };
  }

  const CATEGORIES =
    operation.amount > 0 ? INCOME_CATEGORIES : EXPENSE_CATGORIES;
  const categoryLabel = (
    await inquirer.prompt([
      {
        type: "list",
        name: "category",
        message: [
          `${operation.date}: ${operation.otherSide}: ${operation.description} (${operation.amount})`,
          ...(operation.description.toLowerCase().match("allegro")
            ? [
                "------- Allegro from that day -------",
                JSON.stringify(
                  getAllegroTransactionsByDay(operation.date),
                  null,
                  2
                ),
                "",
              ]
            : []),
        ].join("\n"),

        choices: [
          "---",
          ...CATEGORIES.map((category) => CATEGORY_TO_LABEL_MAP[category]),
        ],
        filter: (val) => val.toLowerCase(),
      },
    ])
  ).category;
  return {
    ...operation,
    category:
      categoryLabel === "---"
        ? null
        : (LABEL_TO_CATEGORY_MAP[categoryLabel] as Category),
  };
};

export const getFilesListBySource = async (source: Source) =>
  (await $`ls input-data/${source}`).stdout
    .trim()
    .split("/n")
    .map((fileName) => `./input-data/${source}/${fileName}`);

/**
 * Process command args to object eg
 * --app-name=ardoq=front to `{ 'app-name': 'ardoq-front' }
 */
export const getCliArgs = (): { [argKey: string]: string } => {
  return Object.fromEntries(
    process.argv
      .map((arg) => {
        const [, key, value] = arg.match(/--([a-z-]+)=(.+)/) || [];
        if (key) return [key, value];
        return null;
      })
      .filter(ExcludeFalsy)
  );
};

export const getOperationsFromFile = async (
  filePath: string,
  source: Source
) => {
  if (source === Source.INTELIGO)
    return getOperationsFromInteligoXmlFile(filePath);
  if (source === Source.REVOLUT)
    return getRowsFromCsvFile(filePath, revoultCsvRowToOperation);
  if (source === Source.SANTANDER_BANK)
    return getRowsFromCsvFile(filePath, santanderBankCsvRowToOperation);
  if (source === Source.SANTANDER_CREDIT_CARD)
    return getRowsFromCsvFile(filePath, santanderCreditCardCsvRowToOperation, [
      "dataKsiegowania",
      "dataTransakcji",
      "tytulOperacji",
      "x1",
      "x2",
      "kwota",
      "x3",
      "id",
      "x4",
    ]);
  return [];
};

export const readOutputData = async (
  source: Source
): Promise<null | OutputData> => {
  const textContent = await readTextFile(`output/${source}.json`);
  return JSON.parse(textContent);
};

const sortOperations = (operations: Operation[], _source: Source) => {
  return sortBy(operations, ({ id }) => parseInt(id)).reverse();
};

type ProcessInputDataOptions = {
  skipCategoryPrompt?: boolean;
};
export const processInputDataBySource = async (
  source: Source,
  options?: ProcessInputDataOptions
): Promise<OutputData> => {
  const { skipCategoryPrompt = false } = options || {};
  const operations: Operation[] = [];
  const fileList = await getFilesListBySource(source);
  const currentData = await readOutputData(source);
  const currentOperations = currentData
    ? keyBy(currentData.operations, ({ id }) => id)
    : {};

  for (const filePath of fileList) {
    const rawOperations = await getOperationsFromFile(filePath, source);
    for (const operation of rawOperations) {
      const { id } = operation;
      if (currentOperations[id]) {
        currentOperations[id];
        operations.push(
          skipCategoryPrompt
            ? currentOperations[id]
            : await selectCategoryForOperation(currentOperations[id], source)
        );
      } else {
        if (!skipCategoryPrompt) {
          console.log(
            `${operation.source} (${operation.date}): ${operation.description}: ${operation.amount}zł`
          );
        }
        operations.push(
          skipCategoryPrompt
            ? operation
            : await selectCategoryForOperation(operation, source)
        );
      }
    }
  }
  const sortedOperations = sortOperations(operations, source);
  const lastOperation = sortedOperations[0];
  return {
    lastUpdate: new Date().toISOString(),
    lastOperationAt: lastOperation.date,
    currentBalance: lastOperation.balanceAfterOperation,
    operations: sortedOperations,
  };
};
