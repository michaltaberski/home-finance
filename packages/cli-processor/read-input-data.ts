#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { processInputDataBySource } from "./src/utils";
import { Source } from "@home-finance/shared";

$.verbose = false;

(async () => {
  for (const source of [Source.REVOLUT]) {
    const z = await processInputDataBySource(source, {
      skipCategoryPrompt: true,
    });
    console.log("z ", z.length);
  }
})();
