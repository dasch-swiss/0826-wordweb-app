import {Injectable} from "@angular/core";
import {KnoraApiConfig, KnoraApiConnection} from "@knora/api";
import {GravesearchBuilderService} from "./gravesearch-builder.service";
import {IDisplayedClass} from "../model/displayModel";

@Injectable({
    providedIn: "root"
})
export class KnoraService {
    readonly url = "http://rdfh.ch/projects/0826";
    readonly urlOntology = "http://www.knora.org/ontology/0826/teimww";
    readonly protocol = "http";
    readonly host = "0.0.0.0";
    readonly port = 3333;

    knoraApiConnection: KnoraApiConnection;

    constructor(private gBuilder: GravesearchBuilderService) {
        const config = new KnoraApiConfig(this.protocol, this.host, this.port);
        this.knoraApiConnection = new KnoraApiConnection(config);
    }

    login(email: string, password: string): any {
        return this.knoraApiConnection.v2.auth.login("email", email, password);
    }

    search(structure: IDisplayedClass, priority: number, amount: boolean, offset: number) {
        const graveSearch = this.gBuilder.getQuery(structure, priority, offset);
        console.log(graveSearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(graveSearch);
    }

    getProjectOntology() {
        const url = `http://0.0.0.0:3333/ontology/0826/teimww/simple/v2`;
    }

    getAllLists(iri: string) {
        const bla = `http://rdfh.ch/projects/0826`;
        const url = `http://0.0.0.0:3333/admin/lists?projectIri=http://rdfh.ch/projects/0826`;
    }

    getList(iri: string) {
        const iriEncoded = encodeURIComponent(iri);
        const url = `http://0.0.0.0:3333/v2/lists/`;
    }

    getNodeOfList(iri: string) {
        const iriEncoded = encodeURIComponent(iri);
        const url = `http://0.0.0.0:3333/v2/node/`;
    }

    getResource(iri: string) {
        const iriEncoded = encodeURIComponent(iri);
        const url = `http://0.0.0.0:3333/v2/resources/`;
    }
}
