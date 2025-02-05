import Agent from "../Agent";
import Model from "../Model";
import NetworkElement from "../NetworkElement";
import { ISurroundingNetworkElements } from "../../utils/constants";
import { startDate } from "../..";

class SinkElement extends NetworkElement {
    constructor() {
        super();
        this.capacity = Infinity;
        this.nextElement = null;
        this.agentsLeftCount = 0;
    }

    protected sinkAgent(newAgent: Agent): void {
        this.agentsCount = 0;

        const startTime = startDate.getTime();
        const leftTime = (new Date()).getTime();

        newAgent.setLeftTime(leftTime - startTime);
        newAgent.setIsLeftModel(true);

        // const ownerModel = board.getModelById(sinkAgent.getModelId());
        // ownerModel.updateServiceCompletedAgentsList(sinkAgent);
    }

    public trigger(initiator: NetworkElement, newAgent: Agent): boolean {
        this.takeAgents(initiator, newAgent);
        this.sinkAgent(newAgent);

        return true;
    }

    public getSurroundingElements(): ISurroundingNetworkElements {
        if (!this.previousElements) {
            throw new Error("Cannot get surrounding elements, previous elements is undefined");
        }

        return {
            previousElements: this.previousElements,
        }
    }

    public getCurrentState() {
        // if (!this.agentsCameCount || !this.agentsCount) {
        //     throw new Error("Cannot get current state, state properties are undefined");
        // }

        return { agentsCameCount: this.agentsCameCount, }
    }
    
    public clearAgentsList(): void {
        this.agentsList = [];
    }
}

export default SinkElement;