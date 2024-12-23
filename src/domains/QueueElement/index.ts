import NetworkElement from "../NetworkElement";
import NetworkElementError from "../../Errors/NetworkElementError";
import { ISurroundingNetworkElements } from "../meta";

// TODO virtual multiplier
const QUEUE_INTERVAL = 15; //ms

class QueueElement extends NetworkElement {
    private isServing: boolean = false;

    constructor() {
        super();
    }

    private setup(): void {
        if (!this.nextElement) {
            throw new Error("Triggered setup(), next element is undefined");
        }

        setInterval(this.nextElement.trigger, QUEUE_INTERVAL, this, 1);
        this.isServing = true;
    }

    public trigger(initiator: NetworkElement, amount: number = 1): void {
        if (!this.isServing) {
            this.setup();
        }

        this.takeAgents(initiator, amount);
    }

    public getSurroundingElements(): ISurroundingNetworkElements {
        if (!this.previousElements || !this.nextElement) {
            throw new NetworkElementError("Cannot get surroundings elements, previous or next elements are undefined");
        }

        return {
            previousElements: this.previousElements,
            nextElement: this.nextElement,
        }
    }

    public getCurrentState() {
        if (!this.agentsCount || !this.agentsCameCount || !this.agentsLeftCount) {
            throw new NetworkElementError("Cannot get current state, state properties are undefined");
        }

        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
        }
    }
}

export default QueueElement;