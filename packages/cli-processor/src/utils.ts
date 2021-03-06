import { $ } from "zx";
import { getOperationsFromInteligoXmlFile } from "./inteligoUtils";
import { keyBy, map, sortBy, uniqBy } from "lodash";
import { revoultCsvRowToOperation } from "./revolutUtils";
import { getRowsFromCsvFile } from "./csvUtils";
import {
  santanderBankCsvRowToOperation,
  santanderCreditCardCsvRowToOperation,
} from "./santanderUtils";
import { getMBankCsvRowToOperation } from "./mBankUtils";

// import allegroTransactions from "../output-data/allegro-by-day.json";
import {
  Category,
  ExcludeFalsy,
  Operation,
  Source,
  toLabel,
  sanitizeTitle,
  CategorySuggestionMatch,
  formatCurrency,
  sanitzeString,
  INCOME_CATEGORIES,
  EXPENSE_CATGORIES,
  CATEGORY_TO_LABEL_MAP,
  LABEL_TO_CATEGORY_MAP,
} from "@home-finance/shared";
import {
  getDataPath,
  readOutputData,
  readTextFile,
} from "@home-finance/fs-utils";
import { ingCsvRowToOperation } from "./ingUtils";
import inquirer from "inquirer";

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
  const { overwrite = false } = options || {};
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
      const operationToAdd =
        !overwrite && currentOperations[id] ? currentOperations[id] : operation;
      operations.push(operationToAdd);
    }
  }
  return sortOperations(
    uniqBy(operations, ({ id }) => id),
    source
  );
};

export const operationToString = ({
  date,
  source,
  description,
  amount,
  category,
  otherSide,
}: Operation) =>
  [
    date,
    toLabel(source),
    sanitizeTitle(description),
    sanitzeString(otherSide || ""),
    formatCurrency(amount),
    category || "---",
  ].join(" | ");

export const getSuggestion = (
  operation: Operation,
  suggestionMatch: CategorySuggestionMatch
): Category => {
  const [category] =
    Object.entries(suggestionMatch).find(([_category, suggestions]) => {
      return suggestions.find((suggestion) => {
        // console.log(
        //   chalk.redBright(
        //     [operation.title, operation.otherSide, operation.description].join(
        //       " "
        //     )
        //   )
        // );
        // console.log(chalk.greenBright(suggestion.toLowerCase()));
        // console.log(
        //   [operation.title, operation.otherSide, operation.description]
        //     .join(" ")
        //     .toLowerCase()
        //     .indexOf(suggestion.toLowerCase()) !== -1
        // );

        return (
          [operation.title, operation.otherSide, operation.description]
            .join(" ")
            .toLowerCase()
            .indexOf(suggestion.toLowerCase()) !== -1
        );
      });
    }) || [];
  return (category as Category) || Category.UNCATEGORIZED;
};

export const selectCategoryPrompt = async (
  operation: Operation
): Promise<Category> => {
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
  return (
    (LABEL_TO_CATEGORY_MAP[categoryLabel] as Category) || Category.UNCATEGORIZED
  );
};
function getAllegroTransactionsByDay(date: string): any {
  throw new Error("Function not implemented.");
}
