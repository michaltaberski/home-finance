import { first, groupBy, last, sortBy } from "lodash";
import { SOURCES } from "./const";
import { Operation, Source } from "./types";

export const roundNumber = (num: number) => Math.round(num * 100) / 100;

export const getEnumKeys = <T>(anyEnum: any): T[] => {
  return Object.values(anyEnum);
};

export type OperationsStatistics = {
  operationsCount: number;
  newest: Operation | null;
  oldest: Operation | null;
};

export const getOperationsStatistics = (
  operations: Operation[]
): OperationsStatistics => {
  const sortedOperations = sortBy(operations, "date").reverse();
  const newest = first(sortedOperations) || null;
  const oldest = last(sortedOperations) || null;
  return { operationsCount: sortedOperations.length, newest, oldest };
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
