#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { Source } from "./src/types";
import { processInputDataBySource } from "./src/utils";

$.verbose = false;

(async () => {
  for (const source of [Source.SANTANDER_CREDIT_CARD]) {
    await processInputDataBySource(source, { skipCategoryPrompt: true });
  }
})();
