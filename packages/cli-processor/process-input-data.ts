#! ./node_modules/.bin/ts-node

import { saveJsonToFile, Source } from "@home-finance/shared";
import { $ } from "zx";
import { processInputDataBySource } from "./src/utils";

$.verbose = false;

(async () => {
  for (const source of [
    Source.REVOLUT,
    Source.INTELIGO,
    Source.SANTANDER_CREDIT_CARD,
  ]) {
    const outputData = await processInputDataBySource(source);
    await saveJsonToFile(outputData, `output/${source}.json`);
  }
})();
