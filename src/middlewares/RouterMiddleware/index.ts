import { NextFunction, Request, Response } from "express";

export const routerMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    next(new Error("No such endpoint"));
};
