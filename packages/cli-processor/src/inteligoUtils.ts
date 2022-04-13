import { $ } from "zx";
import * as xml2js from "xml2js";
import {
  Category,
  getOeprationType,
  Operation,
  Source,
} from "@home-finance/shared";

export const getOperationsFromInteligoXmlFile = async (
  filePath: string
): Promise<Operation[]> => {
  const fileString = (await $`cat ${filePath}`).stdout.trim();
  const parsedXml = await xml2js.parseStringPromise(fileString);
  const rawOperationsXml =
    parsedXml["account-history"]["operations"][0]["operation"];
  return rawOperationsXml.map((transaction: any): Operation => {
    const amount = parseFloat(transaction["amount"][0]["_"]);
    const description = transaction["description"]
      .join("")
      .replace(/.+Tytuł: /, "")
      .replace(/ Data waluty:.+/, "");
    const date = transaction["exec-date"].join("");
    return {
      id: [Source.INTELIGO, date, amount].join("-"),
      date,
      amount,
      type: getOeprationType(amount),
      category: Category.UNCATEGORIZED,
      source: Source.INTELIGO,
      balanceAfterOperation: parseFloat(transaction["ending-balance"][0]["_"]),
      otherSide: transaction["other-side"]?.[0]["owner"][0]["line"]
        .join("")
        .replace(/\s+/g, " "),
      title: description,
      description,
    };
  });
};
