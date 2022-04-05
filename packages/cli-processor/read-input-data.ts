#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { processInputDataBySource } from "./src/utils";
import { Source } from "@home-finance/shared";

$.verbose = false;

(async () => {
  for (const source of [Source.SANTANDER_CREDIT_CARD]) {
    await processInputDataBySource(source, { skipCategoryPrompt: true });
  }
})();
