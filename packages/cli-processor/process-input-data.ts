#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { Source } from "./src/types";
import { processInputDataBySource, saveJsonToFile } from "./src/utils";

$.verbose = false;

(async () => {
  for (const source of [
    Source.REVOLUT,
    Source.INTELIGO,
    Source.SANTANDER_CREDIT_CARD,
  ]) {
    const outputData = await processInputDataBySource(source);
    await saveJsonToFile(outputData, `output-data/${source}.json`);
  }
})();
