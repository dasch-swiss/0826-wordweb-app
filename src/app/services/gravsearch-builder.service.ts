import {Injectable} from "@angular/core";
import {IDisplayedClass, IDisplayedProperty, IMainClass, IMainClassObject} from "../model/displayModel";

@Injectable({
    providedIn: "root"
})
export class GravsearchBuilderService {
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
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "hasPersonInternalId", "personInternalId")
        },
        hasFirstName: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "hasFirstName", "firstName")
        },
        hasLastName: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "hasLastName", "lastName")
        },
        hasDescription: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "hasDescription", "description")
        },
        hasBirthDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "hasBirthDate", "birthDate")
        },
        hasDeathDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "hasDeathDate", "deathDate")
        },
        hasActiveDate: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "hasActiveDate", "activeDate")
        },
        hasGender: {
            cardinality: "1",
            type: "List",
            list: "gender",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "hasGender", "gender")
        },
        isLexiaPerson: {
            cardinality: "0-1",
            type: "Resource",
            res: "lexia",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "isLexiaPerson", "lexiaPerson")
        }
    };

    book = {
        hasBookInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasBookInternalId", "bookInternalId")
        },
        hasPrefixBookTitle: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasPrefixBookTitle", "prefixBookTitle")
        },
        hasBookTitle: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasBookTitle", "bookTitle")
        },
        hasEdition: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasEdition", "edition")
        },
        hasEditionHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasEditionHist", "editionHist")
        },
        hasLanguage: {
            cardinality: "1",
            type: "List",
            list: "language",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasLanguage", "language")
        },
        hasGenre: {
            cardinality: "1-n",
            type: "List",
            list: "genre",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasGenre", "genre")
        },
        hasSubject: {
            cardinality: "0-1",
            type: "List",
            list: "subject",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasSubject", "subject")
        },
        hasCreationDate: {
            cardinality: "1",
            type: "Date",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasCreationDate", "creationDate")
        },
        hasPublicationDate: {
            cardinality: "0-1",
            type: "Date",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasPublicationDate", "publicationDate")
        },
        hasFirstPerformanceDate: {
            cardinality: "0-1",
            type: "Date",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasFirstPerformanceDate", "firstPerformanceDate")
        },
        hasBookComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "hasBookComment", "bookComment")
        },
        isWrittenBy: {
            cardinality: "1-n",
            type: "Resource",
            res: "person",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "isWrittenBy", "author")
        },
        performedBy: {
            cardinality: "0-n",
            type: "Resource",
            res: "company",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "performedBy", "performedCompany")
        },
        performedByActor: {
            cardinality: "0-1",
            type: "Resource",
            res: "person",
            queryStr: this.getQueryStr(GravsearchBuilderService.PERSON_VAR, "performedByActor", "actor")
        },
        performedIn: {
            cardinality: "0-n",
            type: "Resource",
            res: "venue",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "performedIn", "performedVenue")
        },

        isLexiaBook: {
            cardinality: "0-n",
            type: "Resource",
            res: "lexia",
            queryStr: this.getQueryStr(GravsearchBuilderService.BOOK_VAR, "isLexiaBook", "lexiaBook")
        }
    };

    passage = {
        hasText: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasText", "text")
        },
        hasTextHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasTextHist", "textHist")
        },
        hasPrefixDisplayedTitle: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasPrefixDisplayedTitle", "prefixDisplayedTitle")
        },
        hasDisplayedTitle: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasDisplayedTitle", "displayedTitle")
        },
        hasPage: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasPage", "page")
        },
        hasPageHist: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasPageHist", "pageHist")
        },
        hasResearchField: {
            cardinality: "1",
            type: "List",
            list: "researchField",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasResearchField", "research")
        },
        hasFunctionVoice: {
            cardinality: "1-n",
            type: "List",
            list: "functionVoice",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasFunctionVoice", "function")
        },
        hasMarking: {
            cardinality: "1-n",
            type: "List",
            list: "marking",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasMarking", "marking")
        },
        hasStatus: {
            cardinality: "1",
            type: "List",
            list: "status",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasStatus", "status")
        },
        hasInternalComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasInternalComment", "internalComment")
        },
        hasPassageComment: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "hasPassageComment", "passageComment")
        },
        occursIn: {
            cardinality: "1-n",
            type: "Resource",
            res: "book",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "occursIn", "book")
        },
        isMentionedIn: {
            cardinality: "0-n",
            type: "Resource",
            res: "passage",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "isMentionedIn", "sPassage")
        },
        wasContributedBy: {
            cardinality: "1",
            type: "Resource",
            res: "person",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "wasContributedBy", "contributor")
        },
        contains: {
            cardinality: "0-n",
            type: "Resource",
            res: "lexia",
            queryStr: this.getQueryStr(GravsearchBuilderService.PASSAGE_VAR, "contains", "lexia")
        }
    };

    lexia = {
        hasLexiaInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.LEXIA_VAR, "hasLexiaInternalId", "lexiaInternalId")
        },
        hasLexiaTitle: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.LEXIA_VAR, "hasLexiaTitle", "lexiaTitle")
        },
        hasLexiaDisplayedTitle: {
            cardinality: "0-1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.LEXIA_VAR, "hasLexiaDisplayedTitle", "lexiaDisplayedTitle")
        },
        hasFormalClass: {
            cardinality: "1-n",
            type: "List",
            list: "formalClass",
            queryStr: this.getQueryStr(GravsearchBuilderService.LEXIA_VAR, "hasFormalClass", "formalClass")
        },
        hasImage: {
            cardinality: "0-n",
            type: "List",
            list: "image",
            queryStr: this.getQueryStr(GravsearchBuilderService.LEXIA_VAR, "hasImage", "image")
        },
    };

    company = {
        hasCompanyInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.COMPANY_VAR, "hasCompanyInternalId", "companyInternalId")
        },
        hasCompanyTitle: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.COMPANY_VAR, "hasCompanyTitle", "companyTitle")
        },
        hasMember: {
            cardinality: "0-n",
            type: "Resource",
            res: "person",
            queryStr: this.getQueryStr(GravsearchBuilderService.COMPANY_VAR, "hasMember", "member")
        },
        isLexiaCompany: {
            cardinality: "0-n",
            type: "Resource",
            res: "Lexia",
            queryStr: this.getQueryStr(GravsearchBuilderService.COMPANY_VAR, "isLexiaCompany", "lexiaCompany")
        },
    };

    venue = {
        hasVenueInternalId: {
            cardinality: "1",
            type: "String",
            queryStr: this.getQueryStr(GravsearchBuilderService.VENUE_VAR, "hasVenueInternalId", "venueInternalId")
        },
        hasPlaceVenue: {
            cardinality: "1",
            type: "List",
            list: "placeVenue",
            queryStr: this.getQueryStr(GravsearchBuilderService.VENUE_VAR, "hasPlaceVenue", "placeVenue")
        },
        isLexiaVenue: {
            cardinality: "1",
            type: "Resource",
            res: "lexia",
            queryStr: this.getQueryStr(GravsearchBuilderService.VENUE_VAR, "isLexiaVenue", "lexiaVenue")
        },
    };

    getClass = {
        person: {
            ref: this.person,
            variable: GravsearchBuilderService.PERSON_VAR
        },
        book: {
            ref: this.book,
            variable: GravsearchBuilderService.BOOK_VAR
        },
        passage: {
            ref: this.passage,
            variable: GravsearchBuilderService.PASSAGE_VAR
        },
        lexia: {
            ref: this.lexia,
            variable: GravsearchBuilderService.LEXIA_VAR
        },
        company: {
            ref: this.company,
            variable: GravsearchBuilderService.COMPANY_VAR
        },
        venue: {
            ref: this.venue,
            variable: GravsearchBuilderService.VENUE_VAR
        }
    };

    set apiURL(host: string) {
        this.host = host.replace("https", "http");
    }

    getQueryStr(classVariable: string, propName: string, valueVar: string): string[] {
        return ["?", `${classVariable}`, ` ${GravsearchBuilderService.ONTO_NAME}:${propName} ?`, valueVar, " ."];
    }

    getFirstWhereLine(mainClass: IMainClassObject): string[] {
        return ["?", `${mainClass.variable}`, ` a ${GravsearchBuilderService.ONTO_NAME}:${mainClass.name} .`];
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
        // prioritizing node based on given search values
        const prioritizedNode = this.setOrderPriority(node).node;
        // copying sub properties in case there are nested search values and if prop has one-to-many relationship
        const modifiedNode = this.duplicateSubProps(prioritizedNode);
        // recursion function to fill in the query line
        this.rec(modifiedNode, priority, query);

        return query.join("\n");
    }

    private setOrderPriority(node: IDisplayedClass) {
        let resCounter = 0;

        node.props = node.props
            .map(prop => {
                if (prop.searchVal1 || prop.isNull) {
                    prop.orderPriority = 1;
                    resCounter = resCounter + 1;
                } else {
                    prop.orderPriority = 0;
                }

                const oProp = this.getClass[node.name].ref[prop.name];

                if (oProp.type === "Resource") {
                    const result = this.setOrderPriority(prop.res);
                    prop.res = result.node;
                    prop.orderPriority = prop.orderPriority + result.resCounter;
                    resCounter = resCounter + result.resCounter;
                }

                return prop;
            })
            .sort((prop1, prop2) => {
                return prop1.orderPriority > prop2.orderPriority ? -1 : (prop1.orderPriority < prop2.orderPriority ? 1 : 0);
            });

        return {node, resCounter};
    }

    private duplicateSubProps(n: IDisplayedClass) {
        const node = JSON.parse(JSON.stringify(n));
        const duplicatedProps = [];

        for (const prop of node.props) {
            // Original property
            const oProp = this.getClass[node.name].ref[prop.name];
            // ...
            if (oProp.type === "Resource") {
                if (oProp.cardinality === "0-n" || oProp.cardinality === "1-n") {
                    if (prop.searchVal1) {
                        const duplicatedProp = JSON.parse(JSON.stringify(prop));
                        const newProp = this.resetRename(duplicatedProp, oProp);
                        duplicatedProps.push(newProp);
                        prop.res = this.duplicateSubProps(prop.res);
                    } else {
                        let found = false;
                        for (const p of prop.res.props) {
                            if (p.searchVal1) {
                                found = true;
                            }
                        }
                        if (found) {
                            const duplicatedProp = JSON.parse(JSON.stringify(prop));
                            const newProp = this.resetRename(duplicatedProp, oProp);
                            duplicatedProps.push(newProp);
                        }
                        prop.res = this.duplicateSubProps(prop.res);
                    }
                }
            } else {
                if ((prop.searchVal1) && (oProp.cardinality === "0-n" || oProp.cardinality === "1-n")) {
                    const duplicatedProp = JSON.parse(JSON.stringify(prop));
                    const newProp = this.resetRename(duplicatedProp, oProp);
                    duplicatedProps.push(newProp);
                }
            }
        }
        // Adds the duplicated properties to the node properties
        duplicatedProps.map(prop => node.props.push(prop));

        return node;
    }

    private resetRename(node: IDisplayedProperty, originalNode: any) {
        if (node.searchVal1) {
            node.searchVal1 = null;
        }
        if (node.searchVal2) {
            node.searchVal2 = null;
        }
        node.orderPriority = 0;

        node.valVar = `${originalNode.queryStr[3]}2`;

        if (node.res) {
            for (const prop of node.res.props) {
                const oProp = this.getClass[node.res.name].ref[prop.name];
                this.resetRename(prop, oProp);
            }
        }

        return node;
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
                // Puts optional brackets if property is not mandatory, has no search value, can not be null and cardinality can be zero
                if (!prop.mandatory && !prop.searchVal1 && !prop.isNull && (oProp.cardinality === "0-1" || oProp.cardinality === "0-n")) {
                    line = `OPTIONAL { ${line} }`;
                }

                // Fills in the properties of the resource that should be searched for. Line contains class variable,
                // property name, value variable and if property is optional
                if (!prop.isNull) {
                    query[8] = query[8] + "\n" + line;
                }

                // Checks if property is a resource
                if (oProp.type === "Resource") {
                    // Checks if the res value correspond the structure
                    if (oProp.res !== prop.res.name) {
                        console.error("FAIL - Property Resource doesn't correspond the real structure");
                    }

                    if (prop.searchVal1) {
                        query[7] = query[7] + `BIND (<${prop.searchVal1}> AS ?${qStrCopy[3]})` + "\n";
                    }
                    // ...
                    if (!prop.searchVal1 && prop.isNull) {
                        query[8] = query[8] + "\n" + `FILTER NOT EXISTS { ${qStrCopy.join("")} }`;
                        return;
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
                    } else if (prop.isNull) {
                        query[8] = query[8] + "\n" + `FILTER NOT EXISTS { ${qStrCopy.join("")} }`;
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
                    } else if (prop.isNull) {
                        query[8] = query[8] + "\n" + `FILTER NOT EXISTS { ${qStrCopy.join("")} }`;
                    }
                    // Checks if property is a string
                } else if (oProp.type === "String") {

                    if (prop.searchVal1) {
                        query[8] = query[8] + "\n" + `?${qStrCopy[3]} knora-api:valueAsString ?${qStrCopy[3]}String .`;
                        query[8] = query[8] + "\n" + `FILTER regex(?${qStrCopy[3]}String, "${prop.searchVal1}", "i")`;
                    } else if (prop.isNull) {
                        query[8] = query[8] + "\n" + `FILTER NOT EXISTS { ${qStrCopy.join("")} }`;
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

    getAllAuthorsQuery(offset?: number): string {
        const node: IMainClassObject = {name: "person", variable: "person"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?person teimww:hasPersonInternalId ?personInternalId .",
            "?person teimww:hasFirstName ?firstName .",
            "?person teimww:hasLastName ?lastName .",
            "?person teimww:hasDescription ?description .",
            "?person teimww:hasBirthDate ?birthDate .",
            "?person teimww:hasDeathDate ?deathDate .",
            "?person teimww:hasActiveDate ?hasActiveDate .",
            "?person teimww:hasGender ?gender .",
            "?person teimww:hasPersonExtraInfo ?personExtraInfo .",
            "?book teimww:isWrittenBy ?person .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?person teimww:hasPersonInternalId ?personInternalId .",
            "OPTIONAL { ?person teimww:hasFirstName ?firstName . }",
            "?person teimww:hasLastName ?lastName .",
            "?person teimww:hasDescription ?description .",
            "OPTIONAL { ?person teimww:hasBirthDate ?birthDate . }",
            "OPTIONAL { ?person teimww:hasDeathDate ?deathDate . }",
            "OPTIONAL { ?person teimww:hasActiveDate ?hasActiveDate . }",
            "?person teimww:hasGender ?gender .",
            "OPTIONAL { ?person teimww:hasPersonExtraInfo ?personExtraInfo . }",
            "?book teimww:isWrittenBy ?person .",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];
        return query.join("\n");
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

    getAllBooksQuery(offset?: number): string {
        const node: IMainClassObject = {name: "book", variable: "book"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?book teimww:hasBookInternalId ?bookInternalId .",
            "?book teimww:hasPrefixBookTitle ?prefixBookTitle .",
            "?book teimww:hasBookTitle ?bookTitle .",
            "?book teimww:hasEdition ?edition .",
            "?book teimww:hasEditionHist ?editionHist .",
            "?book teimww:hasLanguage ?language .",
            "?book teimww:hasGenre ?genre .",
            "?book teimww:hasSubject ?subject .",
            "?book teimww:hasCreationDate ?creationDate .",
            "?book teimww:hasPublicationDate ?publicationDate .",
            "?book teimww:hasFirstPerformanceDate ?firstPerformanceDate .",
            "?book teimww:hasBookComment ?bookComment .",
            "?book teimww:isWrittenBy ?author .",
            "?author teimww:hasFirstName ?firstName .",
            "?author teimww:hasLastName ?lastName .",
            "?book teimww:performedBy ?performedCompany .",
            "?book teimww:performedByActor ?actor .",
            "?book teimww:performedIn ?performedVenue .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?book teimww:hasBookInternalId ?bookInternalId .",
            "OPTIONAL { ?book teimww:hasPrefixBookTitle ?prefixBookTitle . }",
            "?book teimww:hasBookTitle ?bookTitle .",
            "?book teimww:hasEdition ?edition .",
            "OPTIONAL { ?book teimww:hasEditionHist ?editionHist . }",
            "?book teimww:hasLanguage ?language .",
            "?book teimww:hasGenre ?genre .",
            "OPTIONAL { ?book teimww:hasSubject ?subject . }",
            "?book teimww:hasCreationDate ?creationDate .",
            "OPTIONAL { ?book teimww:hasPublicationDate ?publicationDate . }",
            "OPTIONAL { ?book teimww:hasFirstPerformanceDate ?firstPerformanceDate . }",
            "OPTIONAL { ?book teimww:hasBookComment ?bookComment . }",
            "?book teimww:isWrittenBy ?author .",
            "OPTIONAL { ?author teimww:hasFirstName ?firstName . }",
            "?author teimww:hasLastName ?lastName .",
            "OPTIONAL { ?book teimww:performedBy ?performedCompany . }",
            "OPTIONAL { ?book teimww:performedByActor ?actor . }",
            "OPTIONAL { ?book teimww:performedIn ?performedVenue . }",
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
            "?book teimww:hasPrefixBookTitle ?prefixBookTitle .",
            "?book teimww:hasBookTitle ?bookTitle .",
            "?passage teimww:occursIn ?book .",
            "?passage teimww:isMentionedIn ?sPassage .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "OPTIONAL { ?book teimww:hasPrefixBookTitle ?prefixBookTitle . }",
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

    getAllLexiasQuery(offset?: number): string {
        const node: IMainClassObject = {name: "lexia", variable: "lexia"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?lexia teimww:hasLexiaInternalId ?lexiaInternalId .",
            "?lexia teimww:hasLexiaTitle ?lexiaTitle .",
            "?lexia teimww:hasLexiaDisplayedTitle ?lexiaDisplayedTitle .",
            "?lexia teimww:hasFormalClass ?formalClass .",
            "?lexia teimww:hasImage ?image .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?lexia teimww:hasLexiaInternalId ?lexiaInternalId .",
            "?lexia teimww:hasLexiaTitle ?lexiaTitle .",
            "OPTIONAL { ?lexia teimww:hasLexiaDisplayedTitle ?lexiaDisplayedTitle . }",
            "?lexia teimww:hasFormalClass ?formalClass .",
            "OPTIONAL { ?lexia teimww:hasImage ?image . }",
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

    getCompaniesQuery(offset?: number): string {
        const node: IMainClassObject = {name: "company", variable: "company"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?company teimww:hasCompanyTitle ?companyTitle .",
            "?company teimww:hasCompanyInternalId ?companyInternalId .",
            "?book teimww:performedBy ?company .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?company teimww:hasCompanyTitle ?companyTitle .",
            "?company teimww:hasCompanyInternalId ?companyInternalId .",
            "?book teimww:performedBy ?company .",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];
        return query.join("\n");
    }

    getVenuesQuery(offset?: number): string {
        const node: IMainClassObject = {name: "venue", variable: "venue"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?venue teimww:hasPlaceVenue ?placeVenue .",
            "?venue teimww:hasVenueInternalId ?venueInternalId .",
            "?book teimww:performedIn ?venue .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?venue teimww:hasPlaceVenue ?placeVenue .",
            "?venue teimww:hasVenueInternalId ?venueInternalId .",
            "?book teimww:performedIn ?venue .",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];
        return query.join("\n");
    }

    getActorsQuery(offset?: number): string {
        const node: IMainClassObject = {name: "person", variable: "person"};
        const query = [
            "PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>",
            "PREFIX knora-api-simple: <http://api.knora.org/ontology/knora-api/simple/v2#>",
            `PREFIX teimww: <${this.host}/ontology/0826/teimww/v2#>`,
            "",
            "CONSTRUCT {",
            `${this.getFirstConstructLine(node).join("")}`,
            "?book teimww:performedByActor ?person .",
            "?person teimww:hasFirstName ?firstName .",
            "?person teimww:hasLastName ?lastName .",
            "} WHERE {",
            `${this.getFirstWhereLine(node).join("")}`,
            "?book teimww:performedByActor ?person .",
            "OPTIONAL { ?person teimww:hasFirstName ?firstName . }",
            "?person teimww:hasLastName ?lastName .",
            "}",
            "",
            `OFFSET ${offset ? offset : 0}`
        ];
        return query.join("\n");
    }
}
