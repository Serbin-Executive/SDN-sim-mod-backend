import express, { type Express } from "express";
import DefaultErrorHandler from "./middlewares/DefaultErrorHandler";
import { webSocketCreateConnection } from "./controllers/WebSocketController";
import { createModel } from "./controllers/ModelController";

const app: Express = express();
const port = process.env.PORT || 5500;

app.use(DefaultErrorHandler);

createModel();

webSocketCreateConnection();

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
