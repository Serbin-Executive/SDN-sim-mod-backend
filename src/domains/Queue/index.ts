import NetworkElement from "../NetworkElement";

class Queue extends NetworkElement {

    private maxQueueCount: number;

    constructor() {
        super();

        this.maxQueueCount = 0;
    }

    public trigger(): void {

    }

    public getMaxQueueCount(): number {
        return this.maxQueueCount;
    }

    public getDataInfo() {
        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
            maxQueueCount: this.maxQueueCount
        }
    }

    public setMaxQueueCount(maxQueueCount: number): void {
        this.maxQueueCount = maxQueueCount;
    }
}

export default Queue;