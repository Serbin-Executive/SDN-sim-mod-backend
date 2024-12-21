import { IGetDataInfo, IGetSchemaInfo, UpdateActions } from "../meta";
import { randomUUID } from "crypto";

abstract class NetworkElement {
    protected id: string;
    protected previousElement: NetworkElement | null = null;
    protected nextElement: NetworkElement | null = null;
    protected capacity: number | null;
    protected agentsCount: number | null;
    protected agentsCameCount: number | null;
    protected agentsLeftCount: number | null;

    constructor() {
        this.id = randomUUID();
        this.capacity = 0;
        this.agentsCount = 0;
        this.agentsCameCount = 0;
        this.agentsLeftCount = 0;
    }

    public abstract trigger(): void;

    public take(): void {
        if (!this.previousElement) {
            throw new Error("Previous element not found when taking agent");
        }

        this.previousElement.updateAgentsCount(UpdateActions.DECREASE, 1);
        this.previousElement.updateAgentsLeftCount(UpdateActions.INCREASE, 1);

        this.updateAgentsCount(UpdateActions.INCREASE, 1);
        this.updateAgentsCameCount(UpdateActions.INCREASE, 1);

    }

    public getSchemaInfo(): IGetSchemaInfo {
        if (!this.previousElement || !this.nextElement) {
            throw new Error("When requesting schema information, the previous or next elements were not found.");
        }

        return {
            previousElement: this.previousElement,
            nextElement: this.nextElement
        }
    }

    public abstract getDataInfo(): IGetDataInfo;

    public getId(): string {
        return this.id;
    }

    public getCapacity(): number {
        if (!this.capacity) {
            throw new Error("Request for element capacity was made when capacity does not exist");
        }

        return this.capacity;
    }

    public getAgentsCount(): number | null {
        return this.agentsCount;
    }
    public getAgentsCameCount(): number | null {
        return this.agentsCameCount;
    }
    public getAgentsLeftCount(): number | null {
        return this.agentsLeftCount;
    }

    public getPreviousElement(): NetworkElement {
        if (!this.previousElement) {
            throw new Error("Request for previous element executed when previous element does not exist");
        }

        return this.previousElement;
    }

    public getNextElement(): NetworkElement {
        if (!this.nextElement) {
            throw new Error("Request for next element executed when previous element does not exist");
        }
        
        return this.nextElement;
    }

    public setCapacity(capacity: number): void {
        this.capacity = capacity;
    }

    public setAgentsCount(agentsCount: number): void {
        this.agentsCount = agentsCount;
    }
    public setAgentsCameCount(agentsCameCount: number): void {
        this.agentsCameCount = agentsCameCount;
    }
    public setAgentsLeftCount(agentsLeftCount: number): void {
        this.agentsLeftCount = agentsLeftCount;
    }

    public setPreviousElement(previousElement: NetworkElement): void {
        this.previousElement = previousElement;
    }

    public setNextElement(nextElement: NetworkElement): void {
        this.nextElement = nextElement;
    }

    private updateAgentsCount(action: string, value: number) {

        if (this.agentsCount == null) {
            return;
        }

        if (action == UpdateActions.INCREASE) {
            this.agentsCount += value;
            return;
        }

        this.agentsCount -= value;
    }

    private updateAgentsCameCount(action: string, value: number) {
        if (this.agentsCameCount == null) {
            return;
        }

        if (action == UpdateActions.INCREASE) {
            this.agentsCameCount += value;
            return;
        }

        this.agentsCameCount -= value;
    }

    private updateAgentsLeftCount(action: string, value: number) {
        if (this.agentsLeftCount == null) {
            return;
        }

        if (action == UpdateActions.INCREASE) {
            this.agentsLeftCount += value;
            return;
        }

        this.agentsLeftCount -= value;
    }

}

export default NetworkElement;