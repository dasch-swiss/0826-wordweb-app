import {Injectable} from "@angular/core";

export interface ListStructure {
    id: string;
    name: string;
    root: boolean;
    rootName: string;
    nodes: any[];
}

@Injectable({
    providedIn: "root"
})
export class ListService {
    lists = {
        gender: {},
        language: {},
        image: {},
        researchField: {},
        marking: {},
        functionVoice: {},
        formalClass: {},
        genre: {},
        subject: {},
        status: {},
        placeVenue: {},
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

    // static searchIRI(nodeIRI: string, list: any) {
    //     for (const node of Object.values(list.nodes)) {
    //
    //         if (node.id === nodeIRI) {
    //             return node.rootNode;
    //         } else {
    //             if (node.nodes.length > 0) {
    //                 const bla = this.searchIRI(nodeIRI, node);
    //                 if (bla !== "-1") {
    //                     return bla;
    //                 }
    //             }
    //         }
    //     }
    //
    //     return "-1";
    // }

    constructor() {
    }

    setAllLists(data) {
        if (this.lists[data.listinfo.name]) {

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
        return this.lists[name] ? this.lists[name].id : new Error("List name does not exist");
    }

    // getRootNode(nodeIRI: string) {
    //     const lists = Object.values((this.lists));
    //
    //     for (const list of lists) {
    //         const rootIRI = ListService.searchIRI(nodeIRI, list);
    //         if (rootIRI !== "-1") {
    //             return rootIRI;
    //         }
    //     }
    //
    //     return "-1";
    //     // return throwError("Node IRI is wrong");
    // }

    print() {
        console.log(this.lists);
    }

}
