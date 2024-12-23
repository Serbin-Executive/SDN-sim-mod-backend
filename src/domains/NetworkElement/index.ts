import {
    type ICurrentState,
    type ISurroundingNetworkElements,
    type TNetworkElementId,
    type TNetworkElementAgentsCameCount,
    type TNetworkElementAgentsCount,
    type TNetworkElementAgentsLeftCount,
    type TNetworkElementCapacity,
    type TNextNetworkElement,
    type TPreviousNetworkElements,
    type TNetworkElementInitiator,
} from "../meta";
import { randomUUID } from "crypto";
import NetworkElementError from "../../Errors/NetworkElementError";

abstract class NetworkElement {
    protected id: TNetworkElementId;
    protected previousElements: TPreviousNetworkElements;
    protected nextElement: TNextNetworkElement;
    protected capacity: TNetworkElementCapacity;
    protected agentsCount: TNetworkElementAgentsCount;
    protected agentsCameCount: TNetworkElementAgentsCameCount;
    protected agentsLeftCount: TNetworkElementAgentsLeftCount;

    constructor() {
        this.id = randomUUID();
        this.capacity = 0;
        this.agentsCount = 0;
        this.agentsCameCount = 0;
        this.agentsLeftCount = 0;
        this.previousElements = null;
        this.nextElement = null;
    }

    protected getPreviousElementById(id: TNetworkElementId): NetworkElement {
        if (!id) {
            throw new NetworkElementError("Cannot get element by ID, ID is undefined");
        }

        if (!this.previousElements) {
            throw new NetworkElementError("Cannot get element by ID, Previous elements is undefined");
        }

        const targetElement: NetworkElement | undefined = this.previousElements.get(id);

        if (!targetElement) {
            throw new NetworkElementError(`Cannot get element by ID, the Element #${id} does not exist`);
        }

        return targetElement;
    }

    protected takeAgents(sourceNetworkElement: NetworkElement, amount: number): void {
        if (!sourceNetworkElement.agentsCount || !sourceNetworkElement.agentsLeftCount) {
            throw new NetworkElementError("Triggered takeAgents() from invalid NetworkElement");
        }

        if (!this.agentsCount || !this.agentsCameCount) {
            throw new NetworkElementError("Triggered takeAgents() into invalid NetworkElement");
        }

        if (sourceNetworkElement.agentsCount < amount) {
            throw new NetworkElementError("Amount is bigger than previousElement's agentsCount");
        }

        sourceNetworkElement.setAgentsCount(sourceNetworkElement.agentsCount - amount);
        sourceNetworkElement.setAgentsLeftCount(sourceNetworkElement.agentsLeftCount + amount);

        this.setAgentsCameCount(this.agentsCameCount + amount);
        this.setAgentsCount(this.agentsCount + amount);
    }

    public abstract trigger(initiator: TNetworkElementInitiator, amount: number): void;

    public abstract getSurroundingElements(): ISurroundingNetworkElements;

    public abstract getCurrentState(): ICurrentState;

    public getId(): TNetworkElementId {
        return this.id;
    }

    public getCapacity(): TNetworkElementCapacity {
        if (!this.capacity) {
            throw new NetworkElementError(
                "Cannot get capacity, capacity is undefined"
            );
        }

        return this.capacity;
    }

    public getAgentsCount(): TNetworkElementAgentsCount {
        return this.agentsCount;
    }

    public getAgentsCameCount(): TNetworkElementAgentsCameCount {
        return this.agentsCameCount;
    }

    public getAgentsLeftCount(): TNetworkElementAgentsLeftCount {
        return this.agentsLeftCount;
    }

    public getPreviousElements(): TPreviousNetworkElements {
        if (!this.previousElements) {
            throw new NetworkElementError(
                "Cannot get previous elements, previous elements is undefined"
            );
        }

        return this.previousElements;
    }

    public getNextElement(): TNextNetworkElement {
        if (!this.nextElement) {
            throw new NetworkElementError(
                "Cannot get next element, next element is undefined"
            );
        }

        return this.nextElement;
    }

    public setCapacity(capacity: TNetworkElementCapacity): void {
        this.capacity = capacity;
    }

    public setAgentsCount(agentsCount: TNetworkElementAgentsCount): void {
        this.agentsCount = agentsCount;
    }

    public setAgentsCameCount(agentsCameCount: TNetworkElementAgentsCameCount): void {
        this.agentsCameCount = agentsCameCount;
    }

    public setAgentsLeftCount(agentsLeftCount: TNetworkElementAgentsLeftCount): void {
        this.agentsLeftCount = agentsLeftCount;
    }

    public setPreviousElements(
        previousElements: TPreviousNetworkElements
    ): void {
        this.previousElements = previousElements;
    }

    public setNextElement(nextElement: TNextNetworkElement): void {
        this.nextElement = nextElement;
    }
}

export default NetworkElement;
