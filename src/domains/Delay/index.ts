import NetworkElement from "../NetworkElement";
import { IGetDataInfo, IServiceTimer } from "../meta";

class Delay extends NetworkElement {
    private delayValue: number;
    private serviceDeviceTimers: IServiceTimer[];
    protected isSourceOrSink: boolean;


    constructor() {
        super()
        this.isSourceOrSink = false;
        this.delayValue = 0;
        this.serviceDeviceTimers = Array.from({ length: this.capacity }, () => ({time: 0, isBusy: false}));
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
            if (this.serviceDeviceTimers[serviceTimerIndex].time == this.delayValue || !this.serviceDeviceTimers[serviceTimerIndex].isBusy) {
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
            if (this.serviceDeviceTimers[serviceTimerIndex].time == this.delayValue || !this.serviceDeviceTimers[serviceTimerIndex].isBusy) {
                this.serviceDeviceTimers[serviceTimerIndex].time == 0;
                this.serviceDeviceTimers[serviceTimerIndex].isBusy == true;
                this.nextElement.trigger();
                return;
            }
        }
    }

    public serviceProcess(): void {
        setInterval(() => {
            for (let serviceTimerIndex = 0; serviceTimerIndex < this.serviceDeviceTimers.length; serviceTimerIndex++) {
                if (this.serviceDeviceTimers[serviceTimerIndex]) {
                     this.serviceDeviceTimers[serviceTimerIndex].time++;
                }
             }
        }, 1000)
    }
}

export default Delay;