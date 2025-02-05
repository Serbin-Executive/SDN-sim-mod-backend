import SourceElement from "../SourceElement";
import NetworkElement from "../NetworkElement";
import QueueElement from "../QueueElement";
import DelayElement from "../DelayElement";
import SinkElement from "../SinkElement";
import Agent from "../Agent";
import { startDate } from "../..";
import { randomUUID } from "crypto";
import { IModelStateInfo, INetworElementState, ICurrentState, IStateInfoField, TWorkTime, getRandomArbitrary, MIN_SPAWN_AGENTS_VALUE, MAX_SPAWN_AGENTS_VALUE, TModelID, DEFAULT_MODEL_STATISTIC, IModelStatistic, TModelStatesInfo, TObjectsStatesInfo, TStatesInfo, TStateInfo, TAgentsList } from "../../utils/constants";

class Model {
    private ID: TModelID;
    private sourceElements: SourceElement[];
    private networkElements: NetworkElement[];
    private queueElements: QueueElement[];
    private delayElements: DelayElement[];
    private sinkElements: SinkElement[];
    private statistic: IModelStatistic;

    constructor() {
        this.ID = randomUUID();
        this.sourceElements = [];
        this.networkElements = [];
        this.queueElements = [];
        this.delayElements = [];
        this.sinkElements = [];
        this.statistic = DEFAULT_MODEL_STATISTIC;
    }

    public getID(): string {
        return this.ID;
    }

    public getSourceElements(): SourceElement[] {
        return this.sourceElements;
    }

    public getNetworkElements(): NetworkElement[] {
        return this.networkElements;
    }

    public getQueueElements(): QueueElement[] {
        return this.queueElements;
    }

    public getDelayElements(): DelayElement[] {
        return this.delayElements;
    }

    public getSinkElements(): SinkElement[] {
        return this.sinkElements;
    }

    public getStatistic(): IModelStatistic {
        return this.statistic;
    }

    private getStateInfo = (state: ICurrentState): TStateInfo => {
        const statesListInfo: TStateInfo = Object.entries(state).map(([fieldName, fieldValue]) => {

            const stateField: IStateInfoField = {
                fieldName: fieldName,
                fieldValue: String(fieldValue),
            };

            return stateField;
        })

        return statesListInfo;
    }

    public spawnAgents(): void {
        const sourceElements = this.sourceElements;
        // for (let agentIndex = 0; agentIndex < SPAWN_AGENTS_VALUE; agentIndex++) {
        for (let agentIndex = 0; agentIndex < getRandomArbitrary(MIN_SPAWN_AGENTS_VALUE, MAX_SPAWN_AGENTS_VALUE); agentIndex++) {
            sourceElements.forEach((element) => {
                const agent = new Agent();

                const agentId =  this.statistic.allAgentsCount + 1;
                this.statistic.allAgentsCount++;

                const agentCameTime = (new Date()).getTime() - startDate.getTime();

                agent.setId(agentId);
                agent.setCameTime(agentCameTime);

                element.trigger("system", agent);
            });
        }
    }

    public getModelStateInfo = (workTime: TWorkTime): IModelStateInfo => {
        const networkElements = this.networkElements;
        // console.log(`Model ID: ${this.ID}\n`);

        const currentState: IModelStateInfo = {
            time: String(workTime),
            networkElementsStatesList: [],
        };

        networkElements.forEach((element) => {
            const currentNetworkElementState: INetworElementState = {
                id: element.getId(),
                type: element.constructor.name,
                statisticFields: [],
            };

            const modelElementStatistic: ICurrentState = element.getCurrentState();

            // console.log(`[${element.constructor.name}#${element.getId()}]`);

            const statisticFieldsArray = Object.entries(modelElementStatistic).map(([fieldName, fieldValue]) => {
                const currentStatisticField: IStateInfoField = {
                    fieldName: fieldName,
                    fieldValue: String(fieldValue),
                };

                currentNetworkElementState.statisticFields.push(currentStatisticField);

                // return { Field: fieldName, Value: fieldValue };
            });

            // console.table(statisticFieldsArray);

            currentState.networkElementsStatesList.push(currentNetworkElementState);
        });

        return currentState;
    }

    public getNeedSendServiceCompletedAgentsStatesInfo(): TStatesInfo {
        const serviceCompletedAgentsList: TAgentsList = [];

        this.sinkElements.forEach((sinkElement) => {
            const elementAgentList: TAgentsList = sinkElement.getAgentsList();

            elementAgentList.forEach((agent) => {
                serviceCompletedAgentsList.push(agent);
            });
        });
        
        const serviceCompletedAgentsStatesInfo: TStatesInfo = serviceCompletedAgentsList.map((agent) => {
            const agentState = agent.getCurrentState();

            return this.getStateInfo(agentState);
        });

        return serviceCompletedAgentsStatesInfo;
    }

    public setSourceElements(sourceElements: SourceElement[]): void {
        this.sourceElements = sourceElements;
    }

    public setNetworkElements(networkElements: NetworkElement[]): void {
        this.networkElements = networkElements;
    }

    public setQueueElements(queueElements: QueueElement[]): void {
        this.queueElements = queueElements;
    }

    public setDelayElements(delayElements: DelayElement[]): void {
        this.delayElements = delayElements;
    }

    public setSinkElements(sinkElements: SinkElement[]): void {
        this.sinkElements = sinkElements;
    }

    public setStatistic(statistic: IModelStatistic): void {
        this.statistic = statistic;
    }

    public stop(): void {
        this.delayElements.forEach((element) => {
            element.stop();
        })
        this.queueElements.forEach((element) => {
            element.stop();
        });

        this.clearAgents();
    }

    public clearStatistic(): void {
        this.statistic = DEFAULT_MODEL_STATISTIC;
    }

    public clearIntervalStatistic(): void {
        this.sourceElements.forEach((sourceElement) => {
            sourceElement.clearAgentsList();
        })
    }

    public updateStatistic(ping: number, jitter: number): void {
        this.statistic.ping = ping;
        this.statistic.jitter = jitter;
    }

    public clearSendingStatistic(): void {
        this.sinkElements.forEach((sinkElement) => {
            sinkElement.clearAgentsList();
        });
    }

    public clearAgents(): void {
        this.networkElements.forEach((element) => {
            element.setAgentsCameCount(0);
            element.setAgentsCount(0);
            element.setAgentsLeftCount(0);
        });

        this.queueElements.forEach((element) => {
            element.setAgentsLostCount(0);
        });
    }
}

export default Model;