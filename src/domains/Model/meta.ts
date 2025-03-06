
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

export type TModelsLastStateInfo = IModelStateInfo[];

export type TModelStatesInfo = IModelStateInfo[];

export interface IModelStatistic {
    allAgentsCount: number;
}

export interface ISendedChartsData {
    time: string;
    loadFactor: string;
    queueLoad: string;
}

export type TSendedChartsDataList = ISendedChartsData[];

export interface ISendedModelAdditionalInfo {
    agentsCameInModelCount: string;
    agentsLeftThroughModelCount: string;
    agentsInModelCount: string;
    agentsLostCount: string;
}

export type TSendedModelsAdditionalInfoList = ISendedModelAdditionalInfo[];

export interface ISendedModelsInfoList {
    sendedChartsDataList: TSendedChartsDataList;
    sendedModelsAdditionalInfoList: TSendedModelsAdditionalInfoList;
}