import {Component, OnInit, ViewChild} from "@angular/core";
import {KnoraService} from "../../services/knora.service";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {ResultsComponent} from "../results/results.component";

@Component({
    selector: "app-browsing",
    templateUrl: "./browsing.component.html",
    styleUrls: ["./browsing.component.scss"]
})
export class BrowsingComponent implements OnInit {
    @ViewChild("results", {static: false}) resultBox: ResultsComponent;

    myAuthor: IMainClass = {
        name: "passage",
        mainClass: {name: "person", variable: "author"},
        props: [
            {
                name: "occursIn",
                priority: 0,
                res: {
                    name: "book",
                    props: [
                        {
                            name: "isWrittenBy",
                            priority: 0,
                            res: {
                                name: "person",
                                props: [
                                    {
                                        name: "hasFirstName",
                                        priority: 0,
                                        res: null
                                    },
                                    {
                                        name: "hasLastName",
                                        priority: 0,
                                        res: null
                                    }
                                ]
                            }
                        },
                    ]
                }
            },
            {
                name: "isMentionedIn",
                priority: 1,
                mandatory: true,
                res: {
                    name: "passage",
                    props: [
                        {
                            name: "hasText",
                            valVar: "sText",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasDisplayedTitle",
                            valVar: "sDisplayedTitle",
                            priority: 1,
                            res: null
                        }
                    ]
                }
            }
        ]
    };
    myBook: IMainClass = {
        name: "passage",
        mainClass: {name: "book", variable: "book"},
        props: [
            {
                name: "occursIn",
                priority: 0,
                res: {
                    name: "book",
                    props: [
                        {
                            name: "hasBookTitle",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasGenre",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasCreationDate",
                            valVar: "creationDate",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasPublicationDate",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasFirstPerformanceDate",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasBookComment",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "isWrittenBy",
                            priority: 0,
                            res: {
                                name: "person",
                                props: [
                                    {
                                        name: "hasFirstName",
                                        priority: 0,
                                        res: null
                                    },
                                    {
                                        name: "hasLastName",
                                        priority: 0,
                                        res: null
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                name: "isMentionedIn",
                priority: 0,
                mandatory: true,
                res: {
                    name: "passage",
                    props: [
                        {
                            name: "hasText",
                            valVar: "sText",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasDisplayedTitle",
                            valVar: "sDisplayedTitle",
                            priority: 1,
                            res: null
                        }
                    ]
                }
            },
        ]
    };
    myLexia: IMainClass = {
        name: "lexia",
        mainClass: {name: "lexia", variable: "lexia"},
        props: [
            {
                name: "hasLexiaInternalId",
                priority: 0,
                res: null
            },
            {
                name: "hasLexiaTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasLexiaDisplayedTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasFormalClass",
                priority: 1,
                res: null
            },
            {
                name: "hasImage",
                priority: 1,
                res: null
            }
        ]
    };
    myPassage: IMainClass = {
        name: "passage",
        mainClass: {name: "passage", variable: "passage"},
        props: [
            {
                name: "hasText",
                priority: 0,
                res: null
            },
            {
                name: "hasTextHist",
                priority: 0,
                res: null
            },
            {
                name: "hasDisplayedTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasPage",
                priority: 1,
                res: null
            },
            {
                name: "hasPageHist",
                priority: 1,
                res: null
            },
            {
                name: "hasResearchField",
                priority: 1,
                res: null
            },
            {
                name: "hasFunctionVoice",
                priority: 1,
                res: null
            },
            {
                name: "hasMarking",
                priority: 1,
                res: null
            },
            {
                name: "hasStatus",
                priority: 0,
                res: null
            },
            {
                name: "hasInternalComment",
                priority: 1,
                res: null
            },
            {
                name: "hasPassageComment",
                priority: 1,
                res: null
            },
            {
                name: "occursIn",
                priority: 0,
                res: {
                    name: "book",
                    props: [
                        {
                            name: "hasBookTitle",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasEdition",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasEditionHist",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasGenre",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasCreationDate",
                            valVar: "creationDate",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasPublicationDate",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasFirstPerformanceDate",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasBookComment",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "isWrittenBy",
                            priority: 0,
                            res: {
                                name: "person",
                                props: [
                                    {
                                        name: "hasFirstName",
                                        priority: 0,
                                        res: null
                                    },
                                    {
                                        name: "hasLastName",
                                        priority: 0,
                                        res: null
                                    }
                                ]
                            }
                        },
                        {
                            name: "performedBy",
                            priority: 1,
                            res: {
                                name: "company",
                                props: [
                                    {
                                        name: "hasCompanyTitle",
                                        priority: 1,
                                        res: null
                                    }
                                ]
                            }
                        },
                        {
                            name: "performedIn",
                            priority: 1,
                            res: {
                                name: "venue",
                                props: [
                                    {
                                        name: "hasPlaceVenue",
                                        priority: 1,
                                        res: null
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                name: "isMentionedIn",
                priority: 0,
                mandatory: true,
                res: {
                    name: "passage",
                    props: [
                        {
                            name: "hasText",
                            valVar: "sText",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasDisplayedTitle",
                            valVar: "sDisplayedTitle",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasPage",
                            valVar: "sPage",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "occursIn",
                            valVar: "sBook",
                            priority: 1,
                            res: {
                                name: "book",
                                props: [
                                    {
                                        name: "hasBookTitle",
                                        valVar: "sBookTitle",
                                        priority: 1,
                                        res: null
                                    },
                                    {
                                        name: "hasEdition",
                                        valVar: "sEdition",
                                        priority: 1,
                                        res: null
                                    },
                                    {
                                        name: "hasCreationDate",
                                        valVar: "sCreationDate",
                                        priority: 1,
                                        res: null
                                    },
                                    {
                                        name: "isWrittenBy",
                                        valVar: "sAuthor",
                                        priority: 1,
                                        res: {
                                            name: "person",
                                            props: [
                                                {
                                                    name: "hasFirstName",
                                                    valVar: "sFirstName",
                                                    priority: 1,
                                                    res: null
                                                },
                                                {
                                                    name: "hasLastName",
                                                    valVar: "sLastName",
                                                    priority: 1,
                                                    res: null
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                name: "wasContributedBy",
                priority: 1,
                res: {
                    name: "person",
                    props: [
                        {
                            name: "hasFirstName",
                            valVar: "cFirstName",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasLastName",
                            valVar: "cLastName",
                            priority: 1,
                            res: null
                        }
                    ]
                }
            },
            {
                name: "contains",
                priority: 0,
                mandatory: true,
                res: {
                    name: "lexia",
                    props: [
                        {
                            name: "hasLexiaTitle",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasLexiaDisplayedTitle",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasFormalClass",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            }
        ]
    };

    authorLastNameRef: IDisplayedProperty;
    lexiaTitleRef: IDisplayedProperty;
    bookTitleRef: IDisplayedProperty;
    authorRef: IDisplayedProperty;
    lexiaRef: IDisplayedProperty;
    bookRef: IDisplayedProperty;

    alphabeticResources: Array<any>;

    searchStarted = false;
    detailStarted = false;
    errorObject = null;
    priority = 0;

    resTypeSelected: string;
    chars: Array<string>;
    charSelected: string;

    static getCharacterRange() {
        const start = "A";
        const end = "Z";
        const arr: string[] = [];
        let i = start.charCodeAt(0);
        while (i <= end.charCodeAt(0)) {
            arr.push(String.fromCharCode(i));
            i++;
        }
        return arr;
    }

    constructor(private knoraService: KnoraService) {
    }

    ngOnInit() {
        this.chars = BrowsingComponent.getCharacterRange();
        this.authorLastNameRef = this.myAuthor.props[0].res.props[0].res.props[1];
        this.bookTitleRef = this.myBook.props[0].res.props[0];
        this.lexiaTitleRef = this.myLexia.props[1];
        this.authorRef = this.myPassage.props[11].res.props[8];
        this.bookRef = this.myPassage.props[11];
        this.lexiaRef = this.myPassage.props[14];
        this.charSelected = "A";
        this.resTypeSelected = "book";

        this.requestResources();
    }

    requestResources() {
        if (this.resTypeSelected === "author") {
            this.authorLastNameRef.searchVal1 = `^${this.charSelected}`;

            if (this.bookTitleRef.searchVal1) {
                delete this.bookTitleRef.searchVal1;
            }

            if (this.lexiaTitleRef.searchVal1) {
                delete this.lexiaTitleRef.searchVal1;
            }

            this.knoraService.graveSearchQueryCount(this.myAuthor, this.priority)
                .subscribe(num => {
                    console.log(num);
                });

            this.knoraService.graveSeachQuery(this.myAuthor, this.priority)
                .subscribe(data => {
                    console.log(data);
                    this.alphabeticResources = data.sort((author1, author2) => {
                        const authorName1 = author1.hasLastName[0].value.toUpperCase();
                        const authorName2 = author2.hasLastName[0].value.toUpperCase();

                        return authorName1 <= authorName2 ? (authorName1 === authorName2 ? 0 : -1) : 1;
                    });
                });
        } else if (this.resTypeSelected === "book") {
            this.bookTitleRef.searchVal1 = `^${this.charSelected}`;

            if (this.authorLastNameRef.searchVal1) {
                delete this.authorLastNameRef.searchVal1;
            }

            if (this.lexiaTitleRef.searchVal1) {
                delete this.lexiaTitleRef.searchVal1;
            }

            this.knoraService.graveSearchQueryCount(this.myBook, this.priority)
                .subscribe(num => {
                    console.log(num);
                });

            this.knoraService.graveSeachQuery(this.myBook, this.priority)
                .subscribe(data => {
                    console.log(data);
                    this.alphabeticResources = data.sort((book1, book2) => {
                        const bookTitle1 = book1.hasBookTitle[0].value.toUpperCase();
                        const bookTitle2 = book2.hasBookTitle[0].value.toUpperCase();

                        return bookTitle1 <= bookTitle2 ? (bookTitle1 === bookTitle2 ? 0 : -1) : 1;
                    });
                });
        } else if (this.resTypeSelected === "lexia") {
            this.lexiaTitleRef.searchVal1 = `^${this.charSelected}`;

            if (this.bookTitleRef.searchVal1) {
                delete this.bookTitleRef.searchVal1;
            }

            if (this.authorLastNameRef.searchVal1) {
                delete this.authorLastNameRef.searchVal1;
            }

            this.knoraService.graveSearchQueryCount(this.myLexia, this.priority)
                .subscribe(num => {
                    console.log(num);
                });

            this.knoraService.graveSeachQuery(this.myLexia, this.priority)
                .subscribe((data: any[]) => {
                    console.log(data);
                    this.alphabeticResources = data.sort((lexia1, lexia2) => {
                        const lexTitle1 = lexia1.hasLexiaTitle[0].value.toUpperCase();
                        const lexTitle2 = lexia2.hasLexiaTitle[0].value.toUpperCase();

                        return lexTitle1 <= lexTitle2 ? (lexia1 === lexia2 ? 0 : -1) : 1;
                    });
                });
        }
    }

    selectResType(name: string) {
        this.resTypeSelected = name;
        this.alphabeticResources = null;
        this.requestResources();
    }

    selectChar(event) {
        this.alphabeticResources = null;
        this.requestResources();
    }

    getItem(alphaRes: any): string {
        switch (this.resTypeSelected) {
            case "author": {
                return alphaRes.hasFirstName ? `${alphaRes.hasLastName[0].value}, ${alphaRes.hasFirstName[0].value}` : alphaRes.hasLastName[0].value;
            }
            case "book": {
                return alphaRes.hasBookTitle[0].value;
            }
            case "lexia": {
                return alphaRes.hasLexiaTitle[0].value;
            }

        }
    }

    detailSelected(res: any) {
        console.log("detail", res);
        if (this.resTypeSelected === "author") {
            this.authorRef.searchVal1 = res.id;

            if (this.bookRef.searchVal1) {
                delete this.bookRef.searchVal1;
            }

            if (this.lexiaRef.searchVal1) {
                delete this.lexiaRef.searchVal1;
            }

            this.resultBox.search(this.myPassage);

        } else if (this.resTypeSelected === "book") {
            this.bookRef.searchVal1 = res.id;

            if (this.authorRef.searchVal1) {
                delete this.authorRef.searchVal1;
            }

            if (this.lexiaRef.searchVal1) {
                delete this.lexiaRef.searchVal1;
            }

            this.resultBox.search(this.myPassage);

        } else if (this.resTypeSelected === "lexia") {
            this.lexiaRef.searchVal1 = res.id;

            if (this.bookRef.searchVal1) {
                delete this.bookRef.searchVal1;
            }

            if (this.authorRef.searchVal1) {
                delete this.authorRef.searchVal1;
            }

            this.resultBox.search(this.myPassage);
        }
    }

}
