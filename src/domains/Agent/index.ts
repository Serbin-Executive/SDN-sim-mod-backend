import { randomUUID } from "crypto";

class Agent {
    private id: string;

    constructor() {
        this.id = randomUUID();
    }

    getId(): string {
        return this.id;
    }
}

export default Agent;