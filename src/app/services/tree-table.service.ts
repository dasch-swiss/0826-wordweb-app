import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class TreeTableService {

    constructor() {
    }

    toTreeTable(rootNode: any) {
        const depth = 0;
        const treeTable = JSON.parse(JSON.stringify(rootNode));
        return this.traverseTree(depth, treeTable);
    }

    traverseTree(counter, treeTable) {
        treeTable.map((el) => {
            el.isVisible = true;
            el.isExpanded = true;
            el.depth = counter;
            return el.nodes.length > 0 ? this.traverseTree((counter + 1), el.nodes) : el;
        });
        return treeTable;
    }

    flattenTree(acc, element) {
        acc.push(element);
        if (element.nodes.length > 0) {
            element.nodes.map((el) => {
                this.flattenTree(acc, el);
            });
        }
        return acc;
    }
}
