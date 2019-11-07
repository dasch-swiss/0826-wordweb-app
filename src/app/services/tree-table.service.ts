import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class TreeTableService {

    constructor() {
    }

    traverse(root: any, depth: number, f: (node: any, depth: number) => void) {
        f(root, depth++);
        return root.nodes.map(n => this.traverse(n, depth, f));
    }

    toTreeTable(root: any): any {
        const cloneRoot = JSON.parse(JSON.stringify(root));
        this.traverse(cloneRoot, 0, (node: any, depth: number) => {
            node.isVisible = true;
            node.isExpanded = true;
            node.depth = depth;
        });
        return cloneRoot;
    }

    flattenTree(acc: any[], root: any) {
        acc.push(root);
        root.nodes.map(n => this.flattenTree(acc, n));
        return acc;
    }

    traverseExpand(treeTable) {
        treeTable.nodes.map((node) => {
            node.isVisible = true;
            if (node.isExpanded && (node.nodes.length > 0)) {
                this.traverseExpand(node);
            }
        });
    }

    traverseClose(treeTable) {
        treeTable.nodes.map((node) => {
            node.isVisible = false;
            if (node.nodes.length > 0) {
                this.traverseClose(node);
            }
        });
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
