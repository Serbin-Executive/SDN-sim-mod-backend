export const WEB_CLIENT_PORT: number = 3001;

export enum ModelWorkingCommands {
    START = "start",
    STOP = "stop",
}

export const ModelWorkingCommandsIDList: string[] = [
    "start", "stop"
]

export interface IServerMessage {
    messageType: string;
    message: any;
}

export const enum ServerMessageTypes {
    MESSAGE = "message",
    MODELWORKINGCOMMANDS = "model working commands",
    MODELCURRENTSTATE = "model current state",
}

export const enum ServerMessageTexts {
    CONNECTMESSAGE = "You connected to server through WebSocket!",
}

export interface IClientCommandFunctionInfo {
    commandId: string;
    function: any;
}

export type TClientCommandFunctionsList = IClientCommandFunctionInfo[];

export interface IStatisticField {
    fieldName: string;
    fieldValue: string;
}

export type TStatisticFields = IStatisticField[];

export interface INetworElementState {
    id: string;
    type: string;
    statisticFields: TStatisticFields;
}

export interface IModelCurrentState {
    time: string;
    networkElementsStatesList: INetworElementState[];
}

