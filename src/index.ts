import express, { type Express } from "express";
import DefaultErrorHandler from "./middlewares/DefaultErrorHandler";
import CORS from "./middlewares/CORS";
import { createModelsByHostCommand, startModels, stopModels, webSocketCreateConnection } from "./controllers/WebSocketController";
import { PORT } from "./utils/constants";
import { checkUrl } from "./controllers/CheckUrlController";
import Board from "./domains/Board";

const app: Express = express();
// const port = process.env.PORT || 5500;

app.use(DefaultErrorHandler);
app.use(CORS);

const board = new Board();

createModelsByHostCommand(board);
startModels(board);
export const startDate = new Date();
setTimeout(() => {
    stopModels(board);
}, 40100)

// webSocketCreateConnection();

app.get(`/check-url/:url`, (req, res) => {
    const { url } = req.params;

    checkUrl(url, res) });

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
