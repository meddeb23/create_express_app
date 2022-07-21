import config from "./config";

import express, { Request, Response } from "express";

import Debug from "debug";
import sequelize from "./database";

const debug = Debug("app:startup");

const app = express();

app.use(express.json());

(async function () {
  await sequelize.sync({ force: false });
})().then(() => debug("init DB"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world 👋" });
});

const PORT: Number = config.PORT;

app.listen(PORT, () =>
  debug(`server is running on ${config.NODE_ENV} mode on PORT ${PORT}`)
);
