import NetworkElement from "../NetworkElement";
import { IGetDataInfo, IServiceTimer } from "../meta";

class Delay extends NetworkElement {
    private delayValue: number;
    private isTakeAvailable: boolean;

    constructor() {
        super()
        this.delayValue = 0;
        this.isTakeAvailable = true;
    }

    public trigger(): void {
        this.checkTakeAvailable();

        if (!this.isTakeAvailable) {
            return;
        }

        this.take();
        this.serviceProcess()
    }

    public checkTakeAvailable(): void {
        if (!this.agentsCount || !this.capacity) {
            throw new Error();
        }

        if (this.agentsCount >= this.capacity) {
            this.isTakeAvailable = false;
            return;
        }

        this.isTakeAvailable = true;
        return;
    }

    private serviceProcess(): void {
        setTimeout(() => {
            if (!this.nextElement) {
                throw new Error("Delay performs sending the next agent to the next element when the next element does not exist");
            }

            this.nextElement.trigger()
        }, this.delayValue)
    }

    public getDelayValue(): number {
        return this.delayValue;
    }

    public getDataInfo(): IGetDataInfo {
        if (!this.agentsCount || !this.agentsCameCount || !this.agentsLeftCount) {
            throw new Error("A request for statistical information was made, but the statistics fields did not exist");
        }

        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
            delayValue: this.delayValue,
        }
    }

    public setDelayValue(value: number): void {
        this.delayValue = value;
    }
}

export default Delay;