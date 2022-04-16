import { Operation, sortOperationsByDate } from "@home-finance/shared";
import { findIndex } from "lodash";

export const updateOrCreate = (
  operation: Operation,
  operations: Operation[]
) => {
  const outputOperations = [...operations];
  const operationIndex = findIndex(operations, ({ id }) => operation.id === id);
  if (operationIndex === -1) {
    outputOperations.push(operation);
  } else {
    outputOperations[operationIndex] = operation;
  }
  return sortOperationsByDate(outputOperations);
};
