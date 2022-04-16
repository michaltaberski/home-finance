import {
  FilterProps,
  Operation,
  OperationType,
  sleep,
} from "@home-finance/shared";
import create from "zustand";

type State = {
  isLoadingOperations: boolean;
  operations: Operation[];
  filterProps: FilterProps;
};

type Actions = {
  updateFilters: (changes: Partial<FilterProps>) => void;
  loadOperations: VoidFunction;
};

const deafultState: State = {
  isLoadingOperations: false,
  operations: [],
  filterProps: {
    operationType: OperationType.EXPENSE,
    includeInternalTransfers: false,
    currentPage: 0,
    perPage: 10,
    searchPhrase: "",
    amount: { from: null, to: null },
    date: { from: "2022-01", to: "2022-03" },
    sortBy: "date",
    sortOrder: undefined,
    source: null,
    category: null,
  },
};

export const useStore = create<State & Actions>((set) => ({
  ...deafultState,
  async loadOperations() {
    set((state) => ({ ...state, isLoadingOperations: true }));
    const response = await fetch("http://localhost:8000/all-operations");
    const operations: Operation[] = await response.json();
    await sleep(200);
    set((state) => ({ ...state, operations, isLoadingOperations: false }));
  },
  updateFilters(changes: Partial<FilterProps>) {
    set((state) => ({
      ...state,
      filterProps: { ...state.filterProps, ...changes },
    }));
  },
}));
