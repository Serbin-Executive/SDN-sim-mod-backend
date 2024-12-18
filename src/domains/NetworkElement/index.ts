import NetworkElementBase from "../NetworkElementBase";

abstract class NetworkElement extends NetworkElementBase{
    private previousElement: NetworkElementBase | null = null;
    private nextElement: NetworkElementBase | null = null;
    private capacity: number | null = null;
    private agentsCount: number = 0;
    private agentsCameCount: number = 0;
    private agentsLeftCount: number = 0;

    constructor() {
        super();
    }

    public abstract take(): void;

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

    public setNextElement(element: NetworkElementBase): void {
        this.nextElement = element;
    }

    public setPreviousElement(element: NetworkElementBase): void {
        this.previousElement = element;
    }
}

export default NetworkElement;