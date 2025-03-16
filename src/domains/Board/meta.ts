import Balancer from "../Balancer";
import Controller from "../Controller";
import { TParametersStatesList } from "../Controller/meta";

export type TControllersList = Controller[];
export type TControllersStatesList = TParametersStatesList[];

export type TBoardBalancer = Balancer | null;

export type TModelsInterval = NodeJS.Timer | null;

export interface ISettingsConfig {
    modelsCountValue: number;
    minSpawnAgentsValue: number;
    maxSpawnAgentsValue: number;
    workIntervalValue: number;
    statisticIntervalValue: number;
    modelSourceElementsCountValue: number;
    minQueueCapacity: number;
    maxQueueCapacity: number;
    minDelayCapacity: number;
    maxDelayCapacity: number;
    delayValue: number;
    loadFactorDangerValue: number;
    packetLostDangerValue: number;
    pingDangerValue: number;
    jitterDangerValue: number;
    isQualityOfServiceActive: boolean;
}