import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Book} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {IDisplayedClass, IDisplayedProperty} from "../../model/displayModel";
import {KnoraService} from "../../services/knora.service";

@Component({
    selector: "app-advanced-search",
    templateUrl: "./advanced-search.component.html",
    styleUrls: ["./advanced-search.component.scss"]
})
export class AdvancedSearchComponent implements OnInit {
    myPassage: IDisplayedClass = {
        name: "passage",
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
                            name: "hasLanguage",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasGenre",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasSubject",
                            priority: 1,
                            res: null
                        },
                        {
                            name: "hasCreationDate",
                            // searchVal1: "1500",
                            // searchVal2: "1860",
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
                // searchVal1: "http://rdfh.ch/0826/V36CJpAuSTuhDATfiflaTA",
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
    form: FormGroup;

    textRef: IDisplayedProperty;
    authorLastNameRef: IDisplayedProperty;
    bookTitleRef: IDisplayedProperty;
    genreRef: IDisplayedProperty;
    lexiaRef: IDisplayedProperty;
    languageRef: IDisplayedProperty;
    functionRef: IDisplayedProperty;
    markingRef: IDisplayedProperty;
    createdDateRef: IDisplayedProperty;
    performedDateRef: IDisplayedProperty;
    performedCompanyRef: IDisplayedProperty;

    passages: any;

    operators1 = [
        {value: "-"},
        {value: "NOT"}
    ];

    operators2 = [
        {value: "AND"},
        {value: "NOT"}
    ];

    constructor(private apiService: ApiService, private knoraService: KnoraService) {
    }

    ngOnInit() {
        this.textRef = this.myPassage.props[0];
        this.authorLastNameRef = this.myPassage.props[11].res.props[10].res.props[1];
        this.bookTitleRef = this.myPassage.props[11].res.props[0];
        this.genreRef = this.myPassage.props[11].res.props[4];
        this.lexiaRef = this.myPassage.props[14].res.props[0];
        this.languageRef = this.myPassage.props[11].res.props[3];
        this.functionRef = this.myPassage.props[6];
        this.markingRef = this.myPassage.props[7];
        this.createdDateRef = this.myPassage.props[11].res.props[6];
        this.performedDateRef = this.myPassage.props[11].res.props[7];
        this.performedCompanyRef = this.myPassage.props[11].res.props[11];

        this.form = new FormGroup({
            compText: new FormControl("-", []),
            text: new FormControl("", []),
            compAuthor: new FormControl("AND", []),
            author: new FormControl("", []),
            compBookTitle: new FormControl("AND", []),
            bookTitle: new FormControl("", []),
            compGenre: new FormControl("AND", []),
            genre: new FormControl("", []),
            compLexia: new FormControl("AND", []),
            lexia: new FormControl("", []),
            compLanguage: new FormControl("AND", []),
            language: new FormControl("", []),
            compFunction: new FormControl("AND", []),
            function: new FormControl("", []),
            compMarking: new FormControl("AND", []),
            marking: new FormControl("", []),
            compCreatedDate: new FormControl("AND", []),
            createdDate: new FormControl("", []),
            compPerformedDate: new FormControl("AND", []),
            performedDate: new FormControl("", []),
            compPerformedCompany: new FormControl("AND", []),
            performedCompany: new FormControl("", []),
            compPerformedActor: new FormControl("AND", []),
            performedActor: new FormControl("", []),
            plays: new FormControl(false, [])
        });
    }

    search() {
        this.prepareNode();
        console.log(this.myPassage);

        this.knoraService.login("root@example.com", "test")
            .subscribe(loginData => {
                console.log(loginData);

                this.knoraService.search(this.myPassage, 1, false, 0)
                    .subscribe(data => {
                        console.log(data);
                    });
            });

        this.getTestData();
    }

    getTestData() {
        this.apiService.getPassages(true).subscribe(data => {
            for (const passage of data) {
                this.apiService.getBook((passage.occursIn as Book).id, true).subscribe(book => {
                    passage.occursIn = book;
                    this.passages = data;
                });
            }
        });
    }

    prepareNode() {
        if (this.form.get("text").value) {
            this.textRef.searchVal1 = this.form.get("text").value;
        } else {
            delete this.textRef.searchVal1;
        }

        if (this.form.get("author").value) {
            if (this.form.get("compAuthor").value === "NOT") {
                this.authorLastNameRef.negation = true;
            } else {
                delete this.authorLastNameRef.negation;
            }
            this.authorLastNameRef.searchVal1 = this.form.get("author").value;
        } else {
            delete this.authorLastNameRef.searchVal1;
            delete this.authorLastNameRef.negation;
        }

        if (this.form.get("bookTitle").value) {
            if (this.form.get("compBookTitle").value === "NOT") {
                this.bookTitleRef.negation = true;
            } else {
                delete this.bookTitleRef.negation;
            }
            this.bookTitleRef.searchVal1 = this.form.get("bookTitle").value;
        } else {
            delete this.bookTitleRef.searchVal1;
            delete this.bookTitleRef.negation;
        }

        if (this.form.get("genre").value) {
            if (this.form.get("compGenre").value === "NOT") {
                this.genreRef.negation = true;
            } else {
                delete this.genreRef.negation;
            }
            this.genreRef.searchVal1 = this.form.get("genre").value;
        } else {
            delete this.genreRef.searchVal1;
            delete this.genreRef.negation;
        }

        if (this.form.get("lexia").value) {
            if (this.form.get("compLexia").value === "NOT") {
                this.lexiaRef.negation = true;
            } else {
                delete this.lexiaRef.negation;
            }
            this.lexiaRef.searchVal1 = this.form.get("lexia").value;
        } else {
            delete this.lexiaRef.searchVal1;
            delete this.lexiaRef.negation;
        }

        if (this.form.get("language").value) {
            if (this.form.get("compLanguage").value === "NOT") {
                this.languageRef.negation = true;
            } else {
                delete this.languageRef.negation;
            }
            this.languageRef.searchVal1 = this.form.get("language").value;
        } else {
            delete this.languageRef.searchVal1;
            delete this.languageRef.negation;
        }

        if (this.form.get("function").value) {
            if (this.form.get("compFunction").value === "NOT") {
                this.functionRef.negation = true;
            } else {
                delete this.functionRef.negation;
            }
            this.functionRef.searchVal1 = this.form.get("function").value;
        } else {
            delete this.functionRef.searchVal1;
            delete this.functionRef.negation;
        }

        if (this.form.get("marking").value) {
            if (this.form.get("compMarking").value === "NOT") {
                this.markingRef.negation = true;
            } else {
                delete this.markingRef.negation;
            }
            this.markingRef.searchVal1 = this.form.get("marking").value;
        } else {
            delete this.markingRef.searchVal1;
            delete this.markingRef.negation;
        }

        if (this.form.get("createdDate").valid) {
            if (this.form.get("compCreatedDate").value === "NOT") {
                this.createdDateRef.negation = true;
            } else {
                delete this.createdDateRef.negation;
            }
            this.createdDateRef.searchVal1 = this.form.get("createdDate").value;
            this.createdDateRef.searchVal2 = this.form.get("createdDate").value;
        } else {
            delete this.createdDateRef.searchVal1;
            delete this.createdDateRef.searchVal2;
            delete this.createdDateRef.negation;
        }

        if (this.form.get("performedDate").valid) {
            if (this.form.get("compPerformedDate").value === "NOT") {
                this.performedDateRef.negation = true;
            } else {
                delete this.performedDateRef.negation;
            }
            this.performedDateRef.searchVal1 = this.form.get("performedDate").value;
            this.performedDateRef.searchVal2 = this.form.get("performedDate").value;
        } else {
            delete this.performedDateRef.searchVal1;
            delete this.performedDateRef.searchVal2;
            delete this.performedDateRef.negation;
        }

        if (this.form.get("performedCompany").valid) {
            if (this.form.get("compPerformedCompany").value === "NOT") {
                this.performedCompanyRef.negation = true;
            } else {
                delete this.performedCompanyRef.negation;
            }
            this.performedCompanyRef.searchVal1 = this.form.get("performedCompany").value;
        } else {
            delete this.performedCompanyRef.searchVal1;
            delete this.performedCompanyRef.negation;
        }
    }

}
