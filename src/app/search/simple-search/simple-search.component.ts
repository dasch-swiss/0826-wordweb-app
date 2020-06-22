import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {IDisplayedClass, IDisplayedProperty} from "../../model/displayModel";
import {KnoraService} from "../../services/knora.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {HelpComponent} from "../dialog/help/help.component";
import {StringService} from "../../services/string.service";
import {ListService} from "../../services/list.service";
import {Observable} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";

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

    nPassages: Observable<number>;
    passages: Array<any>;
    detailPassages = {};

    searchStarted = false;
    detailStarted = false;
    errorObject = null;
    priority = 0;

    constructor(
        private apiService: ApiService,
        private listService: ListService,
        private stringService: StringService,
        private knoraService: KnoraService,
        private spinner: NgxSpinnerService,
        private helpDialog: MatDialog) {
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
            lexia: new FormControl("", []),
            date: new FormControl("", []),
            plays: new FormControl(false, [])
        });
    }

    search() {
        this.spinner.show("spinner-big", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            type: "ball-spin-clockwise",
            size: "medium"
        });

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

        if (this.form.get("plays").value) {
            // Insert the genre Theatre iri
            this.genreRef.searchVal1 = "";
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

        this.passages = null;
        this.errorObject = null;
        this.searchStarted = true;

        this.nPassages = this.knoraService.graveSearchQueryCount(this.myPassage, this.priority);

        this.knoraService.graveSeachQuery(this.myPassage, this.priority)
            .subscribe(data => {
                this.passages = data.map(passage => {
                    passage.expanded = false;
                    passage.original = false;
                    return passage;
                });
                console.log(this.passages);
                this.searchStarted = false;
                this.spinner.hide("spinner-big");
            }, error => {
                this.errorObject = error;
                this.searchStarted = false;
                this.spinner.hide("spinner-big");
            });
    }

    loadMoreResults() {
        this.spinner.show("spinner-small", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            type: "ball-spin-clockwise",
            size: "small"
        });
        this.errorObject = null;
        this.searchStarted = true;

        const offset = Math.floor(this.passages.length / 25);

        this.knoraService.graveSeachQuery(this.myPassage, this.priority, offset)
            .subscribe(data => {
                console.log(data);
                this.passages.push(...data);
                this.spinner.hide("spinner-small");
                this.searchStarted = false;
            }, error => {
                this.errorObject = error;
                this.spinner.hide("spinner-small");
                this.searchStarted = false;
            });
    }

    getHelpText(property: string) {
        switch (property) {
            case ("text"): {
                this.openDialog(this.stringService.getString("text_help"), "Text");
                break;
            }
            case ("author"): {
                this.openDialog(this.stringService.getString("author_help"), "Author");
                break;
            }
            case ("title"): {
                this.openDialog(this.stringService.getString("title_help"), "Title");
                break;
            }
            case ("lexia"): {
                this.openDialog(this.stringService.getString("lexia_help"), "Lexia");
                break;
            }
            case ("date"): {
                this.openDialog(this.stringService.getString("date_help"), "Date");
                break;
            }
            case ("plays"): {
                this.openDialog(this.stringService.getString("plays_help"), "Only Plays");
                break;
            }
        }
    }

    expandOrClose(passage: any) {
        if (passage.expanded) {
            this.close(passage);
        } else {
            this.expand(passage);
        }
    }

    close(passage: any) {
        passage.expanded = !passage.expanded;
    }

    expand(passage: any) {
        this.detailStarted = true;
        passage.expanded = !passage.expanded;
        this.spinner.show(`spinner-${passage.id}`, {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            type: "ball-spin-clockwise",
            size: "small"
        });

        // this.knoraService.getResource("http://rdfh.ch/0826/-CXBmQ_-QvyqroyGJG_oHw")
        //     .subscribe(data => {
        //         this.spinner.hide(`spinner-${i}`);
        //         console.log(data);
        //     }, error => {
        //         // TODO Different error concept reporting
        //         this.spinner.hide(`spinner-${i}`);
        //     });

        if (!this.detailPassages[passage.id]) {
            this.knoraService.graveSeachQuery(this.myPassage, this.priority)
                .subscribe(data => {
                    this.detailPassages[passage.id] = { text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren" };
                    console.log(this.detailPassages);
                    this.detailStarted = false;
                    this.spinner.hide(`spinner-${passage.id}`);
                }, error => {
                    this.detailStarted = false;
                    this.spinner.hide(`spinner-${passage.id}`);
                });
        }
    }

    expandBtnText(passage: any): string {
        return passage.expanded ? "Hide" : "Expand";
    }

    originalOrNormalized(passage: any) {
        passage.original = !passage.original;
    }

    spellingBtnText(passage: any): string {
        return passage.original ? "Normalized spelling" : "Origial spelling";
    }

    clear(formControlName: string) {
        this.form.get(formControlName).reset("");
    }

    openDialog(text: string, name: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "650px";
        dialogConfig.data = {
            text,
            name
        };
        this.helpDialog.open(HelpComponent, dialogConfig);
    }

    setOrder($event) {
        if ($event.value === "Title") {
            this.passages.sort((a, b) => {
                return a.occursIn[0].hasBookTitle[0].value < b.occursIn[0].hasBookTitle[0].value ? -1 : 1;
            });
        }
    }
}
