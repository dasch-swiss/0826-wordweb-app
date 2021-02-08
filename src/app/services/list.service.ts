import {Injectable} from "@angular/core";
import {TreeTableService} from "./tree-table.service";
import {List} from "@dasch-swiss/dsp-js";
import {IListNode} from "../model/ListModel";

@Injectable()

export class ListService {
    private _lists: { [key: string]: IListNode } = {
        gender: null,
        language: null,
        image: null,
        researchField: null,
        marking: null,
        functionVoice: null,
        formalClass: null,
        genre: null,
        subject: null,
        status: null,
        placeVenue: null,
    };

    constructor(private _treeTableService: TreeTableService) {
    }

    private getNodes(nodes, parentId): IListNode[] {
        return nodes.map(node => {
            const customNode: IListNode = {
                id: node.id,
                name: node.name,
                rootNodeId: node.hasRootNode,
                parentNodeId: parentId,
                nodes: []
            };

            if (node.children.length !== 0) {
                customNode.nodes = this.getNodes(node.children, node.id);
            }

            return customNode;
        });
    }

    getNode(id: string): IListNode | null {
        return this.getNodeByNodeId(Object.values(this._lists), id);
    }

    private getNodeByNodeId(nodes: IListNode[], nodeId: string): IListNode | null {
        for (const node of nodes) {
            if (node) {
                if (node.id === nodeId) {
                    return node;
                } else if (node.nodes.length !== 0) {
                    const foundNode = this.getNodeByNodeId(node.nodes, nodeId);
                    if (foundNode) {
                        return foundNode;
                    }
                }
            }
        }
        return null;
    }

    getNameOfNode(id: string): string {
        return this.getNameByNodeId(Object.values(this._lists), id);
    }

    private getNameByNodeId(nodes: IListNode[], nodeId: string): string {
        for (const node of nodes) {
            if (node) {
                if (node.id === nodeId) {
                    return node.name;
                } else if (node.nodes.length !== 0) {
                    const name = this.getNameByNodeId(node.nodes, nodeId);
                    if (name !== "-1") {
                        return name;
                    }
                }
            }
        }
        return "-1";
    }

    getIdOfNode(nodeName: string): string {
        return this.getIdByNodeName(Object.values(this._lists), nodeName);
    }

    private getIdByNodeName(nodes: IListNode[], nodeName: string): string {
        for (const node of nodes) {
            if (node) {
                if (node.name === nodeName) {
                    return node.id;
                } else if (node.nodes.length !== 0) {
                    const iri = this.getIdByNodeName(node.nodes, nodeName);
                    if (iri !== "-1") {
                        return iri;
                    }
                }
            }
        }
        return "-1";
    }

    getFlattenList(listName: string): IListNode[] {
        if (this._lists[listName] == undefined) {
            throw new Error(`list ${listName} does not exist`);
        }

        return this._treeTableService.flattenTree(this._lists[listName].nodes);
    }

    getList(listName: string): IListNode {
        if (this._lists[listName] == undefined) {
            throw new Error(`list ${listName} does not exist`);
        }

        return this._lists[listName];
    }

    getMinNodeInfo(node: IListNode) {
        let newNode = {};
        newNode["id"] = node.id;
        newNode["name"] = node.name;
        if (node.rootNodeId !== node.parentNodeId) {
            newNode["parent id"] = node.parentNodeId;
            newNode["parent name"] = this.getNameOfNode(node.parentNodeId);
        } else {
            newNode["parent id"] = null;
            newNode["parent name"] = null;
        }
        return newNode;
    }

    printLists() {
        console.log(this._lists);
    }

    set list(list: List) {
        if (this._lists.hasOwnProperty(list.listinfo.name)) {

            this._lists[list.listinfo.name] = {
                id: list.listinfo.id,
                name: list.listinfo.name,
                rootNodeId: list.listinfo.id,
                parentNodeId: null,
                nodes: this.getNodes(list.children, list.listinfo.id)
            };
        }
    }

}
