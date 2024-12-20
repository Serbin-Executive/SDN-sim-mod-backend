import NetworkElement from "../NetworkElement";

class Source extends NetworkElement {
    protected isSourceOrSink: boolean;

    constructor() {
        super();
        this.isSourceOrSink = true;
        this.previousElement = null;
    }

    public trigger(): void {
        if (!this.nextElement) {
            console.error("Next element not exist");
            return;
        }

        this.nextElement.trigger;
    }

    public getDataInfo() {
        return {
            agentsLeftCount: this.agentsLeftCount
        }
    }
}

export default Source;