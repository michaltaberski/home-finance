#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { processInputDataBySource } from "./src/utils";
import { Source } from "@home-finance/shared";
import { take } from "lodash";

$.verbose = false;

(async () => {
  for (const source of [Source.MBANK_PROACTIVUS]) {
    const operations = await processInputDataBySource(source, {
      skipCategoryPrompt: true,
    });
    console.log(take(operations, 5));
  }
})();
