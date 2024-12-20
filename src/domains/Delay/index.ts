import NetworkElement from "../NetworkElement";
import { IGetDataInfo } from "../meta";

class Delay extends NetworkElement {
    private delayValue: number;
    private serviceDeviceTimers: number[];
    protected isSourceOrSink: boolean;


    constructor() {
        super()
        this.isSourceOrSink = false;
        this.delayValue = 0;
        this.serviceDeviceTimers = Array.from({ length: this.capacity }, () => 0);
    }

    public getDelayValue(): number {
        return this.delayValue;
    }

    public setDelayValue(value: number): void {
        this.delayValue = value;
    }

    public isTakeAvailable(): boolean {
        if (!this.nextElement) {
            throw new Error;
        }

        for (let serviceTimerIndex = 0; serviceTimerIndex < this.serviceDeviceTimers.length; serviceTimerIndex++) {
            if (this.serviceDeviceTimers[serviceTimerIndex] == this.delayValue) {
                return true;
            }
        }

        return false;
    }

    public trigger(): void {
        if (!this.isTakeAvailable) {
            return;
        }

        this.give();
        this.take();
    }

    public getDataInfo(): IGetDataInfo {
        return {
            agentsCount: this.agentsCount,
            agentsCameCount: this.agentsCameCount,
            agentsLeftCount: this.agentsLeftCount,
            delayValue: this.delayValue,
        }
    }

    private give(): void {
        if (!this.nextElement) {
            throw new Error;
        }

        for (let serviceTimerIndex = 0; serviceTimerIndex < this.serviceDeviceTimers.length; serviceTimerIndex++) {
            if (this.serviceDeviceTimers[serviceTimerIndex] == this.delayValue) {
                this.serviceDeviceTimers[serviceTimerIndex] == 0;
                this.nextElement.trigger();
                return;
            }
        }
    }
}

export default Delay;