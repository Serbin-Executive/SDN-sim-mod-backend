import { type Request, type Response, type NextFunction } from "express";

export const applicationHeartbeat = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    response.send("Express + TypeScript Server");
};
