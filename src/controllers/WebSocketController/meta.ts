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
    isCloseBoardControlPanel: boolean;
    isAccessGetResults: boolean;
}

export type TBoardWorkCommandsConfig = IBoardWorkCommandData[];

export const boardWorkCommandsConfig: IBoardWorkCommandData[] = [
    {
        commandKey: BoardWorkCommandsKeys.CREATE,
        isSendSettingsConfig: true,
        isCloseBoardControlPanel: false,
        isAccessGetResults: false,
    },
    {
        commandKey: BoardWorkCommandsKeys.START,
        isSendSettingsConfig: false,
        isCloseBoardControlPanel: true,
        isAccessGetResults: false,
    },
    {
        commandKey: BoardWorkCommandsKeys.STOP,
        isSendSettingsConfig: false,
        isCloseBoardControlPanel: false,
        isAccessGetResults: true,
    },
]

export interface IServerMessage {
    messageType: string;
    message: any;
}

export const enum ServerMessageTypes {
    MESSAGE = "message",
    BOARD_WORKING_COMMANDS = "board working commands",
    MODELS_STATES = "models states",
    MODELS_ADDITIONAL_INFO = "models additional info",
    BOARD_ACTIONS_STATES = "board actions states",
    CLEAR_CHARTS = "clear charts",
    BOARD_CAPACITIES_LIST = "board capacities list",
    BOARD_SETTINGS_CONFIG = "board settings config",
    BOARD_SETTINGS_CONFIG_RANGES = "board settings config ranges",
}

export const enum ServerInfoMessageTexts {
    CONNECT_MESSAGE = "YOU CONNECTED TO SERVER",
    CREATE_MODELS = "MODELS CREATED",
    START_MODELS = "MODELS STARTED",
    STOP_MODELS = "MODELS STOPPED",
    GET_SETUP_DATA = "YOU GET SETUP DATA",
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
