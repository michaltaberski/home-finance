import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = 8000 || process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server 123");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
