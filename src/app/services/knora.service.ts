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
            ?passage teimww:hasPage ?page .
            ?passage teimww:occursIn ?book .
            ?passage teimww:wasContributedBy ?contributor .
            ?passage teimww:contains ?lexia .
            ?passage teimww:isMentionedIn ?sPassage .
            OPTIONAL {
                ?passage teimww:hasTextHist ?textHist .
            }
            OPTIONAL {
                ?passage teimww:hasPageHist ?pageHist .
            }
            OPTIONAL {
                ?passage teimww:hasMarking ?marking .
            }
            OPTIONAL {
                ?passage teimww:hasStatus ?status .
            }
            OPTIONAL {
                ?passage teimww:hasFunctionVoice ?function .
            }
            OPTIONAL {
                ?passage teimww:hasResearchField ?research .
            }
            OPTIONAL {
                ?passage teimww:publicComment ?pubComment .
            }

            ?sPassage teimww:hasPage ?sPage .
            ?sPassage teimww:occursIn ?sBook .
            OPTIONAL {
                ?sPassage teimww:hasText ?sText .
            }

            ?sBook teimww:bookTitle ?sBt .
            ?sBook teimww:isWrittenBy ?sAuthor .

            ?sAuthor teimww:firstName ?sFn .
            ?sAuthor teimww:lastName ?sLn .

            ?lexia teimww:lexiaTitle ?lt .

            ?book teimww:bookTitle ?bt .
            ?book teimww:isWrittenBy ?author .

            ?author teimww:firstName ?fn .
            ?author teimww:lastName ?ln .

            ?contributor teimww:firstName ?conFn .
            ?contributor teimww:lastName ?conLn .

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

    getPassageAuthor(authorIri: string) {
        const bind = authorIri ? `BIND (<${authorIri}> AS ?author)` : "";
        const graveSearch = `
        PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
        PREFIX teimww: <http://0.0.0.0:3333/ontology/0826/teimww/simple/v2#>
        CONSTRUCT {
            ?passage knora-api:isMainResource true .
            ?passage teimww:hasText ?text .
        } WHERE {
            ${bind}
            ?passage a teimww:passage .
            ?passage teimww:hasText ?text .
            ?passage teimww:hasPage ?page .
            ?passage teimww:occursIn ?book .
            ?passage teimww:wasContributedBy ?contributor .
            ?passage teimww:contains ?lexia .
            ?passage teimww:isMentionedIn ?sPassage .
            OPTIONAL {
                ?passage teimww:hasTextHist ?textHist .
            }
            OPTIONAL {
                ?passage teimww:hasPageHist ?pageHist .
            }
            OPTIONAL {
                ?passage teimww:hasMarking ?marking .
            }
            OPTIONAL {
                ?passage teimww:hasStatus ?status .
            }
            OPTIONAL {
                ?passage teimww:hasFunctionVoice ?function .
            }
            OPTIONAL {
                ?passage teimww:hasResearchField ?research .
            }
            OPTIONAL {
                ?passage teimww:publicComment ?pubComment .
            }

            ?sPassage teimww:hasPage ?sPage .
            ?sPassage teimww:occursIn ?sBook .
            OPTIONAL {
                ?sPassage teimww:hasText ?sText .
            }

            ?sBook teimww:bookTitle ?sBt .
            ?sBook teimww:isWrittenBy ?sAuthor .

            ?sAuthor teimww:firstName ?sFn .
            ?sAuthor teimww:lastName ?sLn .

            ?lexia teimww:lexiaTitle ?lt .

            ?book teimww:bookTitle ?bt .
            ?book teimww:isWrittenBy ?author .

            ?author teimww:firstName ?fn .
            ?author teimww:lastName ?ln .

            ?contributor teimww:firstName ?conFn .
            ?contributor teimww:lastName ?conLn .
        }
        OFFSET 0
        `;
        console.log(graveSearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(graveSearch);
    }

    getAllBooks(): any {
        const graveSearch = `
        PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
        PREFIX teimww: <http://0.0.0.0:3333/ontology/0826/teimww/simple/v2#>
        CONSTRUCT {
            ?book knora-api:isMainResource true .
            ?book teimww:bookTitle ?bookTitle .
            ?book teimww:bookInternalId ?internalID .
            ?book teimww:isWrittenBy ?author .
            ?book teimww:edition ?edition .
            ?book teimww:editionHist ?editionHist .
            ?book teimww:createdDate ?createdDate .
            ?book teimww:publishDate ?publishDate .
            ?book teimww:firstPerformanceDate ?firstPerformanceDate .
            ?book teimww:hasLanguage ?hasLanguage .
            ?book teimww:hasGenre ?hasGenre .
            ?book teimww:hasSubject ?hasSubject .
            ?book teimww:performedBy ?performedBy .
            ?book teimww:performedIn ?performedIn .
            ?book teimww:lexiaAsBook ?lexiaAsBook .
            } WHERE {
                ?book a teimww:book .
            OPTIONAL {
                ?book teimww:bookTitle ?bookTitle .
            }
            OPTIONAL {
                ?book teimww:bookInternalId ?internalID .
            }
            OPTIONAL {
                ?book teimww:isWrittenBy ?author .
            }
            OPTIONAL {
                ?book teimww:edition ?edition .
            }
            OPTIONAL {
                ?book teimww:editionHist ?editionHist .
            }
            OPTIONAL {
                ?book teimww:createdDate ?createdDate .
            }
            OPTIONAL {
                ?book teimww:publishDate ?publishDate .
            }
            OPTIONAL {
                ?book teimww:firstPerformanceDate ?firstPerformanceDate .
            }
            OPTIONAL {
                ?book teimww:hasLanguage ?hasLanguage .
            }
            OPTIONAL {
                ?book teimww:hasGenre ?hasGenre .
            }
            OPTIONAL {
                ?book teimww:hasSubject ?hasSubject .
            }
            OPTIONAL {
                ?book teimww:performedBy ?performedBy .
            }
            OPTIONAL {
                ?book teimww:performedIn ?performedIn .
            }
            OPTIONAL {
                ?book teimww:lexiaAsBook ?lexiaAsBook .
            }
        }
        OFFSET 0
        `;
        console.log(graveSearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(graveSearch);
    }

    getAllListNodeIris() {
    }
}
