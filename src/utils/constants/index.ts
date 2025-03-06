import NetworkElement from "../../domains/NetworkElement";
import { TPreviousNetworkElements } from "../../domains/meta";

export const DEFAULT_MODELS_COUNT_VALUE: number = 10;

export const DEFAULT_MIN_SPAWN_AGENTS_VALUE: number = 5;
export const DEFAULT_MAX_SPAWN_AGENTS_VALUE: number = 10;
export const DEFAULT_WORK_INTERVAL_VALUE: number = 2000;
export const DEFAULT_STATISTIC_INTERVAL_VALUE: number = 1000;
export const DEFAULT_MODEL_SOURCE_ELEMENTS_COUNT_VALUE: number = 1;
// export const DEFAULT_QUEUE_CAPACITY: number = 10;
// export const DEFAULT_DELAY_CAPACITY: number = 5;
export const DEFAULT_MIN_QUEUE_CAPACITY: number = 5;
export const DEFAULT_MAX_QUEUE_CAPACITY: number = 15;
export const DEFAULT_MIN_DELAY_CAPACITY: number = 2;
export const DEFAULT_MAX_DELAY_CAPACITY: number = 5;

export const DEFAULT_DELAY_VALUE: number = 1000;
export const DEFAULT_IS_PARTIAL_INITIAL_BOOT: boolean = false;
export const DEFAULT_IS_QUALITY_OF_SERVICE_ACTIVE: boolean = false;

export const DEFAULT_LOAD_FACTOR_DANGER_VALUE: number = 1;
export const DEFAULT_PING_DANGER_VALUE: number = 2000;
export const DEFAULT_JITTER_DANGER_VALUE: number = 250;

export const PORT: number = 5500;
export const EXPRESS_APP_ALLOWED_CORS_URL: string = "http://localhost:3000";

export const DEFAULT_USED_DISK_SPACE: number = 0.4;

export const WEB_CLIENT_PORT: number = 3001;

export const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export const addElementsInList = (list: NetworkElement[], ...elements: NetworkElement[]): void => {
    elements.forEach((element) => {
        list.push(element);
    })
}

export const getPreviousElementsList = (...elements: NetworkElement[]): TPreviousNetworkElements => {
    const previousElements: TPreviousNetworkElements = new Map<string, NetworkElement>;

    elements.forEach((element) => {
        previousElements.set(element.getId(), element);
    })

    return previousElements;
}

export const settingNextElementsInSequence = (elements: NetworkElement[]): void => {
    const lastElementIndex = elements.length - 1;

    elements.forEach((element, index) => {
        if (index == lastElementIndex) {
            return;
        }

        element.setNextElement(elements[index + 1]);
    })
}

export const combineArray = (firstArray:any[], secondArray: any[]): void => {
    secondArray.forEach((element) => {
        firstArray.push(element);
    });
}