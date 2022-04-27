import express, { Express, Request, Response } from "express";
import {
  concatOperations,
  readJsonFile,
  readOutputData,
  saveJsonToFile,
  writeOutputData,
} from "@home-finance/fs-utils";
import cors from "cors";
import dotenv from "dotenv";
import { Operation, Source, SOURCES } from "@home-finance/shared";
import { updateOrCreate } from "./utils";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app: Express = express();
const port = 8000 || process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/all-operations", async (req: Request, res: Response) => {
  res.json(await readJsonFile(`output/all-operations.json`));
});

app.post(
  "/update-operation",
  async (req: Request<Operation>, res: Response) => {
    const operation = {
      id: uuidv4(),
      description: "",
      otherSide: "",
      ...req.body,
    };

    const sourceOperations = await readOutputData(operation.source);
    const updatedSourceOperations = updateOrCreate(operation, sourceOperations);
    await writeOutputData(updatedSourceOperations, operation.source);
    await saveJsonToFile(
      await concatOperations(SOURCES),
      `output/all-operations.json`
    );

    const customOperations = await readJsonFile<Operation[]>(
      `output/custom-operations.json`
    );
    await saveJsonToFile(
      updateOrCreate(operation, customOperations),
      `output/custom-operations.json`
    );
    res.status(201).json(await readJsonFile(`output/all-operations.json`));
  }
);

app.post(
  "/delete-operation",
  async (req: Request<Operation>, res: Response) => {
    const { id } = req.body;
    const sourceOperations = await readOutputData(Source.CASH);
    const updatedSourceOperations = sourceOperations.filter((o) => o.id !== id);
    await writeOutputData(updatedSourceOperations, Source.CASH);
    await saveJsonToFile(
      await concatOperations(SOURCES),
      `output/all-operations.json`
    );

    const customOperations = await readJsonFile<Operation[]>(
      `output/custom-operations.json`
    );
    await saveJsonToFile(
      customOperations.filter((o) => o.id !== id),
      `output/custom-operations.json`
    );
    res.status(201).json(await readJsonFile(`output/all-operations.json`));
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
