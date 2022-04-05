import { FilterProps } from "@home-finance/shared";
import create from "zustand";

type State = {
  filterProps: FilterProps;
};

type Actions = {
  updateFilters: (changes: Partial<FilterProps>) => void;
};

const deafultState: State = {
  filterProps: {
    includeInternalTransfers: false,
    currentPage: 0,
    perPage: 10,
    searchPhrase: "",
    amount: { from: null, to: null },
    date: { from: null, to: null },
    sortBy: "date",
    sortOrder: undefined,
    source: null,
    category: null,
  },
};

export const useStore = create<State & Actions>((set) => ({
  ...deafultState,
  updateFilters(changes: Partial<FilterProps>) {
    set((state) => ({
      ...state,
      filterProps: { ...state.filterProps, ...changes },
    }));
  },
}));
