import Model from "../Model";
import Agent from "../Agent";
import NetworkElement from "../NetworkElement";
import SourceElement from "../SourceElement";
import QueueElement from "../QueueElement";
import DelayElement from "../DelayElement";
import SinkElement from "../SinkElement";
import { startDate } from "../..";
import { TModelsList, TWorkTime, TModelsInterval, TModelID, TModelsStatesInfo, TModelStatesInfo, STATISTIC_INTERVAL_VALUE, TObjectsStatesInfo, IBoardStatistic, DEFAULT_BOARD_STATISTIC, TStatesInfo, MODELS_COUNT_VALUE, addElementsInList, getPreviousElementsList, settingNextElementsInSequence, QUEUE_CAPACITY, DELAY_CAPACITY, DELAY_VALUE, WORK_INTERVAL_VALUE, TModelsLastStateInfo, IModelStateInfo, IModelsStatistic, DEFAULT_MODELS_STATISTIC, getRandomArbitrary, MAX_SPAWN_AGENTS_VALUE, MIN_SPAWN_AGENTS_VALUE } from "../../utils/constants";

class Board {
    private modelsList: TModelsList;
    private workTime: TWorkTime;
    private modelsWorkTimer: TModelsInterval;
    private sendModelsStatisticTimer: TModelsInterval;
    private isModelsStart: boolean;
    private isModelsStop: boolean;
    private statistic: IModelsStatistic;

    constructor() {
        this.modelsList = [];
        this.workTime = 0 - WORK_INTERVAL_VALUE;
        this.modelsWorkTimer = null;
        this.sendModelsStatisticTimer = null;
        this.isModelsStart = false;
        this.isModelsStop = true;
        this.statistic = DEFAULT_MODELS_STATISTIC;
    }

    public getModelsList(): TModelsList {
        return this.modelsList;
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

    public getStatistic(): IModelsStatistic {
        return this.statistic;
    }

    public getNeedSendModelsStatesInfo(modelsList: TModelsList): TModelsLastStateInfo {
        const needSendModelsStatesInfo: TModelsLastStateInfo = [];

        modelsList.forEach((model) => {
            const needSendModelStateInfo: IModelStateInfo = model.getModelStateInfo(this.workTime);

            needSendModelsStatesInfo.push(needSendModelStateInfo);
        })

        return needSendModelsStatesInfo;
    }

    public getNeedSendModelsAgentsStatesInfo(modelsList: TModelsList): TObjectsStatesInfo {
        const needSendModelsAgentsStatesInfo: TObjectsStatesInfo = [];

        modelsList.forEach((model) => {
            const needSendModelAgentsStatesInfo: TStatesInfo = model.getServiceCompletedAgentsStatesInfo();

            needSendModelsAgentsStatesInfo.push(needSendModelAgentsStatesInfo);
        });

        return needSendModelsAgentsStatesInfo;
    }

    public setModelsList(modelsList: TModelsList): void {
        this.modelsList = modelsList;
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

    public setStatistic(modelsStatistic: IModelsStatistic) {
        this.statistic = modelsStatistic;
    }

    public addModelToBoard(model: Model): void {
        this.modelsList.push(model)
    }

    public clearSendingStatistic(): void {
        const modelsList = this.modelsList;

        modelsList.forEach((model) => {
            model.clearStatistic();
        })
    }

    public modelsIntervalAction(): void {
        const modelsList = this.modelsList;

        // modelsList.forEach((model) => {
        //     model.spawnAgents(allTimeAgentsCount);
        // });

        modelsList.forEach((model) => {
            const sourceElements = model.getSourceElements();
            // for (let agentIndex = 0; agentIndex < SPAWN_AGENTS_VALUE; agentIndex++) {
            for (let agentIndex = 0; agentIndex < getRandomArbitrary(MIN_SPAWN_AGENTS_VALUE, MAX_SPAWN_AGENTS_VALUE); agentIndex++) {
                sourceElements.forEach((element) => {
                    const agent = new Agent();

                    const agentId = this.statistic.allTimeServiceCompletedAgentsCount + 1;
                    this.statistic.allTimeServiceCompletedAgentsCount++;

                    const startTime = startDate.getTime();
                    const agentCameTime = (new Date()).getTime();

                    agent.setId(agentId);
                    agent.setModelId(model.getID());
                    agent.setCameTime(agentCameTime - startTime);

                    element.trigger("system", agent);
                });
            }
        })

        this.workTime += WORK_INTERVAL_VALUE;
        console.log(`\n\nWORK TIME: ${this.workTime} ms\n`);
    }

    public statisticIntervalAction(): void {
        const modelsList = this.modelsList;

        const needSendModelsStatesInfo = this.getNeedSendModelsStatesInfo(modelsList);
        const needSendModelsAgentsStatesInfo = this.getNeedSendModelsAgentsStatesInfo(modelsList);

        //SEND TO WEBSOCKET

        console.log("Agents all count: ", this.statistic.allTimeServiceCompletedAgentsCount);

        // this.modelsList.forEach((model, index) => {
        //     console.log("\nModel ID: ", model.getID());
        //     console.log(model.getStatistic().serviceCompletedAgentsList, "\n");
        // })

        // console.log(JSON.stringify(this.modelsList));

        this.clearSendingStatistic();
    }

    public createModels(): void {
        this.modelsList = [];

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

            queueElement.sendListenerInit();
            delayElement.setDelayValue(DELAY_VALUE);

            newModel.setSourceElements(sourceElements);
            newModel.setNetworkElements(networkElements);
            newModel.setQueueElements(queueElements);
            newModel.setDelayElements(delayElements);

            this.addModelToBoard(newModel);

            console.log("\nCREATE SUCCESS\n");
        }
    }

    public clearStatistic(): void {
        this.statistic.allTimeServiceCompletedAgentsCount = 0;

        this.modelsList.forEach((model) => {
            model.clearStatistic();
        });
    }

    public clearAgentsInModels(): void {
        this.modelsList.forEach((model) => {
            model.clearAgents();
        });

        this.setWorkTime(0);
    }

    public startModels(): void {
        this.clearStatistic();

        if (this.isModelsStart) {
            return;
        }

        this.modelsWorkTimer = setInterval(() => this.modelsIntervalAction(), WORK_INTERVAL_VALUE);
        this.sendModelsStatisticTimer = setInterval(() => this.statisticIntervalAction(), STATISTIC_INTERVAL_VALUE);

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

        this.clearAgentsInModels();

        this.isModelsStart = false;
        this.isModelsStop = true;

        console.log("\nSTOP SUCCESS\n");
    }
}

export default Board;