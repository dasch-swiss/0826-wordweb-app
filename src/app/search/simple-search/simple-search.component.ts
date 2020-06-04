import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Book} from "../../model/model";
import {IDisplayedClass, IDisplayedProperty} from "../../model/displayModel";
import {KnoraService} from "../../services/knora.service";

@Component({
    selector: "app-simple-search",
    templateUrl: "./simple-search.component.html",
    styleUrls: ["./simple-search.component.scss"]
})
export class SimpleSearchComponent implements OnInit {
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
                            name: "hasGenre",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasCreationDate",
                            valVar: "creationDate",
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
    dateRef: IDisplayedProperty;

    passages: any;

    constructor(private apiService: ApiService, private knoraService: KnoraService) {
    }

    ngOnInit() {
        this.textRef = this.myPassage.props[0];
        this.authorLastNameRef = this.myPassage.props[11].res.props[8].res.props[1];
        this.bookTitleRef = this.myPassage.props[11].res.props[0];
        this.genreRef = this.myPassage.props[11].res.props[3];
        this.lexiaRef = this.myPassage.props[14].res.props[0];
        this.dateRef = this.myPassage.props[11].res.props[4];

        this.form = new FormGroup({
            text: new FormControl("", []),
            author: new FormControl("", []),
            bookTitle: new FormControl("", []),
            genre: new FormControl("", []),
            lexia: new FormControl("", []),
            date: new FormControl("", []),
            plays: new FormControl(false, [])
        });
    }

    onlyPlays(event) {
        console.log(event);
    }

    search() {
        if (this.form.get("text").value) {
            this.textRef.searchVal1 = this.form.get("text").value;
        } else {
            delete this.textRef.searchVal1;
        }

        if (this.form.get("author").value) {
            this.authorLastNameRef.searchVal1 = this.form.get("author").value;
        } else {
            delete this.authorLastNameRef.searchVal1;
        }

        if (this.form.get("bookTitle").value) {
            this.bookTitleRef.searchVal1 = this.form.get("bookTitle").value;
        } else {
            delete this.bookTitleRef.searchVal1;
        }

        if (this.form.get("genre").value) {
            this.genreRef.searchVal1 = this.form.get("genre").value;
        } else {
            delete this.genreRef.searchVal1;
        }

        if (this.form.get("lexia").value) {
            this.lexiaRef.searchVal1 = this.form.get("lexia").value;
        } else {
            delete this.lexiaRef.searchVal1;
        }

        if (this.form.get("date").valid) {
            this.dateRef.searchVal1 = this.form.get("date").value;
            this.dateRef.searchVal2 = this.form.get("date").value;
        } else {
            delete this.dateRef.searchVal1;
            delete this.dateRef.searchVal2;
        }

        this.knoraService.login("root@example.com", "test")
            .subscribe(loginData => {
                console.log(loginData);

                this.knoraService.search(this.myPassage, 0, false, 0)
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
}
