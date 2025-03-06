import Model from "../Model";
import NetworkElement from "../NetworkElement";
import SourceElement from "../SourceElement";
import QueueElement from "../QueueElement";
import DelayElement from "../DelayElement";
import SinkElement from "../SinkElement";
import Controller from "../Controller";
import Balancer from "../Balancer";
import { addElementsInList, DEFAULT_DELAY_CAPACITY, DEFAULT_DELAY_VALUE, DEFAULT_IS_PARTIAL_INITIAL_BOOT, DEFAULT_IS_QUALITY_OF_SERVICE_ACTIVE, DEFAULT_JITTER_DANGER_VALUE, DEFAULT_LOAD_FACTOR_DANGER_VALUE, DEFAULT_MAX_SPAWN_AGENTS_VALUE, DEFAULT_MIN_SPAWN_AGENTS_VALUE, DEFAULT_MODEL_SOURCE_ELEMENTS_COUNT_VALUE, DEFAULT_MODELS_COUNT_VALUE, DEFAULT_PING_DANGER_VALUE, DEFAULT_QUEUE_CAPACITY, DEFAULT_STATISTIC_INTERVAL_VALUE, DEFAULT_WORK_INTERVAL_VALUE, getPreviousElementsList, settingNextElementsInSequence } from "../../utils/constants";
import { ISettingsConfig, TBoardBalancer, TControllersList, TModelsInterval } from "./meta";
import { TControllersStatesList } from "./meta";
import { TModelsList, TBoardTime } from "../meta";
import { IModelStateInfo, TModelID, TModelsLastStateInfo } from "../Model/meta";
import { ServerMessageTypes } from "../../controllers/WebSocketController/meta";

class Board {
    private modelsList: TModelsList;
    private controllersList: TControllersList;
    private balancer: TBoardBalancer;
    private workTime: TBoardTime;
    private statisticTime: TBoardTime;
    private modelsWorkTimer: TModelsInterval;
    private sendModelsStatisticTimer: TModelsInterval;
    private isModelsStart: boolean;
    private isModelsStop: boolean;
    private sendingData: TControllersStatesList;
    private sendFunction: any;
    private settingsConfig: ISettingsConfig;

    constructor() {
        this.modelsList = [];
        this.controllersList = [];
        this.balancer = null;
        this.workTime = 0;
        this.statisticTime = 0;
        this.modelsWorkTimer = null;
        this.sendModelsStatisticTimer = null;
        this.isModelsStart = false;
        this.isModelsStop = true;
        this.sendingData = [];
        this.sendFunction = null;
        this.settingsConfig = {
            modelsCountValue: DEFAULT_MODELS_COUNT_VALUE,
            minSpawnAgentsValue: DEFAULT_MIN_SPAWN_AGENTS_VALUE,
            maxSpawnAgentsValue: DEFAULT_MAX_SPAWN_AGENTS_VALUE,
            workIntervalValue: DEFAULT_WORK_INTERVAL_VALUE,
            statisticIntervalValue: DEFAULT_STATISTIC_INTERVAL_VALUE,
            modelSourceElementsCountValue: DEFAULT_MODEL_SOURCE_ELEMENTS_COUNT_VALUE,
            queueCapacity: DEFAULT_QUEUE_CAPACITY,
            delayCapacity: DEFAULT_DELAY_CAPACITY,
            delayValue: DEFAULT_DELAY_VALUE,
            isPartialInitialBoot: DEFAULT_IS_PARTIAL_INITIAL_BOOT,
            isQualityOfServiceActive: DEFAULT_IS_QUALITY_OF_SERVICE_ACTIVE,
            loadFactorDangerValue: DEFAULT_LOAD_FACTOR_DANGER_VALUE,
            pingDangerValue: DEFAULT_PING_DANGER_VALUE,
            jitterDangerValue: DEFAULT_JITTER_DANGER_VALUE,
        }
    }

    public getModelsList(): TModelsList {
        return this.modelsList;
    }

    public getControllersList(): TControllersList {
        return this.controllersList;
    }

    public getBalancer(): TBoardBalancer {
        return this.balancer;
    }

    public getModelById(modelId: TModelID): Model {
        const currentModel = this.modelsList.find((model) => model.getID() === modelId);

        if (!currentModel) {
            throw new Error("Cannot get model by id, id is uncorrect");
        }

        return currentModel;
    }

    public getWorkTime(): TBoardTime {
        return this.workTime;
    }

    public getStatisticTime(): TBoardTime {
        return this.statisticTime;
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

    public getSendingData(): TControllersStatesList {
        return this.sendingData;
    }

    public getSendFunction(): any {
        return this.sendFunction;
    }

    public getNeedSendModelsStatesInfo(modelsList: TModelsList): TModelsLastStateInfo {
        const needSendModelsStatesInfo: TModelsLastStateInfo = [];

        modelsList.forEach((model) => {
            const needSendModelStateInfo: IModelStateInfo = model.getModelStateInfo(this.statisticTime);

            needSendModelsStatesInfo.push(needSendModelStateInfo);
        })

        return needSendModelsStatesInfo;
    }

    public getSettingsConfig(): ISettingsConfig {
        return this.settingsConfig;
    }

    public setModelsList(modelsList: TModelsList): void {
        this.modelsList = modelsList;
    }

    public setControllersList(controllersList: TControllersList): void {
        this.controllersList = controllersList;
    }

    public setBalancer(balancer: Balancer): void {
        this.balancer = balancer;
    }

    public setWorkTime(workTime: TBoardTime): void {
        this.workTime = workTime;
    }

    public setStatisticTime(statisticTime: TBoardTime): void {
        this.statisticTime = statisticTime;
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

    public setSendingData(sendingData: TControllersStatesList) {
        this.sendingData = sendingData;
    }

    public setSendFunction(sendFunction: any) {
        this.sendFunction = sendFunction;
    }

    public updateSettingsConfig(newSettingsConfig: ISettingsConfig): void {
        this.settingsConfig.modelsCountValue = newSettingsConfig.modelsCountValue;
        this.settingsConfig.minSpawnAgentsValue = newSettingsConfig.minSpawnAgentsValue;
        this.settingsConfig.maxSpawnAgentsValue = newSettingsConfig.maxSpawnAgentsValue;
        this.settingsConfig.workIntervalValue = newSettingsConfig.workIntervalValue;
        this.settingsConfig.statisticIntervalValue = newSettingsConfig.statisticIntervalValue;
        this.settingsConfig.modelSourceElementsCountValue = newSettingsConfig.modelSourceElementsCountValue;
        this.settingsConfig.queueCapacity = newSettingsConfig.queueCapacity;
        this.settingsConfig.delayCapacity = newSettingsConfig.delayCapacity;
        this.settingsConfig.delayValue = newSettingsConfig.delayValue;
        this.settingsConfig.isPartialInitialBoot = newSettingsConfig.isPartialInitialBoot;
        this.settingsConfig.isQualityOfServiceActive = newSettingsConfig.isQualityOfServiceActive;
    }

    public addModel(model: Model): void {
        this.modelsList.push(model)
    }

    public addController(controller: Controller): void {
        this.controllersList.push(controller);
    }

    public clearIntervalStatistic(): void {
        this.modelsList.forEach((model) => {
            model.clearIntervalStatistic();
        })
    }

    public clearSendingData(): void {
        this.sendingData = [];
    }

    public balancerCheck(): void {
        if (!this.balancer) {
            throw new Error("Cannot complete statistic interval action, balancer is undefined");
        }

        const { delayValue, workIntervalValue, maxSpawnAgentsValue, loadFactorDangerValue, pingDangerValue, jitterDangerValue } = this.settingsConfig;

        const delayValueToIntervalValueMultiplier = workIntervalValue / delayValue;

        this.balancer.checkModelsLoadFactors(this.statisticTime, delayValueToIntervalValueMultiplier, loadFactorDangerValue, maxSpawnAgentsValue, pingDangerValue, jitterDangerValue);
    }

    public modelsIntervalAction(): void {
        this.clearIntervalStatistic();

        this.modelsList.forEach((model) => {
            model.spawnAgents();
        })

        this.workTime += this.settingsConfig.workIntervalValue;

        console.log(`\n\nWORK TIME: ${this.workTime} ms\n`);
    }

    public statisticIntervalAction(): void {
        this.statisticTime += this.settingsConfig.statisticIntervalValue;

        this.balancerCheck();

        const needSendModelsStatesInfo = this.getNeedSendModelsStatesInfo(this.modelsList);

        this.sendFunction(ServerMessageTypes.MODELS_STATES, needSendModelsStatesInfo);
    }

    public create(): void {
        this.modelsList = [];
        this.controllersList = [];

        this.balancer = new Balancer();

        for (let index = 0; index < this.settingsConfig.modelsCountValue; index++) {
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

            queueElement.setCapacity(this.settingsConfig.queueCapacity);
            delayElement.setCapacity(this.settingsConfig.delayCapacity);

            queueElement.sendListenerInit();
            queueElement.setLostSinkElement(lostSinkElement);
            delayElement.setDelayValue(this.settingsConfig.delayValue);

            newModel.setSourceElements(sourceElements);
            newModel.setNetworkElements(networkElements);
            newModel.setQueueElements(queueElements);
            newModel.setDelayElements(delayElements);
            newModel.setSinkElement(sinkElement);

            this.addModel(newModel);

            const newController = new Controller();

            newController.setServicedModel(newModel);

            this.addController(newController);
            this.balancer.addController(newController);

            console.log("\nCREATE SUCCESS\n");
        }
    }

    public start(): void {
        if (this.isModelsStart) {
            return;
        }

        this.clearSendingData();

        this.modelsWorkTimer = setInterval(() => this.modelsIntervalAction(), this.settingsConfig.workIntervalValue);
        this.sendModelsStatisticTimer = setInterval(() => this.statisticIntervalAction(), this.settingsConfig.statisticIntervalValue);

        this.controllersList.forEach((controller) => controller.start());

        this.isModelsStop = false;
        this.isModelsStart = true;

        console.log("\nSTART SUCCESS\n");
    }

    public stop(): void {
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
            this.sendingData.push(controller.getParametersStatesList());

            controller.printParametersLists();
        });
    }
}

export default Board;