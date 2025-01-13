export const WEB_CLIENT_PORT: number = 3001;

export enum ModelsWorkingCommands {
    CREATE = "create",
    START = "start",
    STOP = "stop",
}

export enum ModelsCommandsForHost {
    START = "start",
    STOP = "stop",
}

export interface IServerMessage {
    messageType: string;
    message: any;
}

export const enum ServerMessageTypes {
    MESSAGE = "message",
    MODELS_WORKING_COMMANDS = "models working commands",
    MODELS_CURRENT_STATE = "models current state",
    MODELS_ACTIONS_STATES = "models actions states",
    CLEAR_CHARTS = "clear charts",
}

export const enum ServerInfoMessageTexts {
    CONNECT_MESSAGE = "YOU CONNECTED TO SERVER",
    CREATE_MODELS = "MODELS CREATED",
    START_MODELS = "MODELS STARTED",
    STOP_MODELS = "MODELS STOPPED",
}

export interface IActionConfig {
    modelActionFunction: () => void;
    clientSendActionFunctions: any[];
    allClientsSendActionFunctions: any[];
    infoMessage: string;
}

