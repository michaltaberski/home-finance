import { first, groupBy, last, sortBy, truncate } from "lodash";
import { SOURCES } from "./const";
import { Category, Operation, OperationType, Source } from "./types";
import { format } from "date-fns";

export const roundNumber = (num: number) => Math.round(num * 100) / 100;

export const getEnumKeys = <T>(anyEnum: any): T[] => {
  return Object.values(anyEnum);
};

export type OperationsStatistics = {
  operationsCount: number;
  newest: Operation | null;
  oldest: Operation | null;
  operationsWithoutCategoryCount: number;
};

export const sortOperationsByDate = (operations: Operation[]) =>
  sortBy(operations, "date").reverse();

export const getOperationsStatistics = (
  operations: Operation[]
): OperationsStatistics => {
  const sortedOperations = sortOperationsByDate(operations);
  const operationsWithoutCategory = sortedOperations.filter(
    ({ category }) => category === Category.UNCATEGORIZED
  );
  const newest = first(sortedOperations) || null;
  const oldest = last(sortedOperations) || null;
  return {
    operationsCount: sortedOperations.length,
    operationsWithoutCategoryCount: operationsWithoutCategory.length,
    newest,
    oldest,
  };
};

export const getStatisticsBySource = (
  operations: Operation[]
): Record<Source, OperationsStatistics> => {
  const groupedBySource = groupBy(operations, "source");
  return SOURCES.reduce(
    (acc, source) => ({
      ...acc,
      [source]: getOperationsStatistics(groupedBySource[source] || []),
    }),
    {} as Record<Source, OperationsStatistics>
  );
};

// 2022-04-08 or 2022-04
export const formatDate = (date?: string) => {
  if (!date) return "-";
  try {
    const [year, month, day = 0] = (date.split("-") || []).map((v) =>
      parseInt(v)
    );
    const monthIndex = month - 1;
    if (day === 0) {
      return format(new Date(year, monthIndex), "MMM yyyy");
    }
    return format(new Date(year, monthIndex, day || undefined), "d MMM yyyy");
  } catch (error) {
    return "Error!";
  }
};

export const formatInt = (number?: number | string) => {
  if (!number) return "-";
  return parseInt("" + number).toLocaleString();
};

export const formatDecimal = (number?: number | string) => {
  if (!number) return "-";
  return parseFloat("" + number).toLocaleString(
    // leave undefined to use the visitor's browser
    // locale or a string like 'en-US' to override it.
    undefined,
    { minimumFractionDigits: 2 }
  );
};

export const formatCurrency = (number?: number | string) =>
  formatDecimal(number) + " zł";

export const getOeprationType = (amount: number) =>
  amount > 0 ? OperationType.INCOME : OperationType.EXPENSE;

export const sanitzeString = (anyString: string) =>
  anyString
    .replace(/\s+/g, " ")
    .replace("ĽCY", "ĄCY")
    .replace("RODKÓW", "ŚRODKÓW")
    .replace("PŁATNOĆ", "PŁATNOŚĆ")
    .replace("URZĽD", "URZĄD");

export const sanitizeTitle = (anyString: string) =>
  truncate(sanitzeString(anyString), { length: 50 });
