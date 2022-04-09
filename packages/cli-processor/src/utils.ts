import { $ } from "zx";
import { getOperationsFromInteligoXmlFile } from "./inteligoUtils";
import * as inquirer from "inquirer";
import { keyBy, sortBy } from "lodash";
import { revoultCsvRowToOperation } from "./revolutUtils";
import { getRowsFromCsvFile } from "./csvUtils";
import {
  santanderBankCsvRowToOperation,
  santanderCreditCardCsvRowToOperation,
} from "./santanderUtils";
import { getMBankCsvRowToOperation } from "./mBankUtils";
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
  Source,
  toLabel,
  sanitizeTitle,
  CategorySuggestionMatch,
  formatCurrency,
} from "@home-finance/shared";
import { getDataPath, readTextFile } from "@home-finance/fs-utils";
import { ingCsvRowToOperation } from "./ingUtils";

const getAllegroTransactionsByDay = (date: string) => {
  console.log("FIXME");
  return [];
  // return allegroTransactions[date];
};

export const selectCategoryPrompt = async (
  operation: Operation
): Promise<Category | null> => {
  const CATEGORIES =
    operation.amount > 0 ? INCOME_CATEGORIES : EXPENSE_CATGORIES;
  const categoryLabel = (
    await inquirer.prompt([
      {
        type: "list",
        name: "category",
        message: [
          operationToString(operation),
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
  return categoryLabel === "---"
    ? null
    : (LABEL_TO_CATEGORY_MAP[categoryLabel] as Category);
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
  (await $`ls ${getDataPath(`input/${source}`)}`).stdout
    .trim()
    .split("\n")
    .map((fileName) => getDataPath(`input/${source}/${fileName}`));

/**
 * Process command args to object eg
 * --app-name=ardoq=front to `{ 'app-name': 'ardoq-front' }
 */
export const getCliArgs = (): { [argKey: string]: string } => {
  return Object.fromEntries(
    process.argv
      .map((arg) => {
        const [, key, value] = arg.match(/--([a-z-]+)=?(.+)?/) || [];
        if (key) return [key, value || true];
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
    return getRowsFromCsvFile(filePath, santanderBankCsvRowToOperation, [
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
  if (
    [Source.MBANK_ANETA, Source.MBANK_MICHAL, Source.MBANK_PROACTIVUS].includes(
      source
    )
  )
    return getRowsFromCsvFile(filePath, getMBankCsvRowToOperation(source), {
      mapHeaders: ({ index }) =>
        "date, description, account, _cat, amountString".split(", ")[index],
      separator: ";",
      skipLines: 25,
    });
  if (source === Source.ING) {
    const KEYS = [
      "dataTransakcji",
      "dataKsiegowania",
      "daneKontrahenta",
      "tytul",
      "nrRachunku",
      "nazwaBanku",
      "szczegoly",
      "nrTransakcji",
      "kwotaTransakcji",
      "walutaTransakcji",
      "kwotaBlokady",
      "walutaBlokady",
      "kwotaPlatnosci",
      "walutaPlatnosci",
      "saldoPoTransakcji",
      "walutaSalda",
    ];
    return getRowsFromCsvFile(filePath, ingCsvRowToOperation, {
      mapHeaders: ({ index }) => KEYS[index],
      separator: ";",
      skipLines: 19,
    });
  }

  return [];
};

export const readJsonFile = async <T>(path: string): Promise<null | T> => {
  const textContent = await readTextFile(path);
  return JSON.parse(textContent);
};

export const readOutputData = async (
  source: Source
): Promise<null | Operation[]> =>
  readJsonFile<Operation[]>(`output/${source}.json`);

const sortOperations = (operations: Operation[], _source: Source) => {
  return sortBy(operations, ({ id }) => parseInt(id)).reverse();
};

type ProcessInputDataOptions = {
  overwrite?: boolean;
  skipCategoryPrompt?: boolean;
};

export const processInputDataBySource = async (
  source: Source,
  options?: ProcessInputDataOptions
): Promise<Operation[]> => {
  const { skipCategoryPrompt = true, overwrite = false } = options || {};
  const operations: Operation[] = [];
  const fileList = await getFilesListBySource(source);
  const operationsFromCurrentOutputFile = await readOutputData(source);
  const currentOperations = keyBy(
    operationsFromCurrentOutputFile || [],
    ({ id }) => id
  );

  for (const filePath of fileList) {
    const rawOperations = await getOperationsFromFile(filePath, source);
    for (const operation of rawOperations) {
      const { id } = operation;
      if (!overwrite && currentOperations[id]) {
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
  return sortOperations(operations, source);
};

export const concatOperations = async (sources: Source[]) => {
  const bySourceOutputs = await (
    await Promise.all(sources.map((source) => readOutputData(source)))
  ).filter(ExcludeFalsy);
  const allOperations = bySourceOutputs.reduce<Operation[]>(
    (acc, operations) => [...acc, ...operations],
    []
  );
  return sortBy(allOperations, "date").reverse();
};

export const operationToString = ({
  source,
  description,
  amount,
  category,
}: Operation) =>
  [
    toLabel(source),
    sanitizeTitle(description),
    formatCurrency(amount),
    category || "---",
  ].join(" | ");

export const getSuggestion = (
  operation: Operation,
  suggestionMatch: CategorySuggestionMatch
): Category | null => {
  const [category] =
    Object.entries(suggestionMatch).find(([category, suggestions]) => {
      return suggestions.find(
        (suggestion) => operation.title.indexOf(suggestion) !== -1
      );
    }) || [];
  return (category as Category) || null;
};
