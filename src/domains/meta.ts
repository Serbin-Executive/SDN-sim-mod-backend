import NetworkElement from "./NetworkElement";

export interface IGetDataInfo {
    [dataField: string]: number;
}

export interface IGetSchemaInfo {
    previousElement: NetworkElement,
    nextElement: NetworkElement
}

export interface IServiceTimer {
    time: number;
    isBusy: boolean;
}

export enum UpdateActions {
    INCREASE = "+",
    DECREASE = "-"
}

export const IS_REQUEST_RELEASE_QUEUE: boolean = true;