import { IGetDataInfo, IGetSchemaInfo } from "../meta";
import { randomUUID } from "crypto";

abstract class NetworkElement {
    protected id: string;
    protected previousElement: NetworkElement | null = null;
    protected nextElement: NetworkElement | null = null;
    protected capacity: number;
    protected agentsCount: number;
    protected agentsCameCount: number;
    protected agentsLeftCount: number;
    protected abstract isSourceOrSink: boolean;

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
            throw new Error;
        }

        if (this.previousElement.isSourceOrSink) { 
            this.previousElement.agentsLeftCount++;
            this.agentsCount++;
            return;
        }

        if (!(this.previousElement.agentsCount !== 0)) {
            return;
        }

        this.previousElement.agentsCount--;
        this.previousElement.agentsLeftCount++;

        if (this.isSourceOrSink) {
            this.agentsCameCount++;
            return
        }
        
        this.agentsCameCount++;
        this.agentsCount++;
    }

    public getSchemaInfo(): IGetSchemaInfo {
        if (!this.previousElement || !this.nextElement) {
            throw new Error;
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
            throw new Error;
        }
        return this.capacity;
    }

    public getAgentsCount(): number {
        return this.agentsCount;
    }
    public getAgentsCameCount(): number {
        return this.agentsCameCount;
    } 
    public getAgentsLeftCount(): number {
        return this.agentsLeftCount;
    } 

    public getPreviousElement(): NetworkElement {
        if (!this.previousElement) {
            throw new Error;
        }
        return this.previousElement;
    } 

    public getNextElement(): NetworkElement {
        if (!this.nextElement) {
            throw new Error;
        }
        return this.nextElement;
    } 

    public getIsSourceOrSink(): boolean {
        return this.isSourceOrSink;
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

}

export default NetworkElement;