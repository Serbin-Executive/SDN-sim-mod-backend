import NetworkElement from "../NetworkElement";

class Sink extends NetworkElement {

    constructor() {
        super();
        this.capacity = null;
        this.nextElement = null;
        this.agentsCount = null;
        this.agentsLeftCount = null;
    }

    public trigger(): void {
        if (!this.previousElement) {
            throw new Error("Sink executes a trigger when the next element does not exist");
        }

        this.take();
    }

    public getDataInfo() {
        if (!this.agentsCameCount) {
            throw new Error("A request for statistical information was made, but the statistics fields did not exist");
        }

        return { agentsCameCount: this.agentsCameCount }
    }

}

export default Sink;