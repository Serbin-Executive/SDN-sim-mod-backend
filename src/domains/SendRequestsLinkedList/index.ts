import { TBatchedFunction } from "../meta";
import { SendRequestsLinkedListNode } from "../SendRequestsLinkedListNode";

export class SendRequestsLinkedList {
    private firstNodeInQueue: SendRequestsLinkedListNode | null;

    constructor() {
        this.firstNodeInQueue = null;
    }

    public addFunction(addingFunction: TBatchedFunction): void {
        const newFunctionInQueue = new SendRequestsLinkedListNode(addingFunction);

        if (!this.firstNodeInQueue) {
            this.firstNodeInQueue = newFunctionInQueue;
            return;
        }

        let functionState: SendRequestsLinkedListNode = this.firstNodeInQueue;

        while (functionState.nextNode) {
            functionState = functionState.nextNode;
        }

        functionState.nextNode = newFunctionInQueue;
    }

    public getFirstFunctionInQueue(): TBatchedFunction {
        const completeNode = this.firstNodeInQueue;

        if (!completeNode || !completeNode.currentFunction) {
            throw new Error("Cannot get first function in Queue, first function is undefined");
        }

        const completeFunction = completeNode.currentFunction;
        this.firstNodeInQueue = completeNode.nextNode;

        return completeFunction;
    }
}