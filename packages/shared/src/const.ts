import { Category, Source } from "./types";
import { invert, mapValues } from "lodash";

export const SOURCE_TO_LABEL_MAP: Record<Source, string> = {
  [Source.ING]: "ING",
  [Source.INTELIGO]: "Inteligo",
  [Source.MBANK_COMPANY]: "mBank (Proactivus)",
  [Source.MBANK_PRIVATE]: "mBank (Michał)",
  [Source.REVOLUT]: "Revolut",
  [Source.SANTANDER_BANK]: "Santander",
  [Source.SANTANDER_CREDIT_CARD]: "Santander (karta kredytowa)",
};

export const CATEGORY_TO_LABEL_MAP: Record<Category, string> = {
  [Category.UTILITY_BILL]: "Rachunek za media",
  [Category.FOOD]: "Jedzenie",
  [Category.DINING_OUT]: "Jedzenie na mieście",
  [Category.HOUSEHOLD]: "Gospodarstwo domowe",
  [Category.KIDS]: "Dzieci",
  [Category.INTERNAL_MONEY_TRANSFER]: "Przelew własny",
  [Category.WORK_INCOME]: "Dochód z pracy",
  [Category.OTHER_INCOME]: "Inny dochód",
  [Category.CAR]: "Samochód",
  [Category.ENTERTAINMENT]: "Rozrywka",
  [Category.GADGET]: "Gadzety",
  [Category.OTHER]: "Inne",
  [Category.CLOTHES]: "Odziez",
  [Category.HEALTH_AND_BEAUTY]: "Zdrowie i uroda",
  [Category.HOME]: "Dom",
  [Category.TRAVEL_AND_LEISURE]: "Podróze i wypoczynek",
  [Category.PRESENTS_AND_CHARITY]: "Prezenty i pomoc",
  [Category.TAX]: "Podatek",
  [Category.RETURN]: "Zwrot",
  [Category.NOBILIT]: "Nobilit",
  [Category.BOOKS_AND_EDUCATION]: "Edukacja i ksiązki",
};

export const EXPENSE_CATGORIES = [
  Category.INTERNAL_MONEY_TRANSFER,
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
  Category.OTHER,
  Category.HOME,
  Category.TRAVEL_AND_LEISURE,
  Category.PRESENTS_AND_CHARITY,
  Category.TAX,
  Category.NOBILIT,
  Category.BOOKS_AND_EDUCATION,
];

export const INCOME_CATEGORIES = [
  Category.INTERNAL_MONEY_TRANSFER,
  Category.WORK_INCOME,
  Category.OTHER_INCOME,
  Category.TAX,
  Category.RETURN,
  Category.NOBILIT,
];

export const LABEL_TO_CATEGORY_MAP = invert(
  mapValues(CATEGORY_TO_LABEL_MAP, (val) => val.toLowerCase())
);
