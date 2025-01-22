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

export interface IModelLastState {
    time: string;
    networkElementsStatesList: INetworElementState[];
}

export type TModelsWork = NodeJS.Timer | null;
export type TModelsLastStates = IModelLastState[];

export const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}