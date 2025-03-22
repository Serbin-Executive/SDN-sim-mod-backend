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
    info: string;
}

export interface ISendableBoardSettingsConfigBlock {
    isActive?: boolean;
    title: string;
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
    WORK_INTERVAL_VALUE = "Work Interval value, ms",
    STATISTIC_INTERVAL_VALUE = "Statistic interval value, ms",
    MODEL_SOURCE_ELEMENTS_COUNT_VALUE = "Model SourceElements count value",
    MIN_QUEUE_CAPACITY = "Minimum QueueElement capacity",
    MAX_QUEUE_CAPACITY = "Maximum QueueElement capacity",
    MIN_DELAY_CAPACITY = "Minimum DelayElement capacity",
    MAX_DELAY_CAPACITY = "Maximum DelayElement capacity",
    DELAY_VALUE = "Delay value, ms",
    LOAD_FACTOR_DANGER_VALUE = "Load factor danger value",
    PACKET_LOST_DANGER_VALUE = "Packet lost danger value",
    PING_DANGER_VALUE = "Ping danger value, ms",
    JITTER_DANGER_VALUE = "Jitter danger value, ms",
}

export const enum BoardSettingsConfigFieldsInfoList {
    MODELS_COUNT_VALUE = "This slider set, how many models will create in board.",
    MIN_SPAWN_AGENTS_VALUE = "This slider set the minimum agents count that will come in models in each working time interval.",
    MAX_SPAWN_AGENTS_VALUE = "This slider set the maximum agents count that will come in models in each working time interval.",
    WORK_INTERVAL_VALUE = "This slider set time interval in ms for new agents to appear.",
    STATISTIC_INTERVAL_VALUE = "This slider set time interval in ms for to collect statistic. Also each this time interval will be applied to the transfer of agents form one model to another.",
    MODEL_SOURCE_ELEMENTS_COUNT_VALUE = "This slider set, hox many Source Elements will make in each model in board.",
    MIN_QUEUE_CAPACITY = "This slider set the minimum Queue Element capacity count in the models in the experiment.",
    MAX_QUEUE_CAPACITY = "This slider set the maximum Queue Element capacity count in the models in the experiment.",
    MIN_DELAY_CAPACITY = "This slider set the minimum Delay Element capacity count in the models in the experiment.",
    MAX_DELAY_CAPACITY = "This slider set the minimum Delay Element capacity count in the models in the experiment.",
    DELAY_VALUE = "This slider set time interval in ms for agents service in Delay Elements.",
    LOAD_FACTOR_DANGER_VALUE = "This slider set such is the value of load factor in models in which the mechanism for transferring agents from one model to another will be triggered.",
    PACKET_LOST_DANGER_VALUE = "This slider set such is the value of packet lost in models in which the mechanism for transferring agents from one model to another will be triggered.",
    PING_DANGER_VALUE = "This slider set such is the value in ms of ping in models in which the mechanism for transferring agents from one model to another will be triggered.",
    JITTER_DANGER_VALUE = "This slider set such is the value in ms of jitter in models in which the mechanism for transferring agents from one model to another will be triggered.",
}

export const enum BoardSettingsConfigBlocksTitles {
    BOARD_SETTINGS = "Board settings",
    QUALITY_OF_SERVICE_ACTIVE = "Quality of service",
}

export interface IRangeSettingData {
    minValue: number;
    maxValue: number;
    step: number;
    initialValue: number;
};

export type TBoardSettingsConfigRanges = Record<string, IRangeSettingData>;

export interface IModelRating {
    currentValue: number;
    maximumValue: number;
    info: string;
}

export interface IModelRatingInfo {
    queue: IModelRating;
    delay: IModelRating;
    general: IModelRating;
}

export type TModelsRatings = IModelRatingInfo[];

export const enum ModelRatingInfoList {
    QUEUE = "This model queue efficiency rating relatively to maximum efficiency in this experiment",
    DELAY = "This model delay efficiency rating relatively to maximum efficiency in this experiment",
    GENERAL = "This model general efficiency rating relatively to maximum efficiency in this experiment",
}