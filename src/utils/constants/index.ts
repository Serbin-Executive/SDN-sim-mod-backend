import EventEmitter from "events";
import Agent from "../../domains/Agent";
import NetworkElement from "../../domains/NetworkElement";
import Model from "../../domains/Model";
import WebSocket from "ws";

export const MODELS_COUNT_VALUE: number = 2;

export const MIN_SPAWN_AGENTS_VALUE: number = 5;
export const MAX_SPAWN_AGENTS_VALUE: number = 10;
export const WORK_INTERVAL_VALUE: number = 2000;
export const STATISTIC_INTERVAL_VALUE: number = 5000;
export const QUEUE_CAPACITY: number = 10;
export const DELAY_CAPACITY: number = 5;
export const DELAY_VALUE: number = 1000;

export const PORT: number = 5500;
export const EXPRESS_APP_ALLOWED_CORS_URL: string = "http://localhost:3000";

export type TSystem = "system";
export type TNetworkElementInitiator = NetworkElement | TSystem;
export type TNetworkElementId = string;
export type TPreviousNetworkElements = Map<string, NetworkElement> | null;
export type TNextNetworkElement = NetworkElement | null;
export type TNetworkElementCapacity = number;
export type TNetworkElementAgentsCount = number;
export type TNetworkElementAgentsCameCount = number;
export type TNetworkElementAgentsLeftCount = number;
export type TNetworkElementAgentsLostCount = number;
export type TStateValue =
    | TPreviousNetworkElements
    | TNextNetworkElement
    | TNetworkElementCapacity
    | TNetworkElementAgentsCount
    | TNetworkElementAgentsCameCount
    | TNetworkElementAgentsLeftCount;
export type TTakeSignal = EventEmitter | null;
export type TBatchedFunction = () => void;

export interface ICurrentState {
    [dataField: string]: number;
}

export type TStates = ICurrentState[];

export interface ISurroundingNetworkElements {
    previousElements?: TPreviousNetworkElements;
    nextElement?: TNextNetworkElement;
}

export type TAgentsList = Agent[];
export type TModelsAgentsList = TAgentsList[];

export type TSericeProcess = NodeJS.Timeout;
export type TServiceProcessList = TSericeProcess[];

export type TClientSocket = WebSocket | null;
export type TClientID = string | null;

export type TModelsList = Model[];
export type TWorkTime = number;

export type TModelID = string;

export interface IStateInfoField {
    fieldName: string;
    fieldValue: string;
}

export type TStateInfo = IStateInfoField[];
export type TStatesInfo = TStateInfo[];
export type TObjectsStatesInfo = TStatesInfo[];

export interface INetworElementState {
    id: string;
    type: string;
    statisticFields: TStateInfo;
}

export interface IModelStateInfo {
    time: string;
    networkElementsStatesList: INetworElementState[];
}

export type TModelsInterval = NodeJS.Timer | null;
export type TModelsLastStateInfo = IModelStateInfo[];

export type TModelStatesInfo = IModelStateInfo[];
export type TModelsStatesInfo = TModelStatesInfo[];

export type TAgentsStatesInfo = TStatesInfo[];

export type TAgentId = number;
export type TAgentTime = number;

export const WEB_CLIENT_PORT: number = 3001;

export interface IModelsStatistic {
    allTimeServiceCompletedAgentsCount: number;
}

export const DEFAULT_MODELS_STATISTIC: IModelsStatistic = {
    allTimeServiceCompletedAgentsCount: 0,
}

export interface IModelStatistic {
    serviceCompletedAgentsList: TAgentsList;
}

export const DEFAULT_MODEL_STATISTIC: IModelStatistic = {
    serviceCompletedAgentsList: [],
}

export interface IBoardStatistic {
    sentModelsStatesInfo: TModelsStatesInfo;
    allModelsStatesInfo: TModelsStatesInfo;
    modelsAgentsList: TModelsAgentsList;
    sentModelsAgentsStatesInfo: TObjectsStatesInfo;
    allModelsAgentsStatesInfo: TObjectsStatesInfo;
}

export const DEFAULT_BOARD_STATISTIC: IBoardStatistic = {
    sentModelsStatesInfo: [],
    allModelsStatesInfo: [],
    modelsAgentsList: [],
    sentModelsAgentsStatesInfo: [],
    allModelsAgentsStatesInfo: [],
}

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
    SERVICE_COMPLETED_AGENTS = "service completed agents",
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

export const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export const addElementsInList = (list: NetworkElement[], ...elements: NetworkElement[]): void => {
    elements.forEach((element) => {
        list.push(element);
    })
}

export const getPreviousElementsList = (...elements: NetworkElement[]): TPreviousNetworkElements => {
    const previousElements: TPreviousNetworkElements = new Map<string, NetworkElement>;

    elements.forEach((element) => {
        previousElements.set(element.getId(), element);
    })

    return previousElements;
}

export const settingNextElementsInSequence = (elements: NetworkElement[]): void => {
    const lastElementIndex = elements.length - 1;

    elements.forEach((element, index) => {
        if (index == lastElementIndex) {
            return;
        }

        element.setNextElement(elements[index + 1]);
    })
}

export const combineArray = (firstArray:any[], secondArray: any[]): void => {
    secondArray.forEach((element) => {
        firstArray.push(element);
    });
}