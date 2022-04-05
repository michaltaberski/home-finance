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
    "Revolut",
    "Przelew własny",
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
  [Category.KIDS]: ["Smyk", "Sala Zabaw Fikolki"],
  [Category.CAR]: ["Orlen"],
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
  ],
  [Category.HOME]: ["Castorama", "Leroy Merlin"],
  [Category.HOUSEHOLD]: ["Pepco", "Homla"],
  [Category.BOOKS_AND_EDUCATION]: ["KSIEGARNIE", "KSIEGARNIA"],
  [Category.OTHER]: ["Poczta Polska"],
  [Category.PRESENTS_AND_CHARITY]: ["KWIACIARNIA", "PAPIERNIK"],
};

export const categorySuggestion = (
  operation: Operation,
  _source: Source
): Category | null => {
  const phrase = operation.description.toLowerCase();
  const [category] =
    Object.entries(filterMap).find(
      ([, filterPhrases]: [Category, string[]]) => {
        return !!filterPhrases.find((filterPhrase) => {
          return !!phrase.match(filterPhrase.toLowerCase());
        });
      }
    ) || [];
  return (category as Category) || null;
};
