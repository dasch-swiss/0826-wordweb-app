import {Component, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {KnoraService} from "../../services/knora.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {HelpComponent} from "../dialog/help/help.component";
import {StringService} from "../../services/string.service";
import {CustomValidators} from "../../customValidators";
import {ResultsComponent} from "../results/results.component";
import {ListService} from "../../services/list.service";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-advanced-search",
    templateUrl: "./advanced-search.component.html",
    styleUrls: ["./advanced-search.component.scss"]
})
export class AdvancedSearchComponent implements OnInit {
    @ViewChild("results") resultBox: ResultsComponent;

    myPassage: IMainClass = {
        name: "passage",
        mainClass: {name: "passage", variable: "passage"},
        props: [
            {
                name: "hasText",
                // searchVal1: null,
                // searchVal2: null,
                // negation: false,
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
                priority: 0,
                res: null
            },
            {
                name: "hasMarking",
                priority: 0,
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
                            priority: 0,
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
                                    },
                                    {
                                        name: "hasGender",
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
    form: FormGroup;

    textRef: IDisplayedProperty;
    authorLastNameRef: IDisplayedProperty;
    genderRef: IDisplayedProperty;
    bookTitleRef: IDisplayedProperty;
    genreRef: IDisplayedProperty;
    lexiaRef: IDisplayedProperty;
    languageRef: IDisplayedProperty;
    functionRef: IDisplayedProperty;
    markingRef: IDisplayedProperty;
    createdDateRef: IDisplayedProperty;
    performedCompanyRef: IDisplayedProperty;

    genders: any[];
    genres: any[];
    languages: any[];
    functionVoices: any[];
    markings: any[];

    priority = 0;

    constructor(
        private apiService: ApiService,
        private stringService: StringService,
        private knoraService: KnoraService,
        private listService: ListService,
        private treeTableService: TreeTableService,
        private helpDialog: MatDialog) {
    }

    ngOnInit() {
        const genresNode = this.listService.getList("genre").nodes;
        this.genres = genresNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const genderNode = this.listService.getList("gender").nodes;
        this.genders = genderNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const languageNode = this.listService.getList("language").nodes;
        this.languages = languageNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const functionVoiceNode = this.listService.getList("functionVoice").nodes;
        this.functionVoices = functionVoiceNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const markingNode = this.listService.getList("marking").nodes;
        this.markings = markingNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        this.textRef = this.myPassage.props[0];
        this.authorLastNameRef = this.myPassage.props[11].res.props[10].res.props[1];
        this.genderRef = this.myPassage.props[11].res.props[10].res.props[2];
        this.bookTitleRef = this.myPassage.props[11].res.props[0];
        this.genreRef = this.myPassage.props[11].res.props[4];
        this.lexiaRef = this.myPassage.props[14].res.props[0];
        this.languageRef = this.myPassage.props[11].res.props[3];
        this.functionRef = this.myPassage.props[6];
        this.markingRef = this.myPassage.props[7];
        this.createdDateRef = this.myPassage.props[11].res.props[6];
        this.performedCompanyRef = this.myPassage.props[11].res.props[11];

        this.form = new FormGroup({
            text: new FormControl("", []),
            author: new FormControl("", []),
            gender: new FormControl("", []),
            bookTitle: new FormControl("", []),
            genre: new FormControl("", []),
            lexia: new FormControl("", []),
            language: new FormControl("", []),
            function: new FormControl("", []),
            marking: new FormControl("", []),
            createdDate: new FormControl("", [CustomValidators.correctDate]),
            performedCompany: new FormControl("", []),
            performedActor: new FormControl("", []),
            plays: new FormControl(false, [])
        });
    }

    search() {
        this.prepareStructure();
        this.resultBox.search(this.myPassage, this.priority);
    }

    prepareStructure() {
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

        if (this.form.get("gender").value) {
            this.genderRef.searchVal1 = this.form.get("gender").value;
            this.genderRef.priority = 0;
        } else {
            this.genderRef.searchVal1 = null;
            this.genderRef.priority = 1;
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

        if (this.form.get("language").value) {
            this.languageRef.searchVal1 = this.form.get("language").value;
            this.languageRef.priority = 0;
        } else {
            this.languageRef.searchVal1 = null;
            this.languageRef.priority = 1;
        }

        if (this.form.get("function").value) {
            this.functionRef.searchVal1 = this.form.get("function").value;
            this.functionRef.priority = 0;
        } else {
            this.functionRef.searchVal1 = null;
            this.functionRef.priority = 1;
        }

        if (this.form.get("marking").value) {
            this.markingRef.searchVal1 = this.form.get("marking").value;
            this.markingRef.priority = 0;
        } else {
            this.markingRef.searchVal1 = null;
            this.markingRef.priority = 1;
        }

        if (this.form.get("createdDate").valid && this.form.get("createdDate").value.length > 0) {
            const REGEX = /^(\d{1,4})(-(\d{1,4}))?$/;
            const arr = this.form.get("createdDate").value.match(REGEX);

            if (arr[1]) {
                this.createdDateRef.searchVal1 = arr[1];
            }

            if (arr[3]) {
                this.createdDateRef.searchVal2 = arr[3];
            }
        } else {
            this.createdDateRef.searchVal1 = null;
            this.createdDateRef.searchVal2 = null;
        }

        // if (this.form.get("performedCompany").valid) {
        //     this.performedCompanyRef.searchVal1 = this.form.get("performedCompany").value;
        // } else {
        //     this.performedCompanyRef.searchVal1 = null;
        // }

        if (this.form.get("plays").value) {
            // Only plays means if genre is "Drama (Theatre)"
            this.genreRef.searchVal1 = this.listService.searchNodeByName("Drama (Theatre)");
        } else {
            if (this.form.get("genre").value) {
                this.genreRef.searchVal1 = this.form.get("genre").value;
                this.genreRef.priority = 0;
            } else {
                this.genreRef.searchVal1 = null;
                this.genreRef.priority = 1;
            }
        }
    }

    getHelpText(formControlName: string) {
        switch (formControlName) {
            case ("text"): {
                this.openDialog(this.stringService.getString("text_help"), "Text");
                break;
            }
            case ("author"): {
                this.openDialog(this.stringService.getString("author_help"), "Author");
                break;
            }
            case ("bookTitle"): {
                this.openDialog(this.stringService.getString("title_help"), "Title");
                break;
            }
            case ("lexia"): {
                this.openDialog(this.stringService.getString("lexia_help"), "Lexia");
                break;
            }
            case ("createdDate"): {
                this.openDialog(this.stringService.getString("date_help"), "Date");
                break;
            }
            case ("marking"): {
                this.openDialog(this.stringService.getString("marking_help"), "Marking");
                break;
            }
            case ("function"): {
                this.openDialog(this.stringService.getString("function_help"), "Function");
                break;
            }
            case ("performedCompany"): {
                this.openDialog(this.stringService.getString("per_company_help"), "First performance: company");
                break;
            }
            case ("performedActor"): {
                this.openDialog(this.stringService.getString("per_actor_help"), "First performance: actor");
                break;
            }
            case ("language"): {
                this.openDialog(this.stringService.getString("language_help"), "Language");
                break;
            }
            case ("genre"): {
                this.openDialog(this.stringService.getString("genre_help"), "Genre");
                break;
            }
            case ("plays"): {
                this.openDialog(this.stringService.getString("plays_help"), "Only Plays");
                break;
            }
        }
    }

    clear(formControlName: string) {
        this.form.get(formControlName).reset("");
    }

    onChange(toggled) {
        toggled ? this.form.get("genre").disable() : this.form.get("genre").enable();
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
}
