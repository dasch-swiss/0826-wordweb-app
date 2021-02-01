import {Injectable} from "@angular/core";

export interface ListStructure {
    id: string;
    name: string;
    root: boolean;
    rootNode: string;
    parentId: string;
    nodes: ListStructure[];
}

@Injectable()

export class ListService {
    private lists: { [key: string]: ListStructure } = {
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

    static getNodes(nodes, parentId) {
        return nodes.map(node => {
            const customNode = {
                id: node.id,
                name: node.name,
                root: false,
                rootNode: node.hasRootNode,
                parentId: parentId,
                nodes: []
            };

            if (node.children.length !== 0) {
                customNode.nodes = ListService.getNodes(node.children, node.id);
            }

            return customNode;
        });
    }

    getNode(id: string): any {
        return this.getNodeByNodeId(Object.values(this.lists), id);
    }

    private getNodeByNodeId(nodes: ListStructure[], nodeId: string): any {
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
        return this.getNameByNodeId(Object.values(this.lists), id);
    }

    private getNameByNodeId(nodes: ListStructure[], nodeId: string): string {
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
        return this.getIdByNodeName(Object.values(this.lists), nodeName);
    }

    private getIdByNodeName(nodes: ListStructure[], nodeName: string): string {
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

    constructor() {
    }

    set setAllLists(data) {
        if (this.lists.hasOwnProperty(data.listinfo.name)) {

            this.lists[data.listinfo.name] = {
                id: data.listinfo.id,
                name: data.listinfo.name,
                root: true,
                rootNode: data.listinfo.id,
                parentId: null,
                nodes: ListService.getNodes(data.children, data.listinfo.id)
            };
        }
    }

    getListId(name: string): string {
        return this.lists.hasOwnProperty(name) ? this.lists[name].id : "-1";
    }

    getList(name: string): ListStructure {
        return this.lists.hasOwnProperty(name) ? this.lists[name] : null;
    }

    print() {
        console.log(this.lists);
    }

}
