import {Injectable} from "@angular/core";
import {IDisplayedClass} from "../model/displayModel";

enum Classes { PERSON = "person", BOOK = "book", PASSAGE = "passage", LEXIA = "lexia", COMPANY = "company", VENUE = "venue"}

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

    person = {
        hasPersonInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "hasPersonInternalId", "personInternalId")
        },
        hasFirstName: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "hasFirstName", "firstName")
        },
        hasLastName: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "hasLastName", "lastName")
        },
        hasDescription: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "hasDescription", "description")
        },
        hasBirthDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "hasBirthDate", "birthDate")
        },
        hasDeathDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "hasDeathDate", "deathDate")
        },
        hasActiveDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "hasActiveDate", "activeDate")
        },
        hasGender: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "hasGender", "gender")
        },
        isLexiaPerson: {
            cardinality: "0-1",
            type: "Resource",
            res: "lexia",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "isLexiaPerson", "lexiaPerson")
        },
        personPerformedIn: {
            cardinality: "0-1",
            type: "Resource",
            res: "book",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PERSON, "personPerformedIn", "personPerformedIn")
        }
    };

    book = {
        hasBookInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasBookInternalId", "bookInternalId")
        },
        hasBookTitle: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasBookTitle", "bookTitle")
        },
        hasEdition: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasEdition", "edition")
        },
        hasEditionHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasEditionHist", "editionHist")
        },
        hasLanguage: {
            cardinality: "1",
            type: "List",
            list: "language",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasLanguage", "language")
        },
        hasGenre: {
            cardinality: "1-n",
            type: "List",
            list: "genre",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasGenre", "genre")
        },
        hasSubject: {
            cardinality: "0-1",
            type: "List",
            list: "subject",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasSubject", "subject")
        },
        hasCreationDate: {
            cardinality: "1",
            type: "Date",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasCreationDate", "creationDate")
        },
        hasPublicationDate: {
            cardinality: "0-1",
            type: "Date",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasPublicationDate", "publicationDate")
        },
        hasFirstPerformanceDate: {
            cardinality: "0-1",
            type: "Date",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasFirstPerformanceDate", "firstPerformanceDate")
        },
        hasBookComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "hasBookComment", "bookComment")
        },
        isWrittenBy: {
            cardinality: "1-n",
            type: "Resource",
            res: "person",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "isWrittenBy", "author")
        },
        performedBy: {
            cardinality: "0-n",
            type: "Resource",
            res: "company",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "performedBy", "performedCompany")
        },
        performedIn: {
            cardinality: "0-n",
            type: "Resource",
            res: "venue",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "performedIn", "performedVenue")
        },

        isLexiaBook: {
            cardinality: "0-n",
            type: "Resource",
            res: "lexia",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.BOOK, "isLexiaBook", "lexiaBook")
        }
    };

    passage = {
        hasText: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasText", "text")
        },
        hasTextHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasTextHist", "textHist")
        },
        hasDisplayedTitle: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasDisplayedTitle", "displayedTitle")
        },
        hasPage: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasPage", "page")
        },
        hasPageHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasPageHist", "pageHist")
        },
        hasResearchField: {
            cardinality: "1",
            type: "List",
            list: "researchField",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasResearchField", "research")
        },
        hasFunctionVoice: {
            cardinality: "1-n",
            type: "List",
            list: "functionVoice",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasFunctionVoice", "function")
        },
        hasMarking: {
            cardinality: "1-n",
            type: "List",
            list: "marking",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasMarking", "marking")
        },
        hasStatus: {
            cardinality: "1",
            type: "List",
            list: "status",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasStatus", "status")
        },
        hasInternalComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasInternalComment", "internalComment")
        },
        hasPassageComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "hasPassageComment", "passageComment")
        },
        occursIn: {
            cardinality: "1-n",
            type: "Resource",
            res: "book",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "occursIn", "book")
        },
        isMentionedIn: {
            cardinality: "0-n",
            type: "Resource",
            res: "passage",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "isMentionedIn", "sPassage")
        },
        wasContributedBy: {
            cardinality: "1",
            type: "Resource",
            res: "person",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "wasContributedBy", "contributor")
        },
        contains: {
            cardinality: "0-n",
            type: "Resource",
            res: "lexia",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.PASSAGE, "contains", "lexia")
        }
    };

    lexia = {
        hasLexiaInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.LEXIA, "hasLexiaInternalId", "lexiaInternalId")
        },
        hasLexiaTitle: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.LEXIA, "hasLexiaTitle", "lexiaTitle")
        },
        hasLexiaDisplayedTitle: {
            cardinality: "0-1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.LEXIA, "hasLexiaDisplayedTitle", "lexiaDisplayedTitle")
        },
        hasFormalClass: {
            cardinality: "1-n",
            type: "List",
            list: "formalClass",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.LEXIA, "hasFormalClass", "formalClass")
        },
        hasImage: {
            cardinality: "0-n",
            type: "List",
            list: "image",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.LEXIA, "hasImage", "image")
        },
    };

    company = {
        hasCompanyInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.COMPANY, "hasCompanyInternalId", "companyInternalId")
        },
        hasCompanyTitle: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.COMPANY, "hasCompanyTitle", "companyTitle")
        },
        hasMember: {
            cardinality: "0-n",
            type: "Resource",
            res: "person",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.COMPANY, "hasMember", "member")
        },
        isLexiaCompany: {
            cardinality: "0-n",
            type: "Resource",
            res: "Lexia",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.COMPANY, "isLexiaCompany", "lexiaCompany")
        },
    };

    venue = {
        hasVenueInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.VENUE, "hasVenueInternalId", "venueInternalId")
        },
        hasPlaceVenue: {
            cardinality: "1",
            type: "String",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.VENUE, "hasPlaceVenue", "placeVenue")
        },
        isLexiaVenue: {
            cardinality: "1",
            type: "Resource",
            res: "lexia",
            queryStr: GravesearchBuilderService.getQueryStr(Classes.VENUE, "isLexiaVenue", "lexiaVenue")
        },
    };

    getClass = {
        person: this.person,
        book: this.book,
        passage: this.passage,
        lexia: this.lexia,
        company: this.company,
        venue: this.venue
    };

    static getQueryStr(c: Classes, propName: string, valueVar: string): string[] {
        switch (c) {
            case Classes.PERSON:
                return ["?", `${this.PERSON_VAR}`, ` ${this.ONTO_NAME}:${propName} ?`, valueVar, " ."];
            case Classes.BOOK:
                return ["?", `${this.BOOK_VAR}`, ` ${this.ONTO_NAME}:${propName} ?`, valueVar, " ."];
            case Classes.PASSAGE:
                return ["?", `${this.PASSAGE_VAR}`, ` ${this.ONTO_NAME}:${propName} ?`, valueVar, " ."];
            case Classes.LEXIA:
                return ["?", `${this.LEXIA_VAR}`, ` ${this.ONTO_NAME}:${propName} ?`, valueVar, " ."];
            case Classes.COMPANY:
                return ["?", `${this.COMPANY_VAR}`, ` ${this.ONTO_NAME}:${propName} ?`, valueVar, " ."];
            case Classes.VENUE:
                return ["?", `${this.VENUE_VAR}`, ` ${this.ONTO_NAME}:${propName} ?`, valueVar, " ."];
        }
    }

    static getFirstWhereLine(c: Classes): string[] {
        switch (c) {
            case Classes.PERSON:
                return ["?", `${this.PERSON_VAR}`, ` a ${this.ONTO_NAME}:${Classes.PERSON} .`];
            case Classes.BOOK:
                return ["?", `${this.BOOK_VAR}`, ` a ${this.ONTO_NAME}:${Classes.BOOK} .`];
            case Classes.PASSAGE:
                return ["?", `${this.PASSAGE_VAR}`, ` a ${this.ONTO_NAME}:${Classes.PASSAGE} .`];
            case Classes.LEXIA:
                return ["?", `${this.LEXIA_VAR}`, ` a ${this.ONTO_NAME}:${Classes.LEXIA} .`];
            case Classes.COMPANY:
                return ["?", `${this.COMPANY_VAR}`, ` a ${this.ONTO_NAME}:${Classes.COMPANY} .`];
            case Classes.VENUE:
                return ["?", `${this.VENUE_VAR}`, ` a ${this.ONTO_NAME}:${Classes.VENUE} .`];
        }
    }

    static getFirstConstructLine(c: Classes): string[] {
        switch (c) {
            case Classes.PERSON:
                return ["?", `${this.PERSON_VAR}`, ` knora-api:isMainResource true .`];
            case Classes.BOOK:
                return ["?", `${this.BOOK_VAR}`, ` knora-api:isMainResource true .`];
            case Classes.PASSAGE:
                return ["?", `${this.PASSAGE_VAR}`, ` knora-api:isMainResource true .`];
            case Classes.LEXIA:
                return ["?", `${this.LEXIA_VAR}`, ` knora-api:isMainResource true .`];
            case Classes.COMPANY:
                return ["?", `${this.COMPANY_VAR}`, ` knora-api:isMainResource true .`];
            case Classes.VENUE:
                return ["?", `${this.VENUE_VAR}`, ` knora-api:isMainResource true .`];
        }
    }

    constructor() {
    }

    getMainQuery(node: IDisplayedClass, priority: number, offset?: number) {
        // Query split into an array
        // query[0] => prefix of the query
        // query[1] => prefix of the query
        // query[2] => prefix of the query
        // query[3] => empty line
        // query[4] => CONSTRUCT tag
        // query[5] => first construct line
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
            "PREFIX teimww: <http://0.0.0.0:3333/ontology/0826/teimww/v2#>",
            "",
            "CONSTRUCT {",
            `${GravesearchBuilderService.getFirstConstructLine(node.name as Classes).join("")}`,
            "} WHERE {",
            "",
            `${GravesearchBuilderService.getFirstWhereLine(node.name as Classes).join("")}`,
            "",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];

        // recursion function to fill in the query line
        this.rec(node, priority, query);

        return query.join("\n");
    }

    private rec(node: IDisplayedClass, priority: number, query: string[], classVar?: string) {
        const name = node.name;

        for (const prop of node.props) {
            // Checks if property has the priority to be shown
            if (prop.priority <= priority) {
                // Original property
                const oProp = this.getClass[name][prop.name];
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
                        query[9] = query[9] + "\n" + `?${qStrCopy[3]} knora-api:listValueAsListNode <${prop.searchVal1}> .`;
                    }

                // Checks if property is a date
                } else if (oProp.type === "Date") {

                    if (prop.searchVal1) {

                        if (prop.searchVal2) {
                            query[9] = query[9] + "\n" + `FILTER (knora-api:toSimpleDate(?${qStrCopy[3]}) >= "GREGORIAN:${prop.searchVal1}"^^knora-api-simple:Date)`;
                            query[9] = query[9] + "\n" + `FILTER (knora-api:toSimpleDate(?${qStrCopy[3]}) <= "GREGORIAN:${prop.searchVal2}"^^knora-api-simple:Date)`;
                        } else {
                            query[9] = query[9] + "\n" + `FILTER (knora-api:toSimpleDate(?${qStrCopy[3]}) = "GREGORIAN:${prop.searchVal1}"^^knora-api-simple:Date)`;
                        }
                    }
                // Checks if property is a string
                } else if (oProp.type === "String") {

                    if (prop.searchVal1) {
                        query[9] = query[9] + "\n" + `?${qStrCopy[3]} knora-api:valueAsString ?${qStrCopy[3]}String .`;
                        query[9] = query[9] + "\n" + `FILTER regex(?${qStrCopy[3]}String, "${prop.searchVal1}", "i")`;
                    }
                } else {
                    console.error("FAIL PROPERTY TYPE");
                }
            }
        }
    }

    getQuery(structure: IDisplayedClass, priority: number, offset?: number): string {
        return this.getMainQuery(structure, priority, offset);
    }
}
