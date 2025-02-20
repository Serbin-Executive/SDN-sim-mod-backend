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
    MODELS_STATES = "models states",
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
    updateBoardFunction: any;
    boardActionFunction: any;
    clientSendActionFunctions: any[];
    allClientsSendActionFunctions: any[];
    infoMessage: string;
}

export interface IClientMessage {
    commandID: string;
    commandInfo: any;
}