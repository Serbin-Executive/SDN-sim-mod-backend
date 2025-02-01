import SourceElement from "../SourceElement";
import NetworkElement from "../NetworkElement";
import QueueElement from "../QueueElement";
import DelayElement from "../DelayElement";
import Agent from "../Agent";
import { randomUUID } from "crypto";
import { IModelStateInfo, INetworElementState, ICurrentState, IStateInfoField, TWorkTime, getRandomArbitrary, MIN_SPAWN_AGENTS_VALUE, MAX_SPAWN_AGENTS_VALUE, TModelID, DEFAULT_MODEL_STATISTIC, IModelStatistic, TModelStatesInfo, TObjectsStatesInfo, TStatesInfo, TStateInfo, TAgentsList } from "../../utils/constants";

class Model {
    private ID: TModelID;
    private sourceElements: SourceElement[];
    private networkElements: NetworkElement[];
    private queueElements: QueueElement[];
    private delayElements: DelayElement[];
    private statistic: IModelStatistic;

    constructor() {
        this.ID = randomUUID();
        this.sourceElements = [];
        this.networkElements = [];
        this.queueElements = [];
        this.delayElements = [];
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

    public getStatistic(): IModelStatistic {
        return this.statistic;
    }

    private getAgentState = (agent: Agent): ICurrentState => {
        return agent.getCurrentState();
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

    public updateServiceCompletedAgentsList(agent: Agent): void {
        this.statistic.serviceCompletedAgentsList.push(agent);
    }

    public spawnAgents(allTimeAgentsCount: number): void {
        const sourceElements = this.sourceElements;
        // for (let agentIndex = 0; agentIndex < SPAWN_AGENTS_VALUE; agentIndex++) {
        for (let agentIndex = 0; agentIndex < getRandomArbitrary(MIN_SPAWN_AGENTS_VALUE, MAX_SPAWN_AGENTS_VALUE); agentIndex++) {
            sourceElements.forEach((element) => {
                const agent = new Agent();

                const agentId =  allTimeAgentsCount + 1;
                allTimeAgentsCount++;

                const agentCameTime = new Date().getUTCMilliseconds();

                agent.setId(agentId);
                agent.setModelId(this.ID);
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

    public getServiceCompletedAgentsStatesInfo(): TStatesInfo {
        const serviceCompletedAgentsList = this.statistic.serviceCompletedAgentsList;
        
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
    }

    public clearStatistic(): void {
        this.statistic = DEFAULT_MODEL_STATISTIC;
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