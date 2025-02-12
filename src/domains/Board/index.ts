import Model from "../Model";
import NetworkElement from "../NetworkElement";
import SourceElement from "../SourceElement";
import QueueElement from "../QueueElement";
import DelayElement from "../DelayElement";
import SinkElement from "../SinkElement";
import { TModelsList, TWorkTime, TModelsInterval, TModelID, STATISTIC_INTERVAL_VALUE, TObjectsStatesInfo, TStatesInfo, MODELS_COUNT_VALUE, addElementsInList, getPreviousElementsList, settingNextElementsInSequence, QUEUE_CAPACITY, DELAY_CAPACITY, DELAY_VALUE, WORK_INTERVAL_VALUE, TModelsLastStateInfo, IModelStateInfo, ServerMessageTypes } from "../../utils/constants";
import { sendMessageAllClients } from "../../controllers/WebSocketController";
import { TControllersList } from "./meta";
import Controller from "../Controller";

class Board {
    private modelsList: TModelsList;
    private controllersList: TControllersList;
    private workTime: TWorkTime;
    private modelsWorkTimer: TModelsInterval;
    private sendModelsStatisticTimer: TModelsInterval;
    private isModelsStart: boolean;
    private isModelsStop: boolean;

    constructor() {
        this.modelsList = [];
        this.controllersList = [];
        this.workTime = 0;
        this.modelsWorkTimer = null;
        this.sendModelsStatisticTimer = null;
        this.isModelsStart = false;
        this.isModelsStop = true;
    }

    public getModelsList(): TModelsList {
        return this.modelsList;
    }

    public getControllersList(): TControllersList {
        return this.controllersList;
    }

    public getModelById(modelId: TModelID): Model {
        const currentModel = this.modelsList.find((model) => model.getID() === modelId);

        if (!currentModel) {
            throw new Error("Cannot get model by id, id is uncorrect");
        }

        return currentModel;
    }

    public getWorkTime(): TWorkTime {
        return this.workTime;
    }

    public getModelsWorkTimer(): TModelsInterval {
        return this.modelsWorkTimer;
    }

    public getSendModelsStatisticTimer(): TModelsInterval {
        return this.sendModelsStatisticTimer;
    }

    public getIsModelStart(): boolean {
        return this.isModelsStart;
    }

    public getIsModelStop(): boolean {
        return this.isModelsStop;
    }

    public getNeedSendModelsStatesInfo(modelsList: TModelsList): TModelsLastStateInfo {
        const needSendModelsStatesInfo: TModelsLastStateInfo = [];

        modelsList.forEach((model) => {
            const needSendModelStateInfo: IModelStateInfo = model.getModelStateInfo(this.workTime);

            needSendModelsStatesInfo.push(needSendModelStateInfo);
        })

        return needSendModelsStatesInfo;
    }

    // public getNeedSendModelsAgentsStatesInfo(modelsList: TModelsList): TObjectsStatesInfo {
    //     const needSendModelsAgentsStatesInfo: TObjectsStatesInfo = [];

    //     modelsList.forEach((model) => {
    //         const needSendModelAgentsStatesInfo: TStatesInfo = model.getNeedSendServiceCompletedAgentsStatesInfo();

    //         needSendModelsAgentsStatesInfo.push(needSendModelAgentsStatesInfo);
    //     });

    //     return needSendModelsAgentsStatesInfo;
    // }

    public setModelsList(modelsList: TModelsList): void {
        this.modelsList = modelsList;
    }
    
    public setControllersList(controllersList: TControllersList): void {
        this.controllersList = controllersList;
    }

    public setWorkTime(workTime: TWorkTime): void {
        this.workTime = workTime;
    }

    public setModelsWorkTimer(modelsWorkTimer: TModelsInterval): void {
        this.modelsWorkTimer = modelsWorkTimer;
    }

    public setSendModelsStatisticTimer(sendModelsStatisticTimer: TModelsInterval): void {
        this.sendModelsStatisticTimer = sendModelsStatisticTimer;
    }

    public setIsModelsStart(isModelsStart: boolean) {
        this.isModelsStart = isModelsStart;
    }

    public setIsModelsStop(isModelsStop: boolean) {
        this.isModelsStop = isModelsStop;
    }

    public addModelToBoard(model: Model): void {
        this.modelsList.push(model)
    }

    public addControllerToBoard(controller: Controller): void {
        this.controllersList.push(controller);
    }

    public clearIntervalStatistic(): void {
        this.modelsList.forEach((model) => {
            model.clearIntervalStatistic();
        })
    }

    public modelsIntervalAction(): void {
        this.clearIntervalStatistic();

        this.modelsList.forEach((model) => {
            model.spawnAgents();
        })

        this.workTime += WORK_INTERVAL_VALUE;

        console.log(`\n\nWORK TIME: ${this.workTime} ms\n`);
    }

    public statisticIntervalAction(): void {
        const needSendModelsStatesInfo = this.getNeedSendModelsStatesInfo(this.modelsList);

        sendMessageAllClients(ServerMessageTypes.MODELS_STATES, needSendModelsStatesInfo);
    }

    public createModels(): void {
        this.modelsList = [];
        this.controllersList = [];

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
            const lostSinkElement = new SinkElement();

            addElementsInList(sourceElements, sourceElement);
            addElementsInList(networkElements, sourceElement, queueElement, delayElement, sinkElement);
            addElementsInList(queueElements, queueElement);
            addElementsInList(delayElements, delayElement);

            sourceElement.setPreviousElements(getPreviousElementsList());
            queueElement.setPreviousElements(getPreviousElementsList(sourceElement));
            delayElement.setPreviousElements(getPreviousElementsList(queueElement));
            sinkElement.setPreviousElements(getPreviousElementsList(delayElement));
            lostSinkElement.setPreviousElements(getPreviousElementsList(queueElement));

            settingNextElementsInSequence(networkElements);

            queueElement.setCapacity(QUEUE_CAPACITY);
            delayElement.setCapacity(DELAY_CAPACITY);

            queueElement.sendListenerInit();
            queueElement.setLostSinkElement(lostSinkElement);
            delayElement.setDelayValue(DELAY_VALUE);

            newModel.setSourceElements(sourceElements);
            newModel.setNetworkElements(networkElements);
            newModel.setQueueElements(queueElements);
            newModel.setDelayElements(delayElements);
            newModel.setSinkElement(sinkElement);

            this.addModelToBoard(newModel);

            const newController = new Controller();

            newController.setServicedModel(newModel);

            this.addControllerToBoard(newController);

            console.log("\nCREATE SUCCESS\n");
        }
    }

    public startModels(): void {
        if (this.isModelsStart) {
            return;
        }
    
        this.modelsWorkTimer = setInterval(() => this.modelsIntervalAction(), WORK_INTERVAL_VALUE);
        this.sendModelsStatisticTimer = setInterval(() => this.statisticIntervalAction(), STATISTIC_INTERVAL_VALUE);

        this.controllersList.forEach((controller) => controller.start());

        this.isModelsStop = false;
        this.isModelsStart = true;

        console.log("\nSTART SUCCESS\n");
    }

    public stopModels(): void {
        if (this.isModelsStop) {
            return;
        }

        if (!this.modelsWorkTimer || !this.sendModelsStatisticTimer) {
            throw new Error("Cannot stop models, models has not been started yet");
        }

        clearInterval(this.modelsWorkTimer);
        clearInterval(this.sendModelsStatisticTimer);

        this.modelsList.forEach((model) => {
            model.stop();
        })

        this.controllersList.forEach((controller) => {
            controller.stop();
        })

        this.workTime = 0;

        this.isModelsStart = false;
        this.isModelsStop = true;

        console.log("\nSTOP SUCCESS\n");

        this.controllersList.forEach((controller) => {
            controller.printParametersLists();
        })
    }
}

export default Board;