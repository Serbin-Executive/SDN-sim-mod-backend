import NetworkElement from "../NetworkElement";
import { IS_QUEUE_SEND_AGENTS } from "../meta";

class Queue extends NetworkElement {

    constructor() {
        super();
    }

    public trigger(): void {
        if (!this.capacity || !this.agentsCount) {
            throw new Error("Queue executes a trigger when the capacity and agents count do not exist");
        }

        if (this.capacity <= this.agentsCount) {
            throw new Error("Queue should accept another agent, but it is overcrowded");
        }

        this.take();

    }

    public requestSendAgent(): void {
        if (!this.nextElement) {
            throw new Error("Queue dispatches agents to the next element when the next element does not exist.");
        }

        while (IS_QUEUE_SEND_AGENTS) {
            if (!(this.agentsCount !== 0)) {
                return;
            }

            this.nextElement.trigger()
        }
    }

    public getDataInfo() {
        if (!this.agentsCount || !this.agentsCameCount || !this.agentsLeftCount) {
            throw new Error("A request for statistical information was made, but the statistics fields did not exist");
        }

        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
        }
    }
}

export default Queue;