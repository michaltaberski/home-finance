import { Category, Source } from "./types";
import { invert, mapValues, sortBy, without } from "lodash";
import { getEnumKeys } from "./utils";

const sortByLabelMap = <T extends string | number | symbol>(
  data: T[],
  labelMap: Record<T, string>
) => sortBy(data, (dataItem) => labelMap[dataItem]);

export const SOURCE_TO_LABEL_MAP: Record<Source, string> = {
  [Source.ING]: "ING",
  [Source.INTELIGO]: "Inteligo",
  [Source.MBANK_PROACTIVUS]: "mBank (Proactivus)",
  [Source.MBANK_MICHAL]: "mBank (Michał)",
  [Source.MBANK_ANETA]: "mBank (Aneta)",
  [Source.CASH]: "Gotówka",
  [Source.REVOLUT]: "Revolut",
  [Source.SANTANDER_BANK]: "Santander",
  [Source.SANTANDER_CREDIT_CARD]: "Santander (karta kredytowa)",
};

export const CATEGORY_TO_LABEL_MAP: Record<Category, string> = {
  [Category.WORK_INCOME]: "Dochód z pracy",
  [Category.HOME]: "Dom (budowa)",
  [Category.HOUSEHOLD]: "Dom (utrzymanie)",
  [Category.KIDS]: "Dzieci",
  [Category.BOOKS_AND_EDUCATION]: "Edukacja i ksiązki",
  [Category.OTHER_EXPENSE]: "Inne wydatki",
  [Category.OTHER_INCOME]: "Inny dochód",
  [Category.FOOD]: "Jedzenie",
  [Category.DINING_OUT]: "Jedzenie na mieście",
  [Category.MORTAGE]: "Kredyt hipoteczny",
  [Category.UTILITY_BILL]: "Media",
  [Category.INTERNAL_MONEY_TRANSFER]: "Przelew własny",
  [Category.CAR]: "Samochód",
  [Category.ENTERTAINMENT]: "Rozrywka",
  [Category.GADGET]: "Pierdoły i gadzety",
  [Category.CLOTHES]: "Odziez",
  [Category.HEALTH_AND_BEAUTY]: "Zdrowie i uroda",
  [Category.TRAVEL_AND_LEISURE]: "Podróze i wypoczynek",
  [Category.PRESENTS_AND_CHARITY]: "Prezenty i pomoc",
  [Category.TAX]: "Podatek",
  [Category.RETURN]: "Zwrot",
  [Category.NOBILIT]: "Nobilit",
  [Category.CASH_WITHDRAW]: "Wypłata gotówki",
};

export const CATEGORY_TO_TYPE: Record<Category, "income" | "expense" | null> = {
  [Category.WORK_INCOME]: "income",
  [Category.OTHER_INCOME]: "income",
  [Category.HOME]: "expense",
  [Category.HOUSEHOLD]: "expense",
  [Category.KIDS]: "expense",
  [Category.BOOKS_AND_EDUCATION]: "expense",
  [Category.OTHER_EXPENSE]: "expense",
  [Category.FOOD]: "expense",
  [Category.DINING_OUT]: "expense",
  [Category.MORTAGE]: "expense",
  [Category.UTILITY_BILL]: "expense",
  [Category.INTERNAL_MONEY_TRANSFER]: null,
  [Category.CAR]: "expense",
  [Category.ENTERTAINMENT]: "expense",
  [Category.GADGET]: "expense",
  [Category.CLOTHES]: "expense",
  [Category.HEALTH_AND_BEAUTY]: "expense",
  [Category.TRAVEL_AND_LEISURE]: "expense",
  [Category.PRESENTS_AND_CHARITY]: "expense",
  [Category.TAX]: "expense",
  [Category.RETURN]: "income",
  [Category.NOBILIT]: null,
  [Category.CASH_WITHDRAW]: "expense",
};

export const ALL_CATEGORIES = sortByLabelMap(
  getEnumKeys<Category>(Category),
  CATEGORY_TO_LABEL_MAP
);

export const EXPENSE_CATGORIES = sortByLabelMap(
  [
    Category.FOOD,
    Category.DINING_OUT,
    Category.HOUSEHOLD,
    Category.KIDS,
    Category.UTILITY_BILL,
    Category.CAR,
    Category.CLOTHES,
    Category.ENTERTAINMENT,
    Category.GADGET,
    Category.HEALTH_AND_BEAUTY,
    Category.OTHER_EXPENSE,
    Category.HOME,
    Category.TRAVEL_AND_LEISURE,
    Category.PRESENTS_AND_CHARITY,
    Category.TAX,
    Category.NOBILIT,
    Category.BOOKS_AND_EDUCATION,
    Category.CASH_WITHDRAW,
    Category.MORTAGE,
  ],
  CATEGORY_TO_LABEL_MAP
);

export const INCOME_CATEGORIES = without(
  ALL_CATEGORIES,
  ...EXPENSE_CATGORIES,
  Category.INTERNAL_MONEY_TRANSFER
);

export const LABEL_TO_CATEGORY_MAP = invert(
  mapValues(CATEGORY_TO_LABEL_MAP, (val) => val.toLowerCase())
);

export const SOURCES = getEnumKeys<Source>(Source);

export const toLabel = (key: Source | Category): string =>
  // @ts-ignore
  CATEGORY_TO_LABEL_MAP[key] || SOURCE_TO_LABEL_MAP[key] || key;
