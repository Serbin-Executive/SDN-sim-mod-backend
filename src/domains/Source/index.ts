import NetworkElementBase from "../NetworkElementBase";

class Source extends NetworkElementBase {
    private agentsLeftCount: number = 0;
    private nextElement: NetworkElementBase | null = null;

    constructor() {
        super();
    }

    public trigger(): void {
        if (!this.nextElement) {
            console.error("Next element not exist");
            return;
        }
        this.nextElement.trigger;
    }

    public getInfo(): string {
        return `${this.agentsLeftCount}`
    }

    public getAgentsLeftCount(): number {
        return this.agentsLeftCount;
    }

    public setNextElement(element: NetworkElementBase): void {
        this.nextElement = element;
    }
}

export default Source;