import NetworkElement from "../NetworkElement";

class Queue extends NetworkElement {

    protected isSourceOrSink: boolean;

    constructor() {
        super();
        this.isSourceOrSink = false;
    }

    public trigger(): void {

        if (this.capacity > this.agentsCount) {
            this.take();
            return;
        }

    }

    public getDataInfo() {
        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
        }
    }

    public requestReleaseQueue(): void {
        
        if (!this.nextElement) {
            throw new Error;
        }

        while (1) {
            this.nextElement.trigger()
        }
    }
}

export default Queue;