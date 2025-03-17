import { BoardSettingsConfigActiveChangerLabels, BoardSettingsConfigFieldsLabels, ISendableBoardSettingsConfig, TBoardSettingsConfigRanges } from "../../domains/Board/meta";
import { DEFAULT_DELAY_VALUE, DEFAULT_IS_QUALITY_OF_SERVICE_ACTIVE, DEFAULT_JITTER_DANGER_VALUE, DEFAULT_LOAD_FACTOR_DANGER_VALUE, DEFAULT_MAX_DELAY_CAPACITY, DEFAULT_MAX_QUEUE_CAPACITY, DEFAULT_MAX_SPAWN_AGENTS_VALUE, DEFAULT_MIN_DELAY_CAPACITY, DEFAULT_MIN_QUEUE_CAPACITY, DEFAULT_MIN_SPAWN_AGENTS_VALUE, DEFAULT_MODEL_SOURCE_ELEMENTS_COUNT_VALUE, DEFAULT_MODELS_COUNT_VALUE, DEFAULT_PACKET_LOST_DANGER_VALUE, DEFAULT_PING_DANGER_VALUE, DEFAULT_STATISTIC_INTERVAL_VALUE, DEFAULT_WORK_INTERVAL_VALUE } from "../../utils/constants";

class BoardSettingsConfigService {
    public static getDefaultBoardSettingsConfig(): ISendableBoardSettingsConfig {
        return {
            modelsSettings: {
                fields: {
                    modelsCountValue: {
                        label: BoardSettingsConfigFieldsLabels.MODELS_COUNT_VALUE,
                        value: DEFAULT_MODELS_COUNT_VALUE,
                    },
                    minSpawnAgentsValue: {
                        label: BoardSettingsConfigFieldsLabels.MIN_SPAWN_AGENTS_VALUE,
                        value: DEFAULT_MIN_SPAWN_AGENTS_VALUE,
                    },
                    maxSpawnAgentsValue: {
                        label: BoardSettingsConfigFieldsLabels.MAX_SPAWN_AGENTS_VALUE,
                        value: DEFAULT_MAX_SPAWN_AGENTS_VALUE,
                    },
                    workIntervalValue: {
                        label: BoardSettingsConfigFieldsLabels.WORK_INTERVAL_VALUE,
                        value: DEFAULT_WORK_INTERVAL_VALUE,
                    },
                    statisticIntervalValue: {
                        label: BoardSettingsConfigFieldsLabels.STATISTIC_INTERVAL_VALUE,
                        value: DEFAULT_STATISTIC_INTERVAL_VALUE,
                    },
                    modelSourceElementsCountValue: {
                        label: BoardSettingsConfigFieldsLabels.MODEL_SOURCE_ELEMENTS_COUNT_VALUE,
                        value: DEFAULT_MODEL_SOURCE_ELEMENTS_COUNT_VALUE,
                    },
                    minQueueCapacity: {
                        label: BoardSettingsConfigFieldsLabels.MIN_QUEUE_CAPACITY,
                        value: DEFAULT_MIN_QUEUE_CAPACITY,
                    },
                    maxQueueCapacity: {
                        label: BoardSettingsConfigFieldsLabels.MAX_QUEUE_CAPACITY,
                        value: DEFAULT_MAX_QUEUE_CAPACITY,
                    },
                    minDelayCapacity: {
                        label: BoardSettingsConfigFieldsLabels.MIN_DELAY_CAPACITY,
                        value: DEFAULT_MIN_DELAY_CAPACITY,
                    },
                    maxDelayCapacity: {
                        label: BoardSettingsConfigFieldsLabels.MAX_DELAY_CAPACITY,
                        value: DEFAULT_MAX_DELAY_CAPACITY,
                    },
                    delayValue: {
                        label: BoardSettingsConfigFieldsLabels.DELAY_VALUE,
                        value: DEFAULT_DELAY_VALUE,
                    },
                    loadFactorDangerValue: {
                        label: BoardSettingsConfigFieldsLabels.LOAD_FACTOR_DANGER_VALUE,
                        value: DEFAULT_LOAD_FACTOR_DANGER_VALUE,
                    },
                },
            },
            qualityOfServiceSettings: {
                isActive: DEFAULT_IS_QUALITY_OF_SERVICE_ACTIVE,
                activeChangerLabel: BoardSettingsConfigActiveChangerLabels.IS_QUALITY_OF_SERVICE_ACTIVE,
                fields: {
                    packetLostDangerValue: {
                        label: BoardSettingsConfigFieldsLabels.PACKET_LOST_DANGER_VALUE,
                        value: DEFAULT_PACKET_LOST_DANGER_VALUE,
                    },
                    pingDangerValue: {
                        label: BoardSettingsConfigFieldsLabels.PING_DANGER_VALUE,
                        value: DEFAULT_PING_DANGER_VALUE,
                    },
                    jitterDangerValue: {
                        label: BoardSettingsConfigFieldsLabels.JITTER_DANGER_VALUE,
                        value: DEFAULT_JITTER_DANGER_VALUE,
                    },
                },
            },
        }
    }

    public static getBoardSettingsConfigRanges(): TBoardSettingsConfigRanges {
        return {
            modelsCountValue: {
                minValue: 1,
                maxValue: 10,
                step: 1,
                initialValue: DEFAULT_MODELS_COUNT_VALUE,
            },
            minSpawnAgentsValue: {
                minValue: 1,
                maxValue: 20,
                step: 1,
                initialValue: DEFAULT_MIN_SPAWN_AGENTS_VALUE,
            },
            maxSpawnAgentsValue: {
                minValue: 5,
                maxValue: 100,
                step: 1,
                initialValue: DEFAULT_MAX_SPAWN_AGENTS_VALUE,
            },
            workIntervalValue: {
                minValue: 100,
                maxValue: 10000,
                step: 100,
                initialValue: DEFAULT_WORK_INTERVAL_VALUE,
            },
            statisticIntervalValue: {
                minValue: 100,
                maxValue: 10000,
                step: 100,
                initialValue: DEFAULT_STATISTIC_INTERVAL_VALUE,
            },
            modelSourceElementsCountValue: {
                minValue: 1,
                maxValue: 10,
                step: 1,
                initialValue: DEFAULT_MODEL_SOURCE_ELEMENTS_COUNT_VALUE,
            },
            minQueueCapacity: {
                minValue: 1,
                maxValue: 25,
                step: 1,
                initialValue: DEFAULT_MIN_QUEUE_CAPACITY,
            },
            maxQueueCapacity: {
                minValue: 5,
                maxValue: 100,
                step: 1,
                initialValue: DEFAULT_MAX_QUEUE_CAPACITY,
            },
            minDelayCapacity: {
                minValue: 1,
                maxValue: 25,
                step: 1,
                initialValue: DEFAULT_MIN_DELAY_CAPACITY,
            },
            maxDelayCapacity: {
                minValue: 5,
                maxValue: 100,
                step: 1,
                initialValue: DEFAULT_MAX_DELAY_CAPACITY,
            },
            delayValue: {
                minValue: 100,
                maxValue: 10000,
                step: 100,
                initialValue: DEFAULT_DELAY_VALUE,
            },
            loadFactorDangerValue: {
                minValue: 0.5,
                maxValue: 1.5,
                step: 0.1,
                initialValue: DEFAULT_LOAD_FACTOR_DANGER_VALUE,
            },
            packetLostDangerValue: {
                minValue: 0.1,
                maxValue: 1,
                step: 0.01,
                initialValue: DEFAULT_PACKET_LOST_DANGER_VALUE,
            },
            pingDangerValue: {
                minValue: 100,
                maxValue: 10000,
                step: 100,
                initialValue: DEFAULT_PING_DANGER_VALUE,
            },
            jitterDangerValue: {
                minValue: 10,
                maxValue: 200,
                step: 10,
                initialValue: DEFAULT_JITTER_DANGER_VALUE,
            },
        };
    }
}

export default BoardSettingsConfigService;