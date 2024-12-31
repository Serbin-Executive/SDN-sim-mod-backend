import Agent from "./Agent";
import NetworkElement from "./NetworkElement";
import EventEmitter from "events";

export type TSystem = "system";
export type TNetworkElementInitiator = NetworkElement | TSystem;
export type TNetworkElementId = string;
export type TPreviousNetworkElements = Map<string, NetworkElement> | null;
export type TNextNetworkElement = NetworkElement | null;
export type TNetworkElementCapacity = number;
export type TNetworkElementAgentsCount = number;
export type TNetworkElementAgentsCameCount = number;
export type TNetworkElementAgentsLeftCount = number;
export type TStateValue =
    | TPreviousNetworkElements
    | TNextNetworkElement
    | TNetworkElementCapacity
    | TNetworkElementAgentsCount
    | TNetworkElementAgentsCameCount
    | TNetworkElementAgentsLeftCount;
export type TTakeSignal = EventEmitter | null;
export type TAgentsList = Agent[];
export type TBatchedFunction = () => void;

export interface ICurrentState {
    [dataField: string]: number;
}

export interface ISurroundingNetworkElements {
    previousElements?: TPreviousNetworkElements;
    nextElement?: TNextNetworkElement;
}
