#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { processInputDataBySource } from "./src/utils";
import { Source } from "@home-finance/shared";
import { take } from "lodash";

$.verbose = false;

(async () => {
  for (const source of [
    Source.ING,
    Source.INTELIGO,
    Source.SANTANDER_BANK,
    Source.SANTANDER_CREDIT_CARD,
    Source.MBANK_ANETA,
    Source.MBANK_MICHAL,
    Source.MBANK_PROACTIVUS,
    Source.REVOLUT,
  ]) {
    const operations = await processInputDataBySource(source, {
      skipCategoryPrompt: true,
    });
    console.log(take(operations.reverse(), 5));
  }
})();
