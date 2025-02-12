import NetworkElement from "../NetworkElement";
import EventEmitter from "events";
import Agent from "../Agent";
import { TServiceProcessList } from "../../utils/constants";
import { ISurroundingNetworkElements } from "../../utils/constants";
import { ICurrentState } from "../../utils/constants";


class DelayElement extends NetworkElement {
    private delayValue: number;
    private serviceProcessList: TServiceProcessList;

    constructor() {
        super();
        this.delayValue = 0;
        this.serviceProcessList = [];
        this.takeSignal = new EventEmitter();
    }

    // public checkTakeAvailable(): void {
    //     if (this.agentsCount >= this.capacity) {
    //         this.isTakeAvailable = false;
    //         return;
    //     }

    //     this.isTakeAvailable = true;
    // }

    public trigger(initiator: NetworkElement, newAgent: Agent): void {
        // this.checkTakeAvailable();

        // if (this.agentsCount >= this.capacity) {
        //     return false;
        // }

        this.takeAgents(initiator, newAgent);

        this.startDelay(newAgent);
    }

    private startDelay(newAgent: Agent): void {

        const newServiceProcess: NodeJS.Timeout = setTimeout(() => {
            if (!this.nextElement) {
                throw new Error("Triggered startDelay() into invalid NetworkElement");
            }

            // this.removeAgentFromList(newAgent);
            this.nextElement.trigger(this, newAgent);

            if (!this.takeSignal) {
                throw new Error("Took startDelay() into invalid takeSignal");
            }

            this.takeSignal.emit("takeAvailable");

        }, this.delayValue);

        this.serviceProcessList.push(newServiceProcess);
    }

    public getDelayValue(): number {
        return this.delayValue;
    }

    public getServiceProcessList(): TServiceProcessList {
        return this.serviceProcessList;
    }

    public getSurroundingElements(): ISurroundingNetworkElements {
        if (!this.previousElements || !this.nextElement) {
            throw new Error("Cannot get surrounding elements, previous or next elements are undefined");
        }

        return {
            previousElements: this.previousElements,
            nextElement: this.nextElement,
        }
    }

    public getCurrentState(): ICurrentState {
        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
            delayValue: this.delayValue,
            delayCapacity: this.capacity,
        }
    }

    public setDelayValue(value: number): void {
        this.delayValue = value;
    }

    public stop(): void {
        this.serviceProcessList.forEach((serviceProcess) => {
            clearTimeout(serviceProcess);
        });

    }
}

export default DelayElement;