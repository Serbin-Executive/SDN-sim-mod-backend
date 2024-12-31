import Agent from "../../domains/Agent";
import DelayElement from "../../domains/DelayElement";
import { ICurrentState, TPreviousNetworkElements } from "../../domains/meta";
import NetworkElement from "../../domains/NetworkElement";
import QueueElement from "../../domains/QueueElement";
import SinkElement from "../../domains/SinkElement";
import SourceElement from "../../domains/SourceElement"
import { SendRequestsLinkedList } from "../../domains/SendRequestsLinkedList";

const SPAWN_AGENTS_VALUE: number = 3;
const INTERVAL_VALUE: number = 1000;
const QUEUE_CAPACITY: number = 10;
const DELAY_CAPACITY: number = 3;
const DELAY_VALUE: number = 5000;

let workTimePerMilliseconds: number = 0;

const spawnAgentsElements: NetworkElement[] = [];
const networkElements: NetworkElement[] = [];
const queueElements: QueueElement[] = [];
const delayElements: DelayElement[] = [];

let modelWork: NodeJS.Timer | null = null;

const addElementsInList = (list: NetworkElement[], ...elements: NetworkElement[]): void => {
    elements.forEach((element) => {
        list.push(element);
    })
}

const getPreviousElementsList = (...elements: NetworkElement[]): TPreviousNetworkElements => {
    const previousElements: TPreviousNetworkElements = new Map<string, NetworkElement>;

    elements.forEach((element) => {
        previousElements.set(element.getId(), element);
    })

    return previousElements;
}

const settingNextElementsInSequence = (elements: NetworkElement[]): void => {
    const lastElementIndex = elements.length - 1;

    elements.forEach((element, index) => {
        if (index == lastElementIndex) {
            return;
        }

        element.setNextElement(elements[index + 1]);
    })
}

export const clearModel = (): void => {
    spawnAgentsElements.length = 0;
    networkElements.length = 0;
    queueElements.length = 0;

    workTimePerMilliseconds = 0;
}

export const createModel = (): void => {
    clearModel();

    const sourceElement = new SourceElement();
    const queueElement = new QueueElement();
    const delayElement = new DelayElement();
    const sinkElement = new SinkElement();

    addElementsInList(spawnAgentsElements, sourceElement);
    addElementsInList(networkElements, sourceElement, queueElement, delayElement, sinkElement);
    addElementsInList(queueElements, queueElement);
    addElementsInList(delayElements, delayElement);

    sourceElement.setPreviousElements(getPreviousElementsList());
    queueElement.setPreviousElements(getPreviousElementsList(sourceElement));
    delayElement.setPreviousElements(getPreviousElementsList(queueElement));
    sinkElement.setPreviousElements(getPreviousElementsList(delayElement));

    settingNextElementsInSequence(networkElements);

    queueElement.setCapacity(QUEUE_CAPACITY);
    delayElement.setCapacity(DELAY_CAPACITY);

    delayElement.setDelayValue(DELAY_VALUE);

    console.log("\nCREATE SUCCESS\n");
}

const modelIntervalAction = (): void => {
    for (let agentIndex = 0; agentIndex < SPAWN_AGENTS_VALUE; agentIndex++) {
        spawnAgentsElements.forEach((element) => {
            const spawnAgent = new Agent();

            element.trigger("system", spawnAgent);
        });
    }

    workTimePerMilliseconds += INTERVAL_VALUE;

    getModelWorkCurrentState(networkElements);
    console.log("\nTICK\n");
}

export const startModel = (): void => {
    modelWork = setInterval(modelIntervalAction, INTERVAL_VALUE);

    console.log("\nSTART SUCCESS\n");
}

export const getModelWorkCurrentState = (modelElements: NetworkElement[]) => {
    console.log(`\n\nWORK TIME: ${workTimePerMilliseconds} ms\n`);

    modelElements.forEach((modelElement) => {
        console.log(`\n[${modelElement.constructor.name}#${modelElement.getId()}] Statistic:`);

        const modelElementStatistic: ICurrentState = modelElement.getCurrentState();

        Object.entries(modelElementStatistic).forEach(([fieldName, fieldValue]) => {
            console.log(`${fieldName}: ${fieldValue}`);
        })
    })
}

export const stopModel = (): void => {
    if (!modelWork) {
        throw new Error("Cannot stop model, model has not been started yet");
    }

    clearInterval(modelWork);

    delayElements.forEach((element) => {
        element.stop();
    })

    queueElements.forEach((element) => {
        element.setSendRequestsQueue(new SendRequestsLinkedList);
    })

    console.log("\n\n\nMODEL IS STOPPED, FINAL TICK:\n");
    getModelWorkCurrentState(networkElements);
}
