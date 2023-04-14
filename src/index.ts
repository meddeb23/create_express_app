import config from "./config";

import express, { Request, Response } from "express";

import Debug from "debug";
import morgan from "morgan";

import sequelize from "./database";
import { logger } from "./helper";

const debug = Debug("app:startup");

const app = express();

app.use(express.json());

app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms",
    {
      stream: {
        write: (message) => logger.http(message),
      },
    }
  )
);

(async function () {
  await sequelize.sync({ force: false });
})().then(() => logger.info("Database connection established "));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world 👋" });
});

const PORT: Number = config.PORT;

app.listen(PORT, () =>
  logger.info(`server is running on ${config.NODE_ENV} mode on PORT ${PORT}`)
);
