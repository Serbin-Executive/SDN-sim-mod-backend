import SourceElement from "../SourceElement";
import NetworkElement from "../NetworkElement";
import QueueElement from "../QueueElement";
import DelayElement from "../DelayElement";
import { randomUUID } from "crypto";

export class Model {
    private ID: string;
    private sourceElements: SourceElement[];
    private networkElements: NetworkElement[];
    private queueElements: QueueElement[];
    private delayElements: DelayElement[];

    constructor() {
        this.ID = randomUUID();
        this.sourceElements = [];
        this.networkElements = [];
        this.queueElements = [];
        this.delayElements = [];
    }

    public getID(): string {
        return this.ID;
    }

    public getSourceElements(): SourceElement[] {
        return this.sourceElements;
    }

    public getNetworkElements(): NetworkElement[] {
        return this.networkElements;
    }
    
    public getQueueElements(): QueueElement[] {
        return this.queueElements;
    }
    
    public getDelayElements(): DelayElement[] {
        return this.delayElements;
    }

    public setSourceElements(sourceElements: SourceElement[]): void {
        this.sourceElements = sourceElements;
    }

    public setNetworkElements(networkElements: NetworkElement[]): void {
        this.networkElements = networkElements;
    }

    public setQueueElements(queueElements: QueueElement[]): void {
        this.queueElements = queueElements;
    }

    public setDelayElements(delayElements: DelayElement[]): void {
        this.delayElements = delayElements;
    }
}