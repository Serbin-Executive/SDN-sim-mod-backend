export const WEB_CLIENT_PORT: number = 3001;

export enum ModelWorkingCommands {
    START = "start",
    STOP = "stop",
}

export interface IServerMessage {
    messageType: string;
    message: any;
}

export const enum ServerMessageTypes {
    MESSAGE = "message",
    MODEL_WORKING_COMMANDS = "model working commands",
    MODEL_CURRENT_STATE = "model current state",
}

export const enum ServerMessageTexts {
    CONNECT_MESSAGE = "You connected to server through WebSocket!",
}

