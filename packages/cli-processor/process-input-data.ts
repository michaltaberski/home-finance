#! ./node_modules/.bin/ts-node

import { $ } from "zx";
import {
  concatOperations,
  getCliArgs,
  processInputDataBySource,
} from "./src/utils";
import { saveJsonToFile } from "@home-finance/fs-utils";
import { Source, SOURCES } from "@home-finance/shared";
import { without } from "lodash";

$.verbose = false;

(async () => {
  const { overwrite } = getCliArgs();
  for (const source of without(SOURCES, Source.CASH)) {
    const outputData = await processInputDataBySource(source, {
      overwrite: !!overwrite,
    });
    await saveJsonToFile(outputData, `output/${source}.json`);
  }
  await saveJsonToFile(
    await concatOperations(SOURCES),
    `output/all-operations.json`
  );
})();
