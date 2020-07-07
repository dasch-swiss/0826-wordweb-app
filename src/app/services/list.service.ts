import {Injectable} from "@angular/core";

export interface ListStructure {
    id: string;
    name: string;
    root: boolean;
    rootNode: string;
    nodes: ListStructure[];
}

@Injectable({
    providedIn: "root"
})
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

    searchNode(nodeName: string): string {
        return this.searchIri(Object.values(this.lists), nodeName);
    }

    private searchIri(nodes: ListStructure[], nodeName: string): string {
        for (const node of nodes) {
            if (node) {
                if (node.name === nodeName) {
                    return node.id;
                } else if (node.nodes.length !== 0) {
                    const iri = this.searchIri(node.nodes, nodeName);
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

    setAllLists(data) {
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

    print() {
        console.log(this.lists);
    }

}
