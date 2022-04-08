import { Category, Operation, Source } from "@home-finance/shared";

type FilterMap = Partial<Record<Category, string[]>>;

const filterMap: FilterMap = {
  [Category.FOOD]: [
    "PRZYSTANEK GRUZJA",
    "ZABKA",
    "ERT WYPIEKI",
    "ntfy.pl",
    "OSKROBA",
    "Biedronka",
    "RESTAURACJA THALI PALA",
    "Lidl",
    "NETTO",
    "ZAKLADY MIESNE",
    "Cukiernia",
    "GALERIA HANDLOWA PIERO DABROWKA",
    "AGAR",
  ],
  [Category.INTERNAL_MONEY_TRANSFER]: [
    "Spłata należności",
    "Spłata zadłużenia karty kredytowej",
    "Revolut",
    "Przelew własny",
    "PRZELEW WEWNĘTRZNY",
    "Zwrot środków",
    "50102055581111155936100080", // Inteligo account number
    "33114020040000330272748296",
    "17114020040000390250066780",
    "91114020040000330275436480",
    "NA RATE KREDYTU NA DOM",
  ],
  [Category.DINING_OUT]: [
    "Chlebak i Przyjaciele",
    "MLYN BISTRO PIZZA",
    "BAR A BOO",
    "SUSHI77",
    "Cafeina Salon Smaku",
    "McDonalds",
    "KFC",
    "KAWIARNIA",
    "PASIBUS",
    "LODZIARNIE",
    "LODZIARNIA",
    "AMOREBIO",
    "Sushi",
    "NORTH FISH",
    "PESTO PLEWISKA",
    "LAURETTA ZBOROWO",
    "SLODKI TARAS",
  ],
  [Category.HEALTH_AND_BEAUTY]: [
    "Apteka",
    "PUNKT APTECZNY",
    "Cosmedica",
    "AGNIESZKA JABLONSKA DABROWKA",
    "STUDIO URODY EKSTRAKT",
    "Termy Tarnowskie",
    "ROSSMANN",
    "BAK - MED",
  ],
  [Category.KIDS]: [
    "Smyk",
    "Sala Zabaw Fikolki",
    "PRZEDSZKOLE",
    "MAGDA KUCAK",
    "FREGATA SWIMMING",
  ],
  [Category.CAR]: ["Orlen", "WWW.MOBILET.PL", "CIRCLE K"],
  [Category.ENTERTAINMENT]: [
    "SPOTIFY",
    "CDA PL",
    "NETFLIX.COM",
    "Aqua Sport Tarnowo",
    "DECATHLON",
  ],
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
): Category | null => {
  const phrase = operation.description.toLowerCase();
  const [category] =
    Object.entries(filterMap).find(([, filterPhrases]: [string, string[]]) => {
      return !!filterPhrases.find((filterPhrase) => {
        return !!phrase.match(filterPhrase.toLowerCase());
      });
    }) || [];
  return (category as Category) || null;
};
