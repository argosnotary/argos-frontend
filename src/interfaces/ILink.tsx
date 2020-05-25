import {ISignature} from "./ILayout";

export interface ILink {
    runId: string;
    layoutSegmentName: string;
    stepName: string;
    command: string[];
    materials: IArtifact[];
    products: IArtifact[];
}

export interface IArtifact {
    uri: string;
    hash: string;
}

export interface ILinkMetaBlock {
    supplyChainId: string;
    signature: ISignature;
    link: ILink;
}