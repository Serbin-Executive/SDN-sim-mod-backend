import NetworkElement from "../NetworkElement";

class Source extends NetworkElement {

    constructor() {
        super();
        this.previousElement = null;
    }

    public trigger(): void {
        if (!this.nextElement) {
            console.error("Next element not exist");
            return;
        }

        this.agentsLeftCount++;
        this.nextElement.trigger;
    }

    public getDataInfo() {
        return {
            agentsLeftCount: this.agentsLeftCount
        }
    }
}

export default Source;