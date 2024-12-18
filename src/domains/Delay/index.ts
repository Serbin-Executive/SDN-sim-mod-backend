import NetworkElement from "../NetworkElement";

class Delay extends NetworkElement {
    private delayValue: number | null = null;

    public getDelayValue(): number {
        if (!this.delayValue) {
            throw new Error;
        }
        return this.delayValue;
    }

    public setDelayValue(value: number): void {
        this.delayValue = value;
    }

    public isTakeAvailable(): void {

    }

    public take(): void {
        
    }

    public trigger(): void {
        
    }

    public getInfo(): string {
        return `${this.getAgentsCount}, ${this.getAgentsCameCount}, ${this.getAgentsLeftCount}, ${this.getDelayValue}`
    }
}

export default Delay;