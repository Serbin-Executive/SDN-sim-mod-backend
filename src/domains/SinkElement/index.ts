import Agent from "../Agent";
import NetworkElement from "../NetworkElement";
import { ISurroundingNetworkElements } from "../meta";

class SinkElement extends NetworkElement {
    constructor() {
        super();
        this.capacity = Infinity;
        this.nextElement = null;
        this.agentsLeftCount = 0;
    }

    protected sinkAgents(): void {
        this.agentsCount = 0;
        this.agentsList = [];
    }

    public trigger(initiator: NetworkElement, newAgent: Agent): boolean {
        this.takeAgents(initiator, newAgent);
        this.sinkAgents();

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