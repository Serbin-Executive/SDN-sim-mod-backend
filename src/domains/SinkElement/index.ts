import Agent from "../Agent";
import Model from "../Model";
import NetworkElement from "../NetworkElement";
import { ISurroundingNetworkElements } from "../../utils/constants";
import { board, startDate } from "../..";

class SinkElement extends NetworkElement {
    constructor() {
        super();
        this.capacity = Infinity;
        this.nextElement = null;
        this.agentsLeftCount = 0;
    }

    protected sinkAgents(sinkAgent: Agent): void {
        this.agentsCount = 0;
        this.agentsList = [];

        const startTime = startDate.getTime();
        const leftTime = (new Date()).getTime();

        sinkAgent.setLeftTime(leftTime - startTime);
        sinkAgent.setIsLeftModel(true);

        const ownerModel = board.getModelById(sinkAgent.getModelId());
        ownerModel.updateServiceCompletedAgentsList(sinkAgent);
    }

    public trigger(initiator: NetworkElement, newAgent: Agent): boolean {
        this.takeAgents(initiator, newAgent);
        this.sinkAgents(newAgent);

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

}

export default SinkElement;