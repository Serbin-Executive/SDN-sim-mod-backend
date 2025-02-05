import Model from "../Model";
import Agent from "../Agent";
import NetworkElement from "../NetworkElement";
import SourceElement from "../SourceElement";
import QueueElement from "../QueueElement";
import DelayElement from "../DelayElement";
import SinkElement from "../SinkElement";
import { startDate } from "../..";
import { TModelsList, TWorkTime, TModelsInterval, TModelID, TModelsStatesInfo, TModelStatesInfo, STATISTIC_INTERVAL_VALUE, TObjectsStatesInfo, IBoardStatistic, DEFAULT_BOARD_STATISTIC, TStatesInfo, MODELS_COUNT_VALUE, addElementsInList, getPreviousElementsList, settingNextElementsInSequence, QUEUE_CAPACITY, DELAY_CAPACITY, DELAY_VALUE, WORK_INTERVAL_VALUE, TModelsLastStateInfo, IModelStateInfo, IModelsStatistic, DEFAULT_MODELS_STATISTIC, getRandomArbitrary, MAX_SPAWN_AGENTS_VALUE, MIN_SPAWN_AGENTS_VALUE, ServerMessageTypes } from "../../utils/constants";
import { sendMessageAllClients } from "../../controllers/WebSocketController";

class Board {
    private modelsList: TModelsList;
    private workTime: TWorkTime;
    private modelsWorkTimer: TModelsInterval;
    private sendModelsStatisticTimer: TModelsInterval;
    private isModelsStart: boolean;
    private isModelsStop: boolean;

    constructor() {
        this.modelsList = [];
        this.workTime = 0;
        this.modelsWorkTimer = null;
        this.sendModelsStatisticTimer = null;
        this.isModelsStart = false;
        this.isModelsStop = true;
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
            const needSendModelAgentsStatesInfo: TStatesInfo = model.getNeedSendServiceCompletedAgentsStatesInfo();

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

    public addModelToBoard(model: Model): void {
        this.modelsList.push(model)
    }

    public clearIntervalStatistic(): void {
        this.modelsList.forEach((model) => {
            model.clearIntervalStatistic();
        })
    }

    public clearSendingStatistic(): void {
        const modelsList = this.modelsList;

        modelsList.forEach((model) => {
            model.clearSendingStatistic();
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
        // const needSendModelsAgentsStatesInfo = this.getNeedSendModelsAgentsStatesInfo(modelsList);

        sendMessageAllClients(ServerMessageTypes.MODELS_STATES, needSendModelsStatesInfo);
        //send agents
        this.modelsList.forEach((model) => {
            const sinkElements = model.getSinkElements();

            let pingSum: number = 0;
            let jitterSum: number = 0;

            sinkElements.forEach((sinkElement) => {
                const agentsList = sinkElement.getAgentsList();

                console.log(sinkElement.getId())
                console.log(sinkElement.getAgentsList());

                pingSum += agentsList.reduce((pingSum, agent) => pingSum + (agent.getLeftTime() - agent.getCameTime()), 0);

                agentsList.forEach((agent, index) => {
                    if (!index) {
                        return 0;
                    }

                    jitterSum += agent.getLeftTime() - agentsList[index - 1].getLeftTime();
                })
            });

            const agentsCount: number = sinkElements.reduce((agentsCount, sinkElement) => agentsCount + sinkElement.getAgentsList().length, 0);

            const averagePing: number = pingSum / agentsCount;
            const averageJitter: number = jitterSum / agentsCount;

            model.updateStatistic(averagePing, averageJitter); 

            console.log("Model statistic: ", model.getStatistic());
        });

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
            const sinkElements: SinkElement[] = [];

            const sourceElement = new SourceElement();
            const queueElement = new QueueElement();
            const delayElement = new DelayElement();
            const sinkElement = new SinkElement();

            addElementsInList(sourceElements, sourceElement);
            addElementsInList(networkElements, sourceElement, queueElement, delayElement, sinkElement);
            addElementsInList(queueElements, queueElement);
            addElementsInList(delayElements, delayElement);
            addElementsInList(sinkElements, sinkElement);

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
            newModel.setSinkElements(sinkElements);

            this.addModelToBoard(newModel);

            console.log("\nCREATE SUCCESS\n");
        }
    }

    public clearStartedModelsStatistic(): void {
        this.modelsList.forEach((model) => {
            model.clearSendingStatistic();
        });
    }

    // public clearAgentsInStoppedModels(): void {
    //     this.modelsList.forEach((model) => {
    //         model.clearAgents();
    //     });

    //     this.setWorkTime(0);
    // }

    public startModels(): void {
        this.clearStartedModelsStatistic();

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

        this.workTime = 0;
        // this.clearAgentsInStoppedModels();

        this.isModelsStart = false;
        this.isModelsStop = true;

        console.log("\nSTOP SUCCESS\n");
    }
}

export default Board;