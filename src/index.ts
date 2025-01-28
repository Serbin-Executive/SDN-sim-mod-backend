import express, { type Express } from "express";
import DefaultErrorHandler from "./middlewares/DefaultErrorHandler";
import { webSocketCreateConnection } from "./controllers/WebSocketController";
import { createModels, startModels, stopModels } from "./controllers/ModelsController";
import { PORT } from "./utils/constants";
import CORS from "./middlewares/CORS";
import { checkUrl } from "./controllers/CheckUrlController";

const app: Express = express();
// const port = process.env.PORT || 5500;

app.use(DefaultErrorHandler);
app.use(CORS);

createModels();

webSocketCreateConnection();

app.get(`/check-url/:url`, (req, res) => {
    const { url } = req.params;

    checkUrl(url, res) });

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
