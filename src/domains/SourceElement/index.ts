import Agent from "../Agent";
import { type ISurroundingNetworkElements, type TNetworkElementInitiator } from "../meta";
import NetworkElement from "../NetworkElement";

class SourceElement extends NetworkElement {
    constructor() {
        super();
        this.capacity = Infinity;
        this.previousElements = null;
    }

    public trigger(initiator: TNetworkElementInitiator = "system", newAgent: Agent): void {
        if (!this.nextElement) {
            throw new Error("Triggered trigger() into invalid NetworkElement");
        }

        this.setAgentsCount(this.agentsCount + 1);
        this.setAgentsCameCount(this.agentsCameCount + 1);

        this.nextElement.trigger(this, newAgent);
    }

    public getSurroundingElements(): ISurroundingNetworkElements {
        if (!this.nextElement) {
            throw new Error("Cannot get surrounding elements, next element is undefined");
        }

        return {
            nextElement: this.nextElement,
        }
    }

    public getCurrentState() {
        return {
            agentsLeftCount: this.agentsLeftCount,
        }
    }
}

export default SourceElement;