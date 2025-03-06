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
    queueCapacity: number;
    delayCapacity: number;
    delayValue: number;
    isPartialInitialBoot: boolean;
    isQualityOfServiceActive: boolean;
    loadFactorDangerValue: number;
    pingDangerValue: number;
    jitterDangerValue: number;
}