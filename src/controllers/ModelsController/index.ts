import Agent from "../../domains/Agent";
import DelayElement from "../../domains/DelayElement";
import { ICurrentState, TPreviousNetworkElements } from "../../domains/meta";
import NetworkElement from "../../domains/NetworkElement";
import QueueElement from "../../domains/QueueElement";
import SinkElement from "../../domains/SinkElement";
import SourceElement from "../../domains/SourceElement"
import { SendRequestsLinkedList } from "../../domains/SendRequestsLinkedList";
import { sendModelsLastStates } from "../WebSocketController";
import { IModelLastState, INetworElementState, IStatisticField, TModelsLastStates, TModelsWork, getRandomArbitrary } from "./meta";
import { Model } from "../../domains/Model";

const modelsList: Model[] = [];

const MODELS_COUNT_VALUE: number = 25;

const SPAWN_AGENTS_VALUE: number = 5;
const INTERVAL_VALUE: number = 1000;
const QUEUE_CAPACITY: number = 10;
const DELAY_CAPACITY: number = 3;
const DELAY_VALUE: number = 500;

let workTimePerMilliseconds: number = 0;
let modelsWork: TModelsWork = null;

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

export const createModels = (): void => {
    for (let index = 0; index < MODELS_COUNT_VALUE; index++) {
        const newModel = new Model();

        const sourceElements: SourceElement[] = [];
        const networkElements: NetworkElement[] = [];
        const queueElements: QueueElement[] = [];
        const delayElements: DelayElement[] = [];

        const sourceElement = new SourceElement();
        const queueElement = new QueueElement();
        const delayElement = new DelayElement();
        const sinkElement = new SinkElement();
    
        addElementsInList(sourceElements, sourceElement);
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

        newModel.setSourceElements(sourceElements);
        newModel.setNetworkElements(networkElements);
        newModel.setQueueElements(queueElements);
        newModel.setDelayElements(delayElements);
    
        modelsList.push(newModel);
        console.log("\nCREATE SUCCESS\n");
    }

}

export const getModelWorkCurrentState = (modelElements: NetworkElement[]): IModelLastState => {
    const currentState: IModelLastState = {
        time: String(workTimePerMilliseconds),
        networkElementsStatesList: [],
    };

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

const modelsIntervalAction = (): void => {
    modelsList.forEach((model) => {
        const sourceElements = model.getSourceElements();

        // for (let agentIndex = 0; agentIndex < SPAWN_AGENTS_VALUE; agentIndex++) {
        for (let agentIndex = 0; agentIndex < getRandomArbitrary(1, SPAWN_AGENTS_VALUE) ; agentIndex++) {
            sourceElements.forEach((element) => {    
                element.trigger("system", new Agent());
            });
        }
    })

    workTimePerMilliseconds += INTERVAL_VALUE;

    const modelsWorkCurrentStatesInfo: TModelsLastStates = [];

    modelsList.forEach((model) => {
        let networkElements = model.getNetworkElements();

        console.log(`\n\n\nModel ID: ${model.getID()}\n\n`);

        let modelCurrentState = getModelWorkCurrentState(networkElements);

        modelsWorkCurrentStatesInfo.push(modelCurrentState);
    })

    sendModelsLastStates(modelsWorkCurrentStatesInfo);
}

export const startModels = (): void => {
    modelsWork = setInterval(modelsIntervalAction, INTERVAL_VALUE);

    console.log("\nSTART SUCCESS\n");
}

export const clearModels = (): void => {
    modelsList.forEach((model) => {
        let networkElements = model.getNetworkElements();

        networkElements.forEach((element) => {
            element.setAgentsCameCount(0);
            element.setAgentsCount(0);
            element.setAgentsLeftCount(0);
        });
        
        model.setNetworkElements(networkElements);
    })

    workTimePerMilliseconds = 0;
}

export const stopModels = (): void => {
    if (!modelsWork) {
        throw new Error("Cannot stop models, models has not been started yet");
    }

    clearInterval(modelsWork);

    modelsList.forEach((model) => {
        let delayElements = model.getDelayElements();
        let queueElements = model.getQueueElements();

        delayElements.forEach((element) => {
            element.stop();
        })
    
        queueElements.forEach((element) => {
            element.setSendRequestsQueue(new SendRequestsLinkedList);
        });

        model.setDelayElements(delayElements);
        model.setQueueElements(queueElements);
    })


    clearModels();

    console.log("\nSTOP SUCCESS\n");
}
