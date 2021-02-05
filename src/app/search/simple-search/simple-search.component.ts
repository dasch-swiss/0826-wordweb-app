import {Component, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {HelpComponent} from "../dialog/help/help.component";
import {StringService} from "../../services/string.service";
import {ListService} from "../../services/list.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ResultsComponent} from "../results/results.component";
import {CustomValidators} from "../../customValidators";
import {FillInComponent} from "../dialog/fill-in/fill-in.component";

@Component({
    selector: "app-simple-search",
    templateUrl: "./simple-search.component.html",
    styleUrls: ["./simple-search.component.scss"]
})
export class SimpleSearchComponent implements OnInit {
    @ViewChild("results") resultBox: ResultsComponent;

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
                name: "hasPrefixDisplayedTitle",
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
                priority: 1,
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
                            name: "hasPrefixBookTitle",
                            priority: 0,
                            res: null
                        },
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
                                        mandatory: true,
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
                priority: 1,
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
                            priority: 1,
                            res: null
                        }
                    ]
                }
            }
        ]
    };

    textRef: IDisplayedProperty = this.myPassage.props[0];
    authorLastNameRef: IDisplayedProperty = this.myPassage.props[12].res.props[9].res.props[1];
    bookTitleRef: IDisplayedProperty = this.myPassage.props[12].res.props[1];
    genreRef: IDisplayedProperty = this.myPassage.props[12].res.props[4];
    lexiaRef: IDisplayedProperty = this.myPassage.props[15].res.props[0];
    dateRef: IDisplayedProperty = this.myPassage.props[12].res.props[5];

    form: FormGroup;

    constructor(
        private apiService: ApiService,
        private listService: ListService,
        private stringService: StringService,
        private spinner: NgxSpinnerService,
        private helpDialog: MatDialog,
        private fillInDialog: MatDialog) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            text: new FormControl("", []),
            author: new FormControl("", []),
            bookTitle: new FormControl("", []),
            lexia: new FormControl("", []),
            date: new FormControl("", [CustomValidators.correctDate]),
            plays: new FormControl(false, [])
        });
    }

    search() {
        if ((!this.form.get("text").value
            && !this.form.get("author").value
            && !this.form.get("bookTitle").value
            && !this.form.get("lexia").value
            && !this.form.get("date").value)
            && !this.form.get("plays").value) {

            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "650px";
            dialogConfig.data = {
                title: "Please note",
                text: this.stringService.getString("text_not_filled")
            };
            this.fillInDialog.open(FillInComponent, dialogConfig);
            return;
        }

        if (this.form.get("text").value) {
            this.textRef.searchVal1 = this.form.get("text").value;
        } else {
            this.textRef.searchVal1 = null;
        }

        if (this.form.get("author").value) {
            this.authorLastNameRef.searchVal1 = this.form.get("author").value;
        } else {
            this.authorLastNameRef.searchVal1 = null;
        }

        if (this.form.get("bookTitle").value) {
            this.bookTitleRef.searchVal1 = this.form.get("bookTitle").value;
        } else {
            this.bookTitleRef.searchVal1 = null;
        }

        if (this.form.get("lexia").value) {
            this.lexiaRef.searchVal1 = this.form.get("lexia").value;
        } else {
            this.lexiaRef.searchVal1 = null;
        }

        if (this.form.get("date").valid && this.form.get("date").value.length > 0) {
            const REGEX = /^(\d{1,4})(-(\d{1,4}))?$/;
            const arr = this.form.get("date").value.match(REGEX);

            if (arr[1]) {
                this.dateRef.searchVal1 = arr[1];
            }

            if (arr[3]) {
                this.dateRef.searchVal2 = arr[3];
            }
        } else {
            this.dateRef.searchVal1 = null;
            this.dateRef.searchVal2 = null;
        }

        if (this.form.get("plays").value) {
            // Only plays means if genre is "Drama (Theatre)"
            this.genreRef.searchVal1 = this.listService.getIdOfNode("ALL DRAMA");
        } else {
            this.genreRef.searchVal1 = null;
        }

        this.resultBox.search(this.myPassage);
    }

    getHelpText(property: string) {
        switch (property) {
            case ("text"): {
                this.openHelpDialog(this.stringService.getString("text_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("author"): {
                this.openHelpDialog(this.stringService.getString("author_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("title"): {
                this.openHelpDialog(this.stringService.getString("title_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("lexia"): {
                this.openHelpDialog(this.stringService.getString("lexia_help"), "What is quoted?");
                break;
            }
            case ("date"): {
                this.openHelpDialog(this.stringService.getString("date_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("plays"): {
                this.openHelpDialog(this.stringService.getString("plays_help"), this.stringService.getString("default_title"));
                break;
            }
        }
    }

    reset(formControlName: string) {
        this.form.get(formControlName).reset("");
    }

    resetAll() {
        this.form.get("text").reset("");
        this.form.get("author").reset("");
        this.form.get("bookTitle").reset("");
        this.form.get("lexia").reset("");
        this.form.get("date").reset("");
        this.form.get("plays").setValue(false);
    }

    openHelpDialog(text: string, title: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "650px";
        dialogConfig.data = {
            title,
            text
        };
        this.helpDialog.open(HelpComponent, dialogConfig);
    }
}
