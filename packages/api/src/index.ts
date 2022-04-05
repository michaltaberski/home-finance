import express, { Express, Request, Response } from "express";
import { readJsonFile } from "@home-finance/fs-utils";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = 8000 || process.env.PORT;

app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.json(await readJsonFile("output/inteligo.json"));
});

app.get("/output/:type", async (req: Request, res: Response) => {
  res.json(await readJsonFile(`output/${req.params.type}.json`));
});

app.get("/all-operations", async (req: Request, res: Response) => {
  res.json(await readJsonFile(`output/all-operations.json`));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
