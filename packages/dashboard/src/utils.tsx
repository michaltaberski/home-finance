import {
  Category,
  FilterProps,
  Operation,
  roundNumber,
} from "@home-finance/shared";
import { groupBy } from "lodash";

export const filterOperations = (
  operations: Operation[],
  filters: FilterProps
) => {
  const { includeInternalTransfers } = filters;
  const categoryFilter = (operation: Operation) => {
    if (
      !includeInternalTransfers &&
      operation.category === Category.INTERNAL_MONEY_TRANSFER
    ) {
      return false;
    }
    if (!filters.category) return true;
    if (!operation.category) return false;
    return filters.category.includes(operation.category);
  };
  const sourceFilter = (operation: Operation) => {
    if (!filters.source) return true;
    return filters.source.includes(operation.source);
  };

  const sorter = (a: Operation, b: Operation) => {
    const { sortBy, sortOrder } = filters;
    const isAsc = sortOrder === "ascend";
    if (!sortOrder) return 0;
    if (!sortBy) return 0;
    if ((a[sortBy] || "") > (b[sortBy] || "")) return isAsc ? 1 : -1;
    if ((a[sortBy] || "") < (b[sortBy] || "")) return isAsc ? -1 : 1;
    return 0;
  };
  return operations.filter(categoryFilter).filter(sourceFilter).sort(sorter);
};

export const groupOperationsByMonth = (operations: Operation[]) => {
  return groupBy(operations, ({ date }) => date.substring(0, 7));
};

export const groupOperationsByCategory = (operations: Operation[]) => {
  return groupBy(operations, "category");
};

export type SquashedOperations = {
  expensesAmount: number;
  incomeAmount: number;
  balance: number;
  operationsCount: number;
};

export const squashOperations = (operations: Operation[]): SquashedOperations =>
  operations.reduce<SquashedOperations>(
    (acc, operation) => ({
      operationsCount: acc.operationsCount + 1,
      balance: roundNumber(acc.balance + operation.amount),
      incomeAmount: roundNumber(
        acc.incomeAmount + Math.max(0, operation.amount)
      ),
      expensesAmount: roundNumber(
        acc.expensesAmount + Math.min(0, operation.amount)
      ),
    }),
    {
      expensesAmount: 0,
      incomeAmount: 0,
      balance: 0,
      operationsCount: 0,
    }
  );
