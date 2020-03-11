import {Injectable} from "@angular/core";
import {KnoraApiConfig, KnoraApiConnection} from "@knora/api";

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

    constructor() {
        const config = new KnoraApiConfig(this.protocol, this.host, this.port);
        this.knoraApiConnection = new KnoraApiConnection(config);
    }

    login(email: string, password: string): any {
        return this.knoraApiConnection.v2.auth.login("email", email, password);
    }

    getOntology(iri: string): any {
        return null;
    }

    getResource(iri: string): any {

    }

    getPassageWithText(text: string): any {
        let filter = "";
        // Checks if text is not null, undefined or empty
        if (text.trim()) {
            filter = `FILTER regex(?text, "${text}", "i")`;
        }
        // Appends the text as filter in the gravesearch
        const graveSearch = `
        PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
        PREFIX teimww: <http://0.0.0.0:3333/ontology/0826/teimww/simple/v2#>
        CONSTRUCT {
            ?passage knora-api:isMainResource true .
            ?passage teimww:hasText ?text .
        } WHERE {
            ?passage a teimww:passage .
            ?passage teimww:hasText ?text .
            ?passage teimww:occursIn ?book .
            ?book teimww:isWrittenBy ?author .
            ?author teimww:firstName ?fn .
            ?author teimww:lastName ?ln .
            ${filter}
        }
        OFFSET 0
        `;
        console.log(graveSearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(graveSearch);
    }

    getPassageWithBookTitle(title: string): any {
        let filter = "";
        if (title.trim()) {
            filter = `FILTER knora-api:match(?bt, "${title}")`;
        }
        const graveSearch = `
        PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
        PREFIX teimww: <http://0.0.0.0:3333/ontology/0826/teimww/simple/v2#>
        CONSTRUCT {
            ?passage knora-api:isMainResource true .
            ?passage teimww:hasText ?text .
        } WHERE {
            ?passage a teimww:passage .
            ?passage teimww:hasText ?text .
            ?passage teimww:occursIn ?book .
            ?book teimww:bookTitle ?bt .
            ${filter}
        }
        OFFSET 0
        `;
        console.log(graveSearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(graveSearch);
    }
}
