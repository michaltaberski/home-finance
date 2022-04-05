import { $, fs } from "zx";
import path from "path";

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
  await $`echo ${text} > ${getDataPath(filePath)}`;
};

export const saveJsonToFile = async (json: any, filePath: string) => {
  await $`echo ${JSON.stringify(json, null, 2)} > ${getDataPath(filePath)}`;
};

export const updateTextFile = async (
  filePath: string,
  updateFn: (inputString: string) => string
) => {
  const text = await readTextFile(filePath);
  const processedText = updateFn(text || "");
  await saveTextToFile(processedText, filePath);
};
