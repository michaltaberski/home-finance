import { Category, Operation, Source } from "@home-finance/shared";

type FilterMap = Partial<Record<Category, string[]>>;

const filterMap: FilterMap = {
  [Category.FOOD]: [],
  [Category.INTERNAL_MONEY_TRANSFER]: [],
  [Category.DINING_OUT]: [],
  [Category.HEALTH_AND_BEAUTY]: [],
  [Category.KIDS]: [],
  [Category.CAR]: [],
  [Category.ENTERTAINMENT]: [],
  [Category.TRAVEL_AND_LEISURE]: [
    "ENTER AIR",
    "Booking.com",
    "RYANAIR",
    "UBER",
  ],
  [Category.CLOTHES]: [
    "LPP SINSAY",
    "H&M",
    "HM Poznan",
    "Deichmann",
    "LPP MOHITO",
    "LPP RESERVED",
    "PRIMARK",
    "LOVEMADE MAGDALENA KĘDZIORA",
    "WWW.RESERVED.COM",
    "WWW.LOVEMADE.PL",
    "WWW.SIN-SAY.COM",
    "MYBASIC.PL",
  ],
  [Category.HOME]: [
    "Castorama",
    "Leroy Merlin",
    "DACH BUD",
    "SISTEMO",
    "INVESTDOM-KMB",
  ],
  [Category.HOUSEHOLD]: ["Pepco", "Homla"],
  [Category.BOOKS_AND_EDUCATION]: ["KSIEGARNIE", "KSIEGARNIA"],
  [Category.OTHER_EXPENSE]: [
    "Poczta Polska",
    "OPŁATA PRZELEW ZEW.DOWOL.",
    "OPŁATA-PRZELEW WEWN.",
    "OPŁATA MIES. ZA POLECENIE ZAPŁATY",
    "OPŁATA ZA KARTĘ",
    "OPŁATA ZA PROWADZENIE RACHUNKU",
  ],
  [Category.PRESENTS_AND_CHARITY]: ["KWIACIARNIA", "PAPIERNIK"],
  [Category.WORK_INCOME]: ["UZNANIE NATYCH. TRANSAKCJA WALUT."],
  [Category.OTHER_INCOME]: ["wiadczenie ZUS"],
  [Category.TAX]: [
    "PRZELEW ZEWNĘTRZNY DO ZUS",
    "68600000020260015951416168", // ZUS
    "88101000712222595141616800", // US
    "BIURO RACHUNKOWE KOMPLEX",
    "SKARBOWY POZNAŃ-NOWE MIASTO, VAT7K",
    "SKARBOWY POZNAŃ-NOWE MIASTO, PIT-5L",
  ],
  [Category.NOBILIT]: ["JOLANTA GOLA", "VECTRA"],
  [Category.MORTAGE]: [
    "SPŁATA KREDYTU",
    "RATA KREDYTU NR 002451153916",
    "50/002451153916/000/00",
    "2451153916SKŁADKA",
    // Numer kredytu na DOM 2451153916
  ],
};

export const categorySuggestion = (
  operation: Operation,
  _source: Source
): Category => {
  const phrase = operation.description.toLowerCase();
  const [category] =
    Object.entries(filterMap).find(([, filterPhrases]: [string, string[]]) => {
      return !!filterPhrases.find((filterPhrase) => {
        return !!phrase.match(filterPhrase.toLowerCase());
      });
    }) || [];
  return (category as Category) || Category.UNCATEGORIZED;
};
