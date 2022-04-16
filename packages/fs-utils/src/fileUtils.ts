import { $, fs } from "zx";
import path from "path";
import { ExcludeFalsy, Operation, Source } from "@home-finance/shared";
import { sortBy } from "lodash";
const { writeFile } = fs.promises;

$.verbose = false;

const resolvePath = path.resolve;

export const getDataPath = (path: string) => {
  return resolvePath("../../data/", path);
};

export const readTextFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(getDataPath(filePath), "utf8", (err, data) => {
      if (err) {
        console.error(err);
        console.trace();
      }
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const readJsonFile = async <T extends object>(
  filePath: string
): Promise<T | null> => {
  const textFile = await readTextFile(filePath);
  return textFile ? JSON.parse(textFile) : null;
};

export const saveTextToFile = async (text: string, filePath: string) => {
  await writeFile(getDataPath(filePath), text);
};

export const saveJsonToFile = async (json: any, filePath: string) => {
  await writeFile(getDataPath(filePath), JSON.stringify(json, null, 2));
};

export const updateTextFile = async (
  filePath: string,
  updateFn: (inputString: string) => string
) => {
  const text = await readTextFile(filePath);
  const processedText = updateFn(text || "");
  await saveTextToFile(processedText, filePath);
};

export const readOutputData = async (
  source: Source
): Promise<null | Operation[]> =>
  readJsonFile<Operation[]>(`output/${source}.json`);

export const writeOutputData = (operations: Operation[], source: Source) =>
  saveJsonToFile(operations, `output/${source}.json`);

export const concatOperations = async (sources: Source[]) => {
  const bySourceOutputs = await (
    await Promise.all(sources.map((source) => readOutputData(source)))
  ).filter(ExcludeFalsy);
  const allOperations = bySourceOutputs.reduce<Operation[]>(
    (acc, operations) => [...acc, ...operations],
    []
  );

  return sortBy(allOperations, "date").reverse();
};
