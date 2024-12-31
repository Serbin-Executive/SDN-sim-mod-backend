import { TBatchedFunction } from "../meta";

export class SendRequestsLinkedListNode {
    public currentFunction: TBatchedFunction | null;
    public nextNode: SendRequestsLinkedListNode | null;

    constructor(currentFunction: TBatchedFunction) {
        this.currentFunction = currentFunction;
        this.nextNode = null;
    }
}