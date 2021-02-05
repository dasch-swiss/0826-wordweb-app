export interface IListNode {
    id: string;
    name: string;
    rootNodeId: string;
    parentNodeId: string;
    nodes: IListNode[];
}

export interface ITreeTableNode extends IListNode{
    isVisible: boolean;
    isExpanded: boolean;
    depth: number;
}