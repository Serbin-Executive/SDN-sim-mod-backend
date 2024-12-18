import { error } from "console";
import NetworkElementBase from "../NetworkElementBase";

class Sink extends NetworkElementBase {
    private agentsCameCount: number = 0;
    private previousElement: NetworkElementBase | null = null;

    constructor() {
        super();
    }

    public take(): void {

    }

    public trigger(): void {
        if (!this.previousElement) {
            throw new Error;
        }
        this.take;
    }

    public getAgentsCameCount(): number {
        return this.agentsCameCount;
    }

    public getInfo(): string {
        return `${this.agentsCameCount}`
    }

    public setPreviousElement(element: NetworkElementBase): void {
        this.previousElement = element;
    }
}

export default Sink;