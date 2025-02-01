import express, { type Express } from "express";
import DefaultErrorHandler from "./middlewares/DefaultErrorHandler";
import CORS from "./middlewares/CORS";
import Board from "./domains/Board";
// import { webSocketCreateConnection } from "./controllers/WebSocketController";
import { PORT } from "./utils/constants";
import { checkUrl } from "./controllers/CheckUrlController";

const app: Express = express();
// const port = process.env.PORT || 5500;

app.use(DefaultErrorHandler);
app.use(CORS);

// createModels();
// startModels();
export const board = new Board();

board.createModels();
board.startModels();

export const startDate = new Date();
// webSocketCreateConnection();

app.get(`/check-url/:url`, (req, res) => {
    const { url } = req.params;

    checkUrl(url, res) });

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
