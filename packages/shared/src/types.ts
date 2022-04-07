// Utility function for .filter(Boolean)
// https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean
export const ExcludeFalsy = Boolean as any as <T>(
  x: T | false | null | undefined | ""
) => x is T;

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export enum Source {
  REVOLUT = "revolut",
  INTELIGO = "inteligo",
  ING = "ing",
  SANTANDER_BANK = "santander-bank",
  SANTANDER_CREDIT_CARD = "santander-credit-card",
  MBANK_PRIVATE = "mbank-private",
  MBANK_COMPANY = "mbank-company",
}

export enum Category {
  INTERNAL_MONEY_TRANSFER = "internal-money-transfer",
  OTHER = "other",
  TAX = "tax",
  NOBILIT = "nobilit",
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
  // ---
  RETURN = "return",
  WORK_INCOME = "work-income",
  OTHER_INCOME = "other-income",
}

export type Operation = {
  id: string;
  date: string;
  source: Source;
  amount: number;
  description: string;
  otherSide: string | null;
  category: Category | null;
  balanceAfterOperation: number;
};

export type FilterProps = {
  includeInternalTransfers: boolean;
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
