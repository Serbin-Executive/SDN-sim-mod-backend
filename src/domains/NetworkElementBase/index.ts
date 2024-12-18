import { randomUUID } from "crypto";

abstract class NetworkElementBase {
    private id: string = `${randomUUID}`;

    constructor() {}

    public abstract trigger(): void;

    public getId() {
        return this.id;
    }

    public abstract getInfo(): string;
}

export default NetworkElementBase;