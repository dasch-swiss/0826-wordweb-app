import {Injectable} from "@angular/core";
import {IDisplayedClass, IMainClass, IMainClassObject} from "../model/displayModel";

@Injectable({
    providedIn: "root"
})
export class GravesearchBuilderService {
    static readonly ONTO_NAME = "teimww";
    static readonly PERSON_VAR = "person";
    static readonly BOOK_VAR = "book";
    static readonly PASSAGE_VAR = "passage";
    static readonly LEXIA_VAR = "lexia";
    static readonly COMPANY_VAR = "company";
    static readonly VENUE_VAR = "venue";

    private host: string;

    person = {
        hasPersonInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "hasPersonInternalId", "personInternalId")
        },
        hasFirstName: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "hasFirstName", "firstName")
        },
        hasLastName: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "hasLastName", "lastName")
        },
        hasDescription: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "hasDescription", "description")
        },
        hasBirthDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "hasBirthDate", "birthDate")
        },
        hasDeathDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "hasDeathDate", "deathDate")
        },
        hasActiveDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "hasActiveDate", "activeDate")
        },
        hasGender: {
            cardinality: "1",
            type: "List",
            list: "gender",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "hasGender", "gender")
        },
        isLexiaPerson: {
            cardinality: "0-1",
            type: "Resource",
            res: "lexia",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "isLexiaPerson", "lexiaPerson")
        },
        personPerformedIn: {
            cardinality: "0-1",
            type: "Resource",
            res: "book",
            queryStr: this.getQueryStr(GravesearchBuilderService.PERSON_VAR, "personPerformedIn", "personPerformedIn")
        }
    };

    book = {
        hasBookInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasBookInternalId", "bookInternalId")
        },
        hasBookTitle: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasBookTitle", "bookTitle")
        },
        hasEdition: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasEdition", "edition")
        },
        hasEditionHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasEditionHist", "editionHist")
        },
        hasLanguage: {
            cardinality: "1",
            type: "List",
            list: "language",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasLanguage", "language")
        },
        hasGenre: {
            cardinality: "1-n",
            type: "List",
            list: "genre",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasGenre", "genre")
        },
        hasSubject: {
            cardinality: "0-1",
            type: "List",
            list: "subject",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasSubject", "subject")
        },
        hasCreationDate: {
            cardinality: "1",
            type: "Date",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasCreationDate", "creationDate")
        },
        hasPublicationDate: {
            cardinality: "0-1",
            type: "Date",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasPublicationDate", "publicationDate")
        },
        hasFirstPerformanceDate: {
            cardinality: "0-1",
            type: "Date",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasFirstPerformanceDate", "firstPerformanceDate")
        },
        hasBookComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "hasBookComment", "bookComment")
        },
        isWrittenBy: {
            cardinality: "1-n",
            type: "Resource",
            res: "person",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "isWrittenBy", "author")
        },
        performedBy: {
            cardinality: "0-n",
            type: "Resource",
            res: "company",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "performedBy", "performedCompany")
        },
        performedIn: {
            cardinality: "0-n",
            type: "Resource",
            res: "venue",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "performedIn", "performedVenue")
        },

        isLexiaBook: {
            cardinality: "0-n",
            type: "Resource",
            res: "lexia",
            queryStr: this.getQueryStr(GravesearchBuilderService.BOOK_VAR, "isLexiaBook", "lexiaBook")
        }
    };

    passage = {
        hasText: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasText", "text")
        },
        hasTextHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasTextHist", "textHist")
        },
        hasDisplayedTitle: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasDisplayedTitle", "displayedTitle")
        },
        hasPage: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasPage", "page")
        },
        hasPageHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasPageHist", "pageHist")
        },
        hasResearchField: {
            cardinality: "1",
            type: "List",
            list: "researchField",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasResearchField", "research")
        },
        hasFunctionVoice: {
            cardinality: "1-n",
            type: "List",
            list: "functionVoice",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasFunctionVoice", "function")
        },
        hasMarking: {
            cardinality: "1-n",
            type: "List",
            list: "marking",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasMarking", "marking")
        },
        hasStatus: {
            cardinality: "1",
            type: "List",
            list: "status",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasStatus", "status")
        },
        hasInternalComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasInternalComment", "internalComment")
        },
        hasPassageComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "hasPassageComment", "passageComment")
        },
        occursIn: {
            cardinality: "1-n",
            type: "Resource",
            res: "book",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "occursIn", "book")
        },
        isMentionedIn: {
            cardinality: "0-n",
            type: "Resource",
            res: "passage",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "isMentionedIn", "sPassage")
        },
        wasContributedBy: {
            cardinality: "1",
            type: "Resource",
            res: "person",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "wasContributedBy", "contributor")
        },
        contains: {
            cardinality: "0-n",
            type: "Resource",
            res: "lexia",
            queryStr: this.getQueryStr(GravesearchBuilderService.PASSAGE_VAR, "contains", "lexia")
        }
    };

    lexia = {
        hasLexiaInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.LEXIA_VAR, "hasLexiaInternalId", "lexiaInternalId")
        },
        hasLexiaTitle: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.LEXIA_VAR, "hasLexiaTitle", "lexiaTitle")
        },
        hasLexiaDisplayedTitle: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.LEXIA_VAR, "hasLexiaDisplayedTitle", "lexiaDisplayedTitle")
        },
        hasFormalClass: {
            cardinality: "1-n",
            type: "List",
            list: "formalClass",
            queryStr: this.getQueryStr(GravesearchBuilderService.LEXIA_VAR, "hasFormalClass", "formalClass")
        },
        hasImage: {
            cardinality: "0-n",
            type: "List",
            list: "image",
            queryStr: this.getQueryStr(GravesearchBuilderService.LEXIA_VAR, "hasImage", "image")
        },
    };

    company = {
        hasCompanyInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.COMPANY_VAR, "hasCompanyInternalId", "companyInternalId")
        },
        hasCompanyTitle: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.COMPANY_VAR, "hasCompanyTitle", "companyTitle")
        },
        hasMember: {
            cardinality: "0-n",
            type: "Resource",
            res: "person",
            queryStr: this.getQueryStr(GravesearchBuilderService.COMPANY_VAR, "hasMember", "member")
        },
        isLexiaCompany: {
            cardinality: "0-n",
            type: "Resource",
            res: "Lexia",
            queryStr: this.getQueryStr(GravesearchBuilderService.COMPANY_VAR, "isLexiaCompany", "lexiaCompany")
        },
    };

    venue = {
        hasVenueInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.VENUE_VAR, "hasVenueInternalId", "venueInternalId")
        },
        hasPlaceVenue: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravesearchBuilderService.VENUE_VAR, "hasPlaceVenue", "placeVenue")
        },
        isLexiaVenue: {
            cardinality: "1",
            type: "Resource",
            res: "lexia",
            queryStr: this.getQueryStr(GravesearchBuilderService.VENUE_VAR, "isLexiaVenue", "lexiaVenue")
        },
    };

    getClass = {
        person: {
            ref: this.person,
            variable: GravesearchBuilderService.PERSON_VAR
        },
        book: {
            ref: this.book,
            variable: GravesearchBuilderService.BOOK_VAR
        },
        passage: {
            ref: this.passage,
            variable: GravesearchBuilderService.PASSAGE_VAR
        },
        lexia: {
            ref: this.lexia,
            variable: GravesearchBuilderService.LEXIA_VAR
        },
        company: {
            ref: this.company,
            variable: GravesearchBuilderService.COMPANY_VAR
        },
        venue: {
            ref: this.venue,
            variable: GravesearchBuilderService.VENUE_VAR
        }
    };

    set apiURL(host: string) {
        this.host = host.replace("https", "http");
        console.log("host", this.host);
    }

    getQueryStr(classVariable: string, propName: string, valueVar: string): string[] {
        return ["?", `${classVariable}`, ` ${GravesearchBuilderService.ONTO_NAME}:${propName} ?`, valueVar, " ."];
    }

    getFirstWhereLine(mainClass: IMainClassObject): string[] {
        return ["?", `${mainClass.variable}`, ` a ${GravesearchBuilderService.ONTO_NAME}:${mainClass.name} .`];
    }

    getFirstConstructLine(mainClass: IMainClassObject): string[] {
        return ["?", `${mainClass.variable}`, ` knora-api:isMainResource true .`];
    }

    getMainQuery(node: IMainClass, priority: number, offset?: number) {
        // Query split into an array
        // query[0] => prefix of the query
        // query[1] => prefix of the query
        // query[2] => prefix of the query
        // query[3] => empty line
        // query[4] => CONSTRUCT tag
        // query[5] => all properties of the resource added in the construct clause
        // query[6] => WHERE tag
        // query[7] => possible BIND lines
        // query[8] => all properties of the resource
        // query[9] => FILTER lines
        // query[10] => closing bracket
        // query[11] => empty line
        // query[12] => OFFSET number
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node.mainClass).join("")}`,
            "} WHERE {",
            "",
            `${this.getFirstWhereLine(node.mainClass).join("")}`,
            "",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];

        // Add the resource restriction with IRI
        if (node.iri) {
            query[7] = query[7] + `BIND (<${node.iri}> AS ?${this.getClass[node.name].variable})` + "\n";
        }

        const optimisedNode = this.setOrderPriority(node).node;

        // recursion function to fill in the query line
        this.rec(optimisedNode, priority, query);

        return query.join("\n");
    }

    private setOrderPriority(node: IDisplayedClass) {
        const name = node.name;
        let resCounter = 0;

        node.props = node.props
            .map(prop => {
                if (prop.searchVal1) {
                    prop.orderPriority = 1;
                    resCounter = resCounter + 1;
                } else {
                    prop.orderPriority = 0;
                }

                const oProp = this.getClass[name].ref[prop.name];

                if (oProp.type === "Resource") {
                    const result = this.setOrderPriority(prop.res);
                    prop.res = result.node;
                    prop.orderPriority = prop.orderPriority + result.resCounter;
                }

                return prop;
            })
            .sort((prop1, prop2) => {
                return prop1.orderPriority > prop2.orderPriority ? -1 : (prop1.orderPriority < prop2.orderPriority ? 1 : 0);
            });

        return {node, resCounter};
    }

    private rec(node: IDisplayedClass, priority: number, query: string[], classVar?: string) {
        const name = node.name;

        for (const prop of node.props) {
            // Checks if property has the priority to be shown
            if (prop.priority <= priority) {
                // Original property
                const oProp = this.getClass[name].ref[prop.name];
                // Clones query string array
                const qStrCopy = JSON.parse(JSON.stringify(oProp.queryStr));
                // Replaces default class variable name if given
                if (classVar) {
                    qStrCopy[1] = classVar;
                }
                // Replaces default property variable name if given
                if (prop.valVar) {
                    qStrCopy[3] = prop.valVar;
                }
                // Creates string
                let line = qStrCopy.join("");
                // Adds to the construct clause
                query[5] = query[5] + "\n" + line;
                // Puts optional brackets if property is not mandatory, has no search value and cardinality can be zero
                if (!prop.mandatory && !prop.searchVal1 && (oProp.cardinality === "0-1" || oProp.cardinality === "0-n")) {
                    line = `OPTIONAL { ${line} }`;
                }
                // Fills in the properties of the resource that should be searched for. Line contains class variable,
                // property name, value variable and if property is optional
                query[8] = query[8] + "\n" + line;

                // Checks if property is a resource
                if (oProp.type === "Resource") {
                    // Checks if the res value correspond the structure
                    if (oProp.res !== prop.res.name) {
                        console.error("FAIL - Property Resource doesn't correspond the real structure");
                    }

                    if (prop.searchVal1) {
                        query[7] = query[7] + `BIND (<${prop.searchVal1}> AS ?${qStrCopy[3]})` + "\n";
                    }
                    // Overrides default class name if property variable is given
                    const newClassVar = prop.valVar ? prop.valVar : qStrCopy[3];
                    // Continuous with next property node
                    this.rec(prop.res, priority, query, newClassVar);

                // Checks if property is a list value
                } else if (oProp.type === "List") {

                    if (prop.searchVal1) {
                        // Query line where value list node
                        query[8] = query[8] + "\n" + `?${qStrCopy[3]} knora-api:listValueAsListNode <${prop.searchVal1}> .`;
                    }

                // Checks if property is a date
                } else if (oProp.type === "Date") {

                    if (prop.searchVal1) {

                        if (prop.searchVal2) {
                            query[8] = query[8] + "\n" + `FILTER (knora-api:toSimpleDate(?${qStrCopy[3]}) >= "GREGORIAN:${prop.searchVal1}"^^knora-api-simple:Date)`;
                            query[8] = query[8] + "\n" + `FILTER (knora-api:toSimpleDate(?${qStrCopy[3]}) <= "GREGORIAN:${prop.searchVal2}"^^knora-api-simple:Date)`;
                        } else {
                            query[8] = query[8] + "\n" + `FILTER (knora-api:toSimpleDate(?${qStrCopy[3]}) = "GREGORIAN:${prop.searchVal1}"^^knora-api-simple:Date)`;
                        }
                    }
                // Checks if property is a string
                } else if (oProp.type === "String") {

                    if (prop.searchVal1) {
                        query[8] = query[8] + "\n" + `?${qStrCopy[3]} knora-api:valueAsString ?${qStrCopy[3]}String .`;
                        query[8] = query[8] + "\n" + `FILTER regex(?${qStrCopy[3]}String, "${prop.searchVal1}", "i")`;
                    }
                } else {
                    console.error("FAIL PROPERTY TYPE");
                }
            }
        }
    }

    getQuery(structure: IMainClass, priority: number, offset?: number): string {
        return this.getMainQuery(structure, priority, offset);
    }

    getPrimaryAuthorsQuery(char: string, offset?: number): string {
        const node: IMainClassObject = {name: "person", variable: "person"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?book teimww:isWrittenBy ?person .",
            "?passage teimww:occursIn ?book .",
            "?passage teimww:isMentionedIn ?sPassage .",
            "?person teimww:hasFirstName ?firstName .",
            "?person teimww:hasLastName ?lastName .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?person teimww:hasLastName ?lastName .",
            "?lastName knora-api:valueAsString ?lastNameString .",
            `FILTER regex(?lastNameString, \"^${char}\", \"i\")`,
            "OPTIONAL { ?person teimww:hasFirstName ?firstName . }",
            "?book teimww:isWrittenBy ?person .",
            "?passage teimww:occursIn ?book .",
            "?passage teimww:isMentionedIn ?sPassage .",
            "",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];
        return query.join("\n");
    }

    getPrimaryBooksQuery(char: string, offset?: number): string {
        const node: IMainClassObject = {name: "book", variable: "book"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?book teimww:hasBookTitle ?bookTitle .",
            "?passage teimww:occursIn ?book .",
            "?passage teimww:isMentionedIn ?sPassage .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?book teimww:hasBookTitle ?bookTitle .",
            "?bookTitle knora-api:valueAsString ?bookTitleString .",
            `FILTER regex(?bookTitleString, \"^${char}\", \"i\")`,
            "?passage teimww:occursIn ?book .",
            "?passage teimww:isMentionedIn ?sPassage .",
            "",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];
        return query.join("\n");
    }

    getLexiasQuery(char: string, offset?: number): string {
        const node: IMainClassObject = {name: "lexia", variable: "lexia"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?lexia teimww:hasLexiaTitle ?lexiaTitle .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?lexia teimww:hasLexiaTitle ?lexiaTitle .",
            "?lexiaTitle knora-api:valueAsString ?lexiaTitleString .",
            `FILTER regex(?lexiaTitleString, \"^${char}\", \"i\")`,
            "",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];
        return query.join("\n");
    }
}
