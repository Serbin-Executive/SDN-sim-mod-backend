import NetworkElement from "../NetworkElement";

class Sink extends NetworkElement {

    constructor() {
        super();

        this.nextElement = null;
    }

    public trigger(): void {
        if (!this.previousElement) {
            throw new Error;
        }

        this.take();
    }

    public getAgentsCameCount(): number {
        return this.agentsCameCount;
    }

    public getDataInfo() {
        return { agentsCameCount: this.agentsCameCount }
    }
}

export default Sink;