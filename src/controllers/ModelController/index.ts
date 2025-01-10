import Agent from "../../domains/Agent";
import DelayElement from "../../domains/DelayElement";
import { ICurrentState, TPreviousNetworkElements } from "../../domains/meta";
import NetworkElement from "../../domains/NetworkElement";
import QueueElement from "../../domains/QueueElement";
import SinkElement from "../../domains/SinkElement";
import SourceElement from "../../domains/SourceElement"
import { SendRequestsLinkedList } from "../../domains/SendRequestsLinkedList";
import { sendModelCurrentState } from "../WebSocketController";
import { IModelCurrentState, INetworElementState, IStatisticField } from "../WebSocketController/meta";

const SPAWN_AGENTS_VALUE: number = 3;
const INTERVAL_VALUE: number = 1000;
const QUEUE_CAPACITY: number = 10;
const DELAY_CAPACITY: number = 3;
const DELAY_VALUE: number = 500;

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
    networkElements.forEach((element) => {
        element.setAgentsCameCount(0);
        element.setAgentsCount(0);
        element.setAgentsLeftCount(0);
    })

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

    const modelWorkCurrentStateInfo: IModelCurrentState = getModelWorkCurrentState(networkElements);

    sendModelCurrentState(modelWorkCurrentStateInfo);
}

export const startModel = (): void => {
    modelWork = setInterval(modelIntervalAction, INTERVAL_VALUE);

    console.log("\nSTART SUCCESS\n");
}

export const getModelWorkCurrentState = (modelElements: NetworkElement[]): IModelCurrentState => {
    const currentState: IModelCurrentState = {
        time: String(workTimePerMilliseconds),
        networkElementsStatesList: [],
    }

    console.log(`\n\nWORK TIME: ${workTimePerMilliseconds} ms\n`);

    modelElements.forEach((modelElement) => {
        const currentNetworkElementState: INetworElementState = {
            id: modelElement.getId(),
            type: modelElement.constructor.name,
            statisticFields: [],
        }
        console.log(`\n[${modelElement.constructor.name}#${modelElement.getId()}] Statistic:`);


        const modelElementStatistic: ICurrentState = modelElement.getCurrentState();

        Object.entries(modelElementStatistic).forEach(([fieldName, fieldValue]) => {
            const currentStatisticField: IStatisticField = {
                fieldName: fieldName,
                fieldValue: String(fieldValue),
            }

            currentNetworkElementState.statisticFields.push(currentStatisticField);

            console.log(`${fieldName}: ${fieldValue}`);
        })

        currentState.networkElementsStatesList.push(currentNetworkElementState);
    })

    return currentState;
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
    });

    clearModel();
}
