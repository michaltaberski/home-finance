// Utility function for .filter(Boolean)
// https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean
export const ExcludeFalsy = Boolean as any as <T>(
  x: T | false | null | undefined | ""
) => x is T;

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export enum Source {
  ING = "ing",
  REVOLUT = "revolut",
  INTELIGO = "inteligo",
  SANTANDER_BANK = "santander-bank",
  SANTANDER_CREDIT_CARD = "santander-credit-card",
  MBANK_MICHAL = "mbank-michal",
  MBANK_ANETA = "mbank-aneta",
  MBANK_PROACTIVUS = "mbank-proactivus",
  CASH = "cash",
}

export enum Category {
  INTERNAL_MONEY_TRANSFER = "internal-money-transfer",
  OTHER_EXPENSE = "other-expense",
  TAX = "tax",
  NOBILIT = "nobilit",
  CASH_WITHDRAW = "cash-withdrawal",
  // ---
  FOOD = "food",
  DINING_OUT = "dining-out",
  KIDS = "kids",
  HOUSEHOLD = "household",
  HOME = "home",
  UTILITY_BILL = "utility-bill",
  CAR = "car",
  ENTERTAINMENT = "entertainment",
  GADGET = "gadget",
  CLOTHES = "clothes",
  HEALTH_AND_BEAUTY = "health-and-beauty",
  TRAVEL_AND_LEISURE = "travel-and-leisure",
  PRESENTS_AND_CHARITY = "presents-and-charity",
  BOOKS_AND_EDUCATION = "books-and-education",
  MORTAGE = "mortage",
  // ---
  RETURN = "return",
  WORK_INCOME = "work-income",
  OTHER_INCOME = "other-income",
  UNCATEGORIZED = "uncategorized",
}

export enum OperationType {
  INCOME = "income",
  EXPENSE = "expense",
}

export type Operation = {
  id: string;
  date: string;
  source: Source;
  amount: number;
  type: OperationType;
  title: string;
  description: string;
  otherSide: string | null;
  category: Category;
  balanceAfterOperation: number;
};

export type FilterProps = {
  includeInternalTransfers: boolean;
  operationType: OperationType;
  perPage: number;
  currentPage: number;
  searchPhrase: string;
  amount: { from: number | null; to: number | null };
  date: { from: string | null; to: string | null };
  sortBy: keyof Operation;
  sortOrder: "ascend" | "descend" | undefined;
  source: null | Source[];
  category: null | Category[];
};

export type CategorySuggestionMatch = Record<Category, string[]>;
