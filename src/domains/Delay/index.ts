import NetworkElement from "../NetworkElement";
import { IGetDataInfo } from "../meta";

class Delay extends NetworkElement {
    private delayValue: number;

    constructor() {
        super()

        this.delayValue = 0;
    }

    public getDelayValue(): number {
        return this.delayValue;
    }

    public setDelayValue(value: number): void {
        this.delayValue = value;
    }

    public isTakeAvailable(): void {}

    public trigger(): void {}

    public getDataInfo(): IGetDataInfo {
        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
            delayValue: this.delayValue,
        }
    }
}

export default Delay;