import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class GravesearchBuilderService {

    constructor() {
    }

    getPrefix(): string {
      return `
        PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
        PREFIX teimww: <http://0.0.0.0:3333/ontology/0826/teimww/v2#>
      `;
    }

    getPassages(): string {
        return `
        PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
        PREFIX teimww: <http://0.0.0.0:3333/ontology/0826/teimww/v2#>

                CONSTRUCT {
                    ?passage knora-api:isMainResource true .
                    ?passage teimww:hasText ?text .
                } WHERE {
                    ?passage a teimww:passage .
                    ?passage teimww:hasText ?text .
                    ?text knora-api:valueAsString ?titleString .
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
                        ?passage teimww:hasPublicComment ?pubComment .
                    }

                    ?sPassage teimww:hasPage ?sPage .
                    ?sPassage teimww:occursIn ?sBook .
                    OPTIONAL {
                        ?sPassage teimww:hasText ?sText .
                    }

                    ?sBook teimww:hasBookTitle ?sBt .
                    ?sBook teimww:isWrittenBy ?sAuthor .

                    ?sAuthor teimww:hasFirstName ?sFn .
                    ?sAuthor teimww:hasLastName ?sLn .

                    ?lexia teimww:hasLexiaTitle ?lt .

                    ?book teimww:hasBookTitle ?bt .
                    ?book teimww:isWrittenBy ?author .
                    ?book teimww:hasGenre ?genre .
                    OPTIONAL {
                        ?book teimww:hasCreationDate ?cd .
                    }

                    ?author teimww:hasFirstName ?fn .
                    ?author teimww:hasLastName ?ln .

                    ?contributor teimww:hasFirstName ?conFn .
                    ?contributor teimww:hasLastName ?conLn .

                    FILTER regex(?titleString, "Queen Margaret", "i")
                }

                OFFSET 0
      `;
    }

    getBooks(): string {
        return ``;
    }

    getAuthors(): string {
        return ``;
    }
}
