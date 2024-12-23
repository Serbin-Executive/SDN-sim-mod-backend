import NetworkElement from "../NetworkElement";
import NetworkElementError from "../../Errors/NetworkElementError";
import { ICurrentState, ISurroundingNetworkElements } from "../meta";

class DelayElement extends NetworkElement {
    private delayValue: number;
    private isTakeAvailable: boolean;

    constructor() {
        super();
        this.delayValue = 0;
        this.isTakeAvailable = true;
    }

    public trigger(initiator: NetworkElement, amount: number = 1): void {
        this.checkTakeAvailable();

        if (!this.isTakeAvailable) {
            return;
        }

        this.takeAgents(initiator, amount);
        this.startDelay(amount);
    }

    public checkTakeAvailable(): void {
        if (!this.agentsCount || !this.capacity) {
            throw new NetworkElementError("Triggered checkTakeAvailable(), agents count or capacity is undefined");
        }

        if (this.agentsCount >= this.capacity) {
            this.isTakeAvailable = false;
            return;
        }

        this.isTakeAvailable = true;
    }

    private startDelay(amount: number = 1): void {
        setTimeout(() => {
            if (!this.nextElement) {
                throw new NetworkElementError("Triggered startDelay() into invalid NetworkElement");
            }

            this.nextElement.trigger(this, amount);
        }, this.delayValue)
    }

    public getDelayValue(): number {
        return this.delayValue;
    }

    public getSurroundingElements(): ISurroundingNetworkElements {
        if (!this.previousElements || !this.nextElement) {
            throw new NetworkElementError("Cannot get surrounding elements, previous or next elements are undefined");
        }

        return {
            previousElements: this.previousElements,
            nextElement: this.nextElement,
        }
    }

    public getCurrentState(): ICurrentState {
        if (!this.agentsCount || !this.agentsCameCount || !this.agentsLeftCount) {
            throw new NetworkElementError("Cannot get current state, state properties is undefined");
        }

        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
            delayValue: this.delayValue,
        }
    }

    public setDelayValue(value: number): void {
        this.delayValue = value;
    }
}

export default DelayElement;