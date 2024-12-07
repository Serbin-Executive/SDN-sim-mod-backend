import express, { type Express } from "express";
import CORS from "./middlewares/CORS";
import routes from "./routes";

const app: Express = express();
const port = process.env.PORT || 5500;

app.use(CORS);
app.use(routes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
