import NetworkElement from "./NetworkElement";

export type TSystem = "system";
export type TNetworkElementInitiator = NetworkElement | TSystem;
export type TNetworkElementId = string;
export type TPreviousNetworkElements = Map<string, NetworkElement> | null;
export type TNextNetworkElement = NetworkElement | null;
export type TNetworkElementCapacity = number | null;
export type TNetworkElementAgentsCount = number;
export type TNetworkElementAgentsCameCount = number;
export type TNetworkElementAgentsLeftCount = number | null;
export type TStateValue =
    | TPreviousNetworkElements
    | TNextNetworkElement
    | TNetworkElementCapacity
    | TNetworkElementAgentsCount
    | TNetworkElementAgentsCameCount
    | TNetworkElementAgentsLeftCount;

export interface ICurrentState {
    [dataField: string]: number;
}

export interface ISurroundingNetworkElements {
    previousElements?: TPreviousNetworkElements;
    nextElement?: TNextNetworkElement;
}
