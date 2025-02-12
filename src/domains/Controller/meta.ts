import Model from "../Model";

export type TControllerID = string;
export type TServicedModel = Model | null;
export type TControllerParameter = number;

export interface IParametersState {
    time: TControllerParameter,
    CPU: TControllerParameter
    usedDiskSpace: TControllerParameter,
    memoryUsage: TControllerParameter,
    networkTraffic: TControllerParameter,
    packetLost: TControllerParameter,
    ping: TControllerParameter,
    jitter: TControllerParameter,
}
export type TParametersStatesList = IParametersState[];

export const CONTROLLER_CHECK_INTERVAL_TIME: number = 1000;