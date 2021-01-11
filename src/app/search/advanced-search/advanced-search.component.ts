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
import {FillInComponent} from "../dialog/fill-in/fill-in.component";
import {forkJoin} from "rxjs";

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
                                        priority: 1,
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
                        },
                        {
                            name: "performedByActor",
                            priority: 1,
                            res: {
                                name: "person",
                                props: [
                                    {
                                        name: "hasFirstName",
                                        priority: 1,
                                        mandatory: true,
                                        res: null
                                    },
                                    {
                                        name: "hasLastName",
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
    authorLastNameRef: IDisplayedProperty = this.myPassage.props[12].res.props[11].res.props[1];
    bookTitleRef: IDisplayedProperty = this.myPassage.props[12].res.props[1];
    genreRef: IDisplayedProperty = this.myPassage.props[12].res.props[5];
    lexiaRef: IDisplayedProperty = this.myPassage.props[15].res.props[0];
    languageRef: IDisplayedProperty = this.myPassage.props[12].res.props[4];
    functionRef: IDisplayedProperty = this.myPassage.props[7];
    markingRef: IDisplayedProperty = this.myPassage.props[8];
    createdDateRef: IDisplayedProperty = this.myPassage.props[12].res.props[7];
    performedCompanyRef: IDisplayedProperty = this.myPassage.props[12].res.props[12];
    performedVenueRef: IDisplayedProperty = this.myPassage.props[12].res.props[13];
    performedActorRef: IDisplayedProperty = this.myPassage.props[12].res.props[14];

    genres: any[];
    languages: any[];
    functionVoices: any[];
    markings: any[];
    companies: any[];
    venues: any[];
    actors: any[];

    form: FormGroup;

    constructor(
        private apiService: ApiService,
        private stringService: StringService,
        private knoraService: KnoraService,
        private listService: ListService,
        private treeTableService: TreeTableService,
        private helpDialog: MatDialog) {
    }

    ngOnInit() {
        this.prepareCompanies();
        this.prepareVenues();
        this.prepareActors();

        const genresNode = this.listService.getList("genre").nodes;
        this.genres = genresNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const languageNode = this.listService.getList("language").nodes;
        this.languages = languageNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const functionVoiceNode = this.listService.getList("functionVoice").nodes;
        this.functionVoices = functionVoiceNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const markingNode = this.listService.getList("marking").nodes;
        this.markings = markingNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        this.form = new FormGroup({
            text: new FormControl("", []),
            author: new FormControl("", []),
            bookTitle: new FormControl("", []),
            genre: new FormControl("", []),
            lexia: new FormControl("", []),
            language: new FormControl("", []),
            function: new FormControl("", []),
            marking: new FormControl("", []),
            createdDate: new FormControl("", [CustomValidators.correctDate]),
            performedCompany: new FormControl("", []),
            performedVenue: new FormControl("", []),
            performedActor: new FormControl("", []),
            plays: new FormControl(false, [])
        });
    }

    prepareCompanies() {
        this.knoraService.getCompaniesCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / 25);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this.knoraService.getCompanies(offset));
                }

                forkJoin<any>(requests)
                    .subscribe((res: Array<Array<any>>) => {
                        this.companies = []
                            .concat(...res)
                            .map(company => {
                                if (company.hasCompanyTitle.length === 1) {
                                    company.hasCompanyTitle = company.hasCompanyTitle[0].value;
                                    return company;
                                }
                            })
                            .sort((res1, res2) => this.sortCompanies(res1, res2));
                    }, error => {
                        requests.map(a => a.unsubscribe());
                    });
            });

    }

    prepareVenues() {
        this.knoraService.getVenuesCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / 25);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this.knoraService.getVenues(offset));
                }

                forkJoin<any>(requests)
                    .subscribe((res: Array<Array<any>>) => {
                        this.venues = []
                            .concat(...res)
                            .map(venue => {
                                if (venue.hasPlaceVenue.length === 1) {
                                    venue.value = this.listService.getNameOfNode(venue.hasPlaceVenue[0].listNode);
                                    venue.hasPlaceVenue = venue.hasPlaceVenue[0].listNode;
                                    return venue;
                                }
                            })
                            .sort((res1, res2) => this.sortVenues(res1, res2));
                    }, error => {
                        requests.map(a => a.unsubscribe());
                    });
            });
    }

    prepareActors() {
        this.knoraService.getActorsCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / 25);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this.knoraService.getActors(offset));
                }

                forkJoin<any>(requests)
                    .subscribe((res: Array<Array<any>>) => {
                        this.actors = []
                            .concat(...res)
                            .map(actor => {
                                if (actor.hasLastName.length === 1) {
                                    actor.hasLastName = actor.hasLastName[0].value;
                                }
                                if (actor.hasFirstName.length === 1) {
                                    actor.hasFirstName = actor.hasFirstName[0].value;
                                }
                                return actor;
                            })
                            .sort((res1, res2) => this.sortActors(res1, res2));
                    }, error => {
                        requests.map(a => a.unsubscribe());
                    });
            });
    }

    search() {
        if (!this.form.get("text").value
            && !this.form.get("author").value
            && !this.form.get("bookTitle").value
            && !this.form.get("lexia").value
            && !this.form.get("language").value
            && !this.form.get("function").value
            && !this.form.get("marking").value
            && !this.form.get("createdDate").value
            && !this.form.get("performedCompany").value
            && !this.form.get("performedVenue").value
            && !this.form.get("performedActor").value
            && (!this.form.get("plays").value && !this.form.get("genre").value)) {

            const dialogConfig = new MatDialogConfig();
            dialogConfig.width = "650px";
            dialogConfig.data = {
                title: this.stringService.getString("default_title"),
                text: this.stringService.getString("text_not_filled")
            };
            this.helpDialog.open(FillInComponent, dialogConfig);
            return;
        }
        this.prepareStructure();
        this.resultBox.search(this.myPassage);
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

        if (this.form.get("performedCompany").value) {
            this.performedCompanyRef.searchVal1 = this.form.get("performedCompany").value;
            this.performedCompanyRef.priority = 0;
        } else {
            this.performedCompanyRef.searchVal1 = null;
            this.performedCompanyRef.priority = 1;
        }

        if (this.form.get("performedVenue").value) {
            this.performedVenueRef.searchVal1 = this.form.get("performedVenue").value;
            this.performedVenueRef.priority = 0;
        } else {
            this.performedVenueRef.searchVal1 = null;
            this.performedVenueRef.priority = 1;
        }

        if (this.form.get("performedActor").value) {
            this.performedActorRef.searchVal1 = this.form.get("performedActor").value;
            this.performedActorRef.priority = 0;
        } else {
            this.performedActorRef.searchVal1 = null;
            this.performedActorRef.priority = 1;
        }

        if (this.form.get("plays").value) {
            // Only plays means if genre is "Drama (Theatre)"
            this.genreRef.searchVal1 = this.listService.getIdOfNode("ALL DRAMA");
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
                this.openHelpDialog(this.stringService.getString("text_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("author"): {
                this.openHelpDialog(this.stringService.getString("author_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("bookTitle"): {
                this.openHelpDialog(this.stringService.getString("title_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("lexia"): {
                this.openHelpDialog(this.stringService.getString("lexia_help"), "What is quoted?");
                break;
            }
            case ("createdDate"): {
                this.openHelpDialog(this.stringService.getString("date_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("marking"): {
                this.openHelpDialog(this.stringService.getString("marking_help"), "\"Marking\"");
                break;
            }
            case ("function"): {
                this.openHelpDialog(this.stringService.getString("function_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("performedCompany"): {
                this.openHelpDialog(this.stringService.getString("per_company_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("performedVenue"): {
                this.openHelpDialog(this.stringService.getString("per_venue_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("performedActor"): {
                this.openHelpDialog(this.stringService.getString("per_actor_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("language"): {
                this.openHelpDialog(this.stringService.getString("language_help"), this.stringService.getString("default_title"));
                break;
            }
            case ("genre"): {
                this.openHelpDialog(this.stringService.getString("genre_help"), this.stringService.getString("default_title"));
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
        this.form.get("genre").reset("");
        this.form.get("lexia").reset("");
        this.form.get("language").reset("");
        this.form.get("function").reset("");
        this.form.get("marking").reset("");
        this.form.get("createdDate").reset("");
        this.form.get("performedCompany").reset("");
        this.form.get("performedVenue").reset("");
        this.form.get("performedActor").reset("");
        this.form.get("plays").setValue(false);
    }

    onChange(toggled) {
        toggled ? this.form.get("genre").disable() : this.form.get("genre").enable();
    }

    openHelpDialog(text: string, title: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "650px";
        dialogConfig.data = {
            text,
            title
        };
        this.helpDialog.open(HelpComponent, dialogConfig);
    }

    selectCompany() {
        console.log("select company");
    }

    sortCompanies(comp1: any, comp2: any) {
        const companyTitle1 = comp1.hasCompanyTitle.toUpperCase();
        const companyTitle2 = comp2.hasCompanyTitle.toUpperCase();

        return companyTitle1 <= companyTitle2 ? (companyTitle1 === companyTitle2 ? 0 : -1) : 1;
    }

    sortVenues(ven1: any, ven2: any) {
        const placeVenue1 = ven1.value.toUpperCase();
        const placeVenue2 = ven2.value.toUpperCase();

        return placeVenue1 <= placeVenue2 ? (placeVenue1 === placeVenue2 ? 0 : -1) : 1;
    }

    sortActors(act1: any, act2: any) {
        const actorLastName1 = act1.hasLastName.toUpperCase();
        const actorLastName2 = act2.hasLastName.toUpperCase();

        return actorLastName1 <= actorLastName2 ? (actorLastName1 === actorLastName2 ? 0 : -1) : 1;
    }
}
