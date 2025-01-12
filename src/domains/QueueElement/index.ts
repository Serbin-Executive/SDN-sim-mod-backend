import { SendRequestsLinkedList } from "../SendRequestsLinkedList";
import NetworkElement from "../NetworkElement";
import { ISurroundingNetworkElements, TNetworkElementAgentsLostCount } from "../meta";
import Agent from "../Agent";

class QueueElement extends NetworkElement {
    private sendRequestsQueue: SendRequestsLinkedList;
    private agentsLostCount: TNetworkElementAgentsLostCount;

    constructor() {
        super();

        this.sendRequestsQueue = new SendRequestsLinkedList();
        this.agentsLostCount = 0;
    }

    public trigger(initiator: NetworkElement, newAgent: Agent): boolean {
        const currentNextElement = this.nextElement;

        if ((this.agentsCount + 1) > this.capacity) {
            this.agentsLostCount += 1;
            
            return false;
        }

        this.takeAgents(initiator, newAgent);

        if (!currentNextElement) {
            throw new Error("Cannot trigger next element, next elements are undefined");
        }

        this.sendRequestsQueue.addFunction(() => currentNextElement.trigger(this, newAgent));

        if (!currentNextElement.takeSignal) {
            currentNextElement.trigger(this, newAgent);

            return true;
        }

        const isTakeAvailable: boolean = currentNextElement.trigger(this, newAgent);

        if (!isTakeAvailable) {
            currentNextElement.takeSignal.once("takeAvailable", () => {
                const takingFunction = this.sendRequestsQueue.getFirstFunctionInQueue();
                takingFunction();
            }
            );

            return false;
        }

        return true;
    }

    public getSendRequestsQueue(): SendRequestsLinkedList {
        return this.sendRequestsQueue;
    }

    public getAgentsLostCount(): TNetworkElementAgentsLostCount {
        return this.agentsLostCount;
    }

    public getSurroundingElements(): ISurroundingNetworkElements {
        if (!this.previousElements || !this.nextElement) {
            throw new Error("Cannot get surroundings elements, previous or next elements are undefined");
        }

        return {
            previousElements: this.previousElements,
            nextElement: this.nextElement,
        }
    }

    public getCurrentState() {
        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
            agentsLostCount: this.agentsLostCount,
        }
    }

    public setSendRequestsQueue(newQueue: SendRequestsLinkedList) {
        this.sendRequestsQueue = newQueue;
    }

    public setAgentsLostCount(agentsLostCount: TNetworkElementAgentsLostCount): void {
        this.agentsLostCount = agentsLostCount;
    }
}

export default QueueElement;