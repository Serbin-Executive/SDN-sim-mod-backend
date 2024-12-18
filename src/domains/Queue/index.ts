import NetworkElement from "../NetworkElement";

class Queue extends NetworkElement {

    private maxQueueCount: number = 0;

    constructor() {
        super();
    }

    public getMaxQueueCount(): number {
        return this.maxQueueCount;
    }

    public take(): void {

    }

    public trigger(): void {

    }

    public getInfo(): string {
        return `${this.getAgentsCount}, ${this.getAgentsCameCount}, ${this.getAgentsLeftCount}, ${this.getMaxQueueCount}`
    }
}

export default Queue;