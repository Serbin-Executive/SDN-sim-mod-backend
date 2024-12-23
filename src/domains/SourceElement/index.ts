import { type ISurroundingNetworkElements, type TNetworkElementInitiator } from "../meta";
import NetworkElement from "../NetworkElement";
import NetworkElementError from "../../Errors/NetworkElementError";

class SourceElement extends NetworkElement {

    constructor() {
        super();
        this.capacity = Infinity;
        this.previousElements = null;
    }

    public trigger(initiator: TNetworkElementInitiator = "system", spawnAmount: number = 1): void {
        if (!this.nextElement) {
            throw new NetworkElementError("Triggered trigger() into invalid NetworkElement");
        }

        this.spawnAgents(spawnAmount);
        this.nextElement.trigger(this, spawnAmount);
    }

    public getSurroundingElements(): ISurroundingNetworkElements {
        if (!this.nextElement) {
            throw new NetworkElementError("Cannot get surrounding elements, next element is undefined");
        }

        return {
            nextElement: this.nextElement,
        }
    }

    public getCurrentState() {
        if (!this.agentsLeftCount) {
            throw new NetworkElementError("Cannot get current state, agents left count is undefined");
        }

        return {
            agentsLeftCount: this.agentsLeftCount,
        }
    }

    private spawnAgents(amount: number) {
        this.setAgentsCount(this.agentsCount + amount);
        this.setAgentsCameCount(this.agentsCameCount + amount);
    }
}

export default SourceElement;