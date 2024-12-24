import NetworkElement from "../NetworkElement";
import NetworkElementError from "../../Errors/NetworkElementError";
import { ISurroundingNetworkElements, type TNetworkElementInitiator } from "../meta";

class SinkElement extends NetworkElement {

    constructor() {
        super();
        this.capacity = Infinity;
        this.nextElement = null;
        this.agentsLeftCount = null;
    }

    protected sinkAgents(): void {
        this.agentsCount = 0;
    }

    public trigger(initiator: NetworkElement, amount: number = 1): void {
        this.takeAgents(initiator, amount);
        this.sinkAgents();
    }

    public getSurroundingElements(): ISurroundingNetworkElements {
        if (!this.previousElements) {
            throw new NetworkElementError("Cannot get surrounding elements, previous elements is undefined");
        }

        return {
            previousElements: this.previousElements,
        }
    }

    public getCurrentState() {
        if (!this.agentsCameCount || !this.agentsCount) {
            throw new NetworkElementError("Cannot get current state, state properties are undefined");
        }

        return { agentsCameCount: this.agentsCameCount, }
    }

}

export default SinkElement;