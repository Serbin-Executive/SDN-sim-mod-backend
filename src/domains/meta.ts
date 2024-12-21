import NetworkElement from "./NetworkElement";

export interface IGetDataInfo {
    [dataField: string]: number;
}

export interface IGetNeighboringElementsInfo {
    previousElement: NetworkElement,
    nextElement: NetworkElement
}

export enum UpdateActionList {
    INCREASE = "+",
    DECREASE = "-"
}

export const IS_QUEUE_SEND_AGENTS: boolean = true;