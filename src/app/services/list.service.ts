import {Injectable} from "@angular/core";

export interface ListStructure {
    id: string;
    name: string;
    root: boolean;
    rootNode: string;
    nodes: ListStructure[];
}

@Injectable()

export class ListService {
    lists: { [key: string]: ListStructure } = {
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

    static getNodes(nodes) {
        return nodes.map(node => {
            const customNode = {
                id: node.id,
                name: node.name,
                root: false,
                rootNode: node.hasRootNode,
                nodes: []
            };

            if (node.children.length !== 0) {
                customNode.nodes = ListService.getNodes(node.children);
            }

            return customNode;
        });
    }

    searchNodeById(id: string): string {
        return this.searchId(Object.values(this.lists), id);
    }

    private searchId(nodes: ListStructure[], nodeId: string): string {
        for (const node of nodes) {
            if (node) {
                if (node.id === nodeId) {
                    return node.name;
                } else if (node.nodes.length !== 0) {
                    const name = this.searchId(node.nodes, nodeId);
                    if (name !== "-1") {
                        return name;
                    }
                }
            }
        }
        return "-1";
    }

    searchNodeByName(nodeName: string): string {
        return this.searchName(Object.values(this.lists), nodeName);
    }

    private searchName(nodes: ListStructure[], nodeName: string): string {
        for (const node of nodes) {
            if (node) {
                if (node.name === nodeName) {
                    return node.id;
                } else if (node.nodes.length !== 0) {
                    const iri = this.searchName(node.nodes, nodeName);
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
                nodes: ListService.getNodes(data.children)
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
