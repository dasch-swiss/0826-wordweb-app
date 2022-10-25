import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {HelpComponent} from "../dialog/help/help.component";
import {StringService} from "../../services/string.service";
import {ListService} from "../../services/list.service";
import {ResultsComponent} from "../results/results.component";
import {CustomValidators} from "../../customValidators";
import {FillInComponent} from "../dialog/fill-in/fill-in.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: "app-simple-search",
    templateUrl: "./simple-search.component.html",
    styleUrls: ["./simple-search.component.scss"]
})
export class SimpleSearchComponent implements OnInit, AfterViewInit {
    @ViewChild("results") resultBox: ResultsComponent;

    private readonly _DIALOG_WIDTH = "650px";
    private readonly _ALL_DRAMA = "ALL DRAMA";
    private readonly _STATUS = "Status";
    private readonly _UNEDITED = 'unedited';
    private readonly _PUBLIC = 'public';

    myPassage: IMainClass = {
        name: "passage",
        mainClass: {name: "passage", variable: "passage"},
        props: [
            { // [0]
                name: "hasText",
                priority: 0,
                res: null
            },
            { // [1]
                name: "hasTextHist",
                priority: 0,
                res: null
            },
            { // [2]
                name: "hasPrefixDisplayedTitle",
                priority: 0,
                res: null
            },
            { // [3]
                name: "hasDisplayedTitle",
                priority: 0,
                res: null
            },
            { // [4]
                name: "hasPage",
                priority: 1,
                res: null
            },
            { // [5]
                name: "hasPageHist",
                priority: 1,
                res: null
            },
            { // [6]
                name: "hasResearchField",
                priority: 1,
                res: null
            },
            { // [7]
                name: "hasFunctionVoice",
                priority: 1,
                res: null
            },
            { // [8]
                name: "hasMarking",
                priority: 1,
                res: null
            },
            { // [9]
                name: "hasStatus",
                priority: 1,
                res: null
            },
            { // [10]
                name: "hasInternalComment",
                priority: 1,
                res: null
            },
            { // [11]
                name: "hasPassageComment",
                priority: 1,
                res: null
            },
            { // [12]
                name: "occursIn",
                priority: 0,
                res: {
                    name: "book",
                    props: [
                        { // [12] [0]
                            name: "hasPrefixBookTitle",
                            priority: 0,
                            res: null
                        },
                        { // [12] [1]
                            name: "hasBookTitle",
                            priority: 0,
                            res: null
                        },
                        { // [12] [2]
                            name: "hasEdition",
                            priority: 1,
                            res: null
                        },
                        { // [12] [3]
                            name: "hasEditionHist",
                            priority: 1,
                            res: null
                        },
                        { // [12] [4]
                            name: "hasGenre",
                            priority: 0,
                            res: null
                        },
                        { // [12] [5]
                            name: "hasCreationDate",
                            valVar: "creationDate",
                            // searchVal1: "1500",
                            // searchVal2: "1860",
                            priority: 0,
                            res: null
                        },
                        { // [12] [6]
                            name: "hasPublicationDate",
                            priority: 1,
                            res: null
                        },
                        { // [12] [7]
                            name: "hasFirstPerformanceDate",
                            priority: 1,
                            res: null
                        },
                        { // [12] [8]
                            name: "hasBookComment",
                            priority: 1,
                            res: null
                        },
                        { // [12] [9]
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
                        { // [12] [10]
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
                        { // [12] [11]
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
            { // [13]
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
    statusRef: IDisplayedProperty = this.myPassage.props[9];
    lexiaRef: IDisplayedProperty = this.myPassage.props[15].res.props[0];
    dateRef: IDisplayedProperty = this.myPassage.props[12].res.props[5];

    form: FormGroup;

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _cdr: ChangeDetectorRef,
                private _listService: ListService,
                private _stringService: StringService,
                private _helpDialog: MatDialog,
                private _fillInDialog: MatDialog) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            text: new FormControl("", []),
            author: new FormControl("", []),
            bookTitle: new FormControl("", []),
            lexia: new FormControl("", []),
            date: new FormControl("", [CustomValidators.correctDate]),
            plays: new FormControl(false, []),
            swissBritNet: new FormControl(false, [])
        });
    }

    ngAfterViewInit() {
        this._route.queryParams
            .subscribe(data => {
                let startSearch = false;
                this.resetAll();

                if (data.text) {
                    this.form.get("text").setValue(data.text);
                    this.textRef.searchVal1 = data.text;
                    startSearch = true;
                }

                if (data.title) {
                    const REGEX = /^(the\s)?(a\s)?(an\s)?(.*)$/;
                    const bt = data.title.toLowerCase().match(REGEX)[4];
                    this.form.get("bookTitle").setValue(bt);
                    this.bookTitleRef.searchVal1 = bt;
                    startSearch = true;
                }

                if (data.author) {
                    this.form.get("author").setValue(data.author);
                    this.authorLastNameRef.searchVal1 = data.author;
                    startSearch = true;
                }

                if (data.lexia) {
                    this.form.get("lexia").setValue(data.lexia);
                    this.lexiaRef.searchVal1 = data.lexia;
                    startSearch = true;
                }

                if (data.plays === "true") {
                    this.form.get("plays").setValue(true);
                    this.genreRef.searchVal1 = this._listService.getIdOfNode(this._ALL_DRAMA);
                    startSearch = true;
                }

                if (data.swissBritNet === "true") {
                    this.form.get("swissBritNet").setValue(true);
                    this.statusRef.searchVal1 = this._listService.getIdOfNode(this._UNEDITED);
                    //this.genreRef.searchVal1 = this._listService.getIdOfNode(this._ALL_DRAMA);
                    startSearch = true;
                }

                if (data.date) {
                    const REGEX = /^(\d{1,4})(-(\d{1,4}))?$/;
                    const arr = data.date.match(REGEX);

                    if (arr && arr[1]) {
                        if (!arr[3]) {
                            this.form.get("date").setValue(data.date);
                            this.dateRef.searchVal1 = arr[1];
                            startSearch = true;
                        }

                        if (arr[3] && (Number(arr[3]) > Number(arr[1]))) {
                            this.form.get("date").setValue(data.date);
                            this.dateRef.searchVal1 = arr[1];
                            this.dateRef.searchVal2 = arr[3];
                            startSearch = true;
                        }
                    }
                }

                if (startSearch) {
                    console.log('myPassage: ', this.myPassage);
                    this.resultBox.search(this.myPassage);
                }
            });

        this._cdr.detectChanges();
    }

    search() {
        const text = this.form.get("text").value.trim();
        const authorName = this.form.get("author").value.trim();
        const bookTitle = this.form.get("bookTitle").value.trim();
        const lexia = this.form.get("lexia").value.trim();
        const dateEmpty = this.form.get("date").value.length == 0;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = this._DIALOG_WIDTH;

        const params = {};

        if (this.form.get("date").invalid) {
            dialogConfig.data = {
                title: "Please note",
                text: this._stringService.getString("date_invalid")
            };

            this._fillInDialog.open(FillInComponent, dialogConfig);
            return;
        }

        if ((!text && !authorName && !bookTitle && !lexia && dateEmpty)) {
            dialogConfig.data = {
                title: "Please note",
                text: this._stringService.getString("text_not_filled")
            };

            this._fillInDialog.open(FillInComponent, dialogConfig);
            return;
        }

        if (text) {
            this.textRef.searchVal1 = text;
            params["text"] = text;
        } else {
            this.textRef.searchVal1 = null;
        }

        if (authorName) {
            this.authorLastNameRef.searchVal1 = authorName;
            params["author"] = authorName;
        } else {
            this.authorLastNameRef.searchVal1 = null;
        }

        if (bookTitle) {
            const REGEX = /^(the\s)?(a\s)?(an\s)?(.*)$/;
            this.bookTitleRef.searchVal1 = bookTitle.toLowerCase().match(REGEX)[4];
            params["title"] = bookTitle;
        } else {
            this.bookTitleRef.searchVal1 = null;
        }

        if (lexia) {
            this.lexiaRef.searchVal1 = lexia;
            params["lexia"] = lexia;
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

            params["date"] = this.form.get("date").value;
        } else {
            this.dateRef.searchVal1 = null;
            this.dateRef.searchVal2 = null;
        }

        if (this.form.get("plays").value) {
            this.genreRef.searchVal1 = this._listService.getIdOfNode(this._ALL_DRAMA);
            params["plays"] = "true";
        } else {
            this.genreRef.searchVal1 = null;
        }

        if (this.form.get("swissBritNet").value) {
            this.statusRef.searchVal1 = this._listService.getIdOfNode(this._UNEDITED);
            params["swissBritNet"] = "true";
        } else {
            this.statusRef.searchVal1 = null;
        }

        if (params) {
            this._router.navigate(["search/simple"], { queryParams: params});
        }
    }

    getHelpText(property: string) {
        switch (property) {
            case ("text"): {
                this.openHelpDialog(this._stringService.getString("text_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("author"): {
                this.openHelpDialog(this._stringService.getString("author_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("title"): {
                this.openHelpDialog(this._stringService.getString("title_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("lexia"): {
                this.openHelpDialog(this._stringService.getString("lexia_help"), "What is quoted?");
                break;
            }
            case ("date"): {
                this.openHelpDialog(this._stringService.getString("date_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("plays"): {
                this.openHelpDialog(this._stringService.getString("plays_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("swissBritNet"): {
                this.openHelpDialog(this._stringService.getString("swissBritNet_help"), this._stringService.getString("default_title"));
                break;
            }

        }
    }

    reset(formControlName: string) {
        this.form.get(formControlName).reset("");
    }

    resetAll() {
        // Resets all form controls
        this.form.get("text").reset("");
        this.form.get("author").reset("");
        this.form.get("bookTitle").reset("");
        this.form.get("lexia").reset("");
        this.form.get("date").reset("");
        this.form.get("plays").setValue(false);
        this.form.get("swissBritNet").setValue(false);

        // Resets all the values in the structure
        this.textRef.searchVal1 = null;
        this.bookTitleRef.searchVal1 = null;
        this.authorLastNameRef.searchVal1 = null;
        this.lexiaRef.searchVal1 = null;
        this.dateRef.searchVal1 = null;
        this.dateRef.searchVal2 = null;
        // Resets the result box
        this.resultBox.reset();
    }

    openHelpDialog(text: string, title: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = this._DIALOG_WIDTH;
        dialogConfig.data = {
            title,
            text
        };
        this._helpDialog.open(HelpComponent, dialogConfig);
    }
}
