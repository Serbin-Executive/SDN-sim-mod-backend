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

export interface ISendableSettingsConfigField {
    label: string;
    value: number;
}

export interface ISendableBoardSettingsConfigBlock {
    isActive?: boolean;
    activeChangerLabel?: string;
    fields: { [key: string]: ISendableSettingsConfigField };
}

export interface ISendableBoardSettingsConfig {
    modelsSettings: ISendableBoardSettingsConfigBlock;
    qualityOfServiceSettings: ISendableBoardSettingsConfigBlock;
}

export const enum BoardSettingsConfigFieldsLabels {
    MODELS_COUNT_VALUE = "Models count value",
    MIN_SPAWN_AGENTS_VALUE = "Minimum spawn agents value",
    MAX_SPAWN_AGENTS_VALUE = "Maximum spawn agents value",
    WORK_INTERVAL_VALUE = "Work Interval value",
    STATISTIC_INTERVAL_VALUE = "Statistic interval value",
    MODEL_SOURCE_ELEMENTS_COUNT_VALUE = "Model SourceElements count value",
    MIN_QUEUE_CAPACITY = "Minimum QueueElement capacity",
    MAX_QUEUE_CAPACITY = "Maximum QueueElement capacity",
    MIN_DELAY_CAPACITY = "Minimum DelayElement capacity",
    MAX_DELAY_CAPACITY = "Maximum DelayElement capacity",
    DELAY_VALUE = "Delay value",
    LOAD_FACTOR_DANGER_VALUE = "Load factor danger value",
    PACKET_LOST_DANGER_VALUE = "Packet lost danger value",
    PING_DANGER_VALUE = "Ping danger value",
    JITTER_DANGER_VALUE = "Jitter danger value",
}

export const enum BoardSettingsConfigActiveChangerLabels {
    IS_QUALITY_OF_SERVICE_ACTIVE = "Quality of service status",
}

export interface IRangeSettingData {
    minValue: number;
    maxValue: number;
    step: number;
    initialValue: number;
};

export type TBoardSettingsConfigRanges = Record<string, IRangeSettingData>;

export interface IModelElementsCapacities {
    queueCapacity: number;
    delayCapacity: number;
    maxQueueCapacity: number;
    maxDelayCapacity: number;
}

export type TBoardCapacities = IModelElementsCapacities[];