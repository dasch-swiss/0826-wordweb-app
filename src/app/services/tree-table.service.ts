import {Injectable} from "@angular/core";
import {IListNode, ITreeTableNode} from "../model/ListModel";

@Injectable({
    providedIn: "root"
})
export class TreeTableService {

    constructor() {
    }

    private traverse(root: any, depth: number, f: (node: any, depth: number) => void) {
        f(root, depth++);
        return root.nodes.map(n => this.traverse(n, depth, f));
    }

    private flatten(acc: IListNode[], root: IListNode) {
        acc.push(root);
        root.nodes.forEach(n => this.flatten(acc, n));
        return acc;
    }

    private traverseExpand(treeTable) {
        treeTable.nodes.forEach((node) => {
            node.isVisible = true;
            if (node.isExpanded && (node.nodes.length > 0)) {
                this.traverseExpand(node);
            }
        });
    }

    private traverseClose(treeTable) {
        treeTable.nodes.forEach((node) => {
            node.isVisible = false;
            if (node.nodes.length > 0) {
                this.traverseClose(node);
            }
        });
    }

    toTreeTableFlatten(root: IListNode): ITreeTableNode[] {
        const cloneRoot = JSON.parse(JSON.stringify(root));
        this.traverse(cloneRoot, 0, (node: any, depth: number) => {
            node.isVisible = true;
            node.isExpanded = true;
            node.depth = depth;
        });
        return cloneRoot.nodes.reduce((acc, list) => this.flatten(acc, list), Array<IListNode>());
    }

    flattenTree(rootNodes: IListNode[]): IListNode[] {
        return rootNodes.reduce((acc, list) => this.flatten(acc, list), Array<IListNode>());
    }

    close(rootNode: any) {
        rootNode.isExpanded = false;
        this.traverseClose(rootNode);
    }

    expand(rootNode: any) {
        rootNode.isExpanded = true;
        this.traverseExpand(rootNode);
    }
}
