import NetworkElement from "./NetworkElement";

export interface IGetDataInfo {
    [dataField: string]: number;
}

export interface IGetSchemaInfo {
    previousElement: NetworkElement,
    nextElement: NetworkElement
}