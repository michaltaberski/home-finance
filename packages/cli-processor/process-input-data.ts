#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import { concatOperations, processInputDataBySource } from "./src/utils";
import { saveJsonToFile } from "@home-finance/fs-utils";
import { Source } from "@home-finance/shared";

$.verbose = false;

const SOURCES = [Source.REVOLUT, Source.INTELIGO, Source.SANTANDER_CREDIT_CARD];

(async () => {
  for (const source of SOURCES) {
    const outputData = await processInputDataBySource(source);
    await saveJsonToFile(outputData, `output/${source}.json`);
  }
  await saveJsonToFile(
    await concatOperations(SOURCES),
    `output/all-operations.json`
  );
})();
