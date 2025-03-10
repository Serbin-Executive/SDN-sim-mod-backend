export enum ClientCommandsTypes {
    CREATE = "create",
    START = "start",
    STOP = "stop",
}

export enum BoardWorkCommandsKeys {
    CREATE = "create",
    START = "start",
    STOP = "stop",
}

export interface IBoardWorkCommandData {
    commandKey: string;
    isSendSettingsConfig: boolean;
}

export type TBoardWorkCommandsConfig = IBoardWorkCommandData[];

export const boardWorkCommandsConfig: IBoardWorkCommandData[] = [
    {
        commandKey: BoardWorkCommandsKeys.CREATE,
        isSendSettingsConfig: true,
    },
    {
        commandKey: BoardWorkCommandsKeys.START,
        isSendSettingsConfig: false,
    },
    {
        commandKey: BoardWorkCommandsKeys.STOP,
        isSendSettingsConfig: false,
    },
]

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
}

export interface IClientMessage {
    commandID: string;
    commandInfo: any;
}

export const COMMAND_INFO_WITHOUS_SETTINGS_CONFIG: string = "";