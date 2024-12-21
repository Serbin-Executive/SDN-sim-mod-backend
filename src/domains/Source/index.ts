import NetworkElement from "../NetworkElement";

class Source extends NetworkElement {

    constructor() {
        super();
        this.capacity = null;
        this.previousElement = null;
        this.agentsCount = null;
        this.agentsCameCount = null;
    }

    public trigger(): void {
        if (!this.nextElement) {
            console.error("Source executes a trigger when the next element does not exist");
            return;
        }

        this.nextElement.trigger;
    }

    public getDataInfo() {
        if (!this.agentsLeftCount) {
            throw new Error("A request for statistical information was made, but the statistics fields did not exist");
        }

        return {
            agentsLeftCount: this.agentsLeftCount
        }
    }
}

export default Source;