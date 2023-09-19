import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {KnoraService} from "../../services/knora.service";
import {MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig} from "@angular/material/legacy-dialog";
import {HelpComponent} from "../dialog/help/help.component";
import {StringService} from "../../services/string.service";
import {CustomValidators} from "../../customValidators";
import {ResultsComponent} from "../results/results.component";
import {ListService} from "../../services/list.service";
import {FillInComponent} from "../dialog/fill-in/fill-in.component";
import {forkJoin, of} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {IListNode} from "../../model/listModel";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: "app-advanced-search",
    templateUrl: "./advanced-search.component.html",
    styleUrls: ["./advanced-search.component.scss"]
})
export class AdvancedSearchComponent implements OnInit, AfterViewInit {
    @ViewChild("results") resultBox: ResultsComponent;

    private readonly _DIALOG_WIDTH = "650px";
    private readonly _ALL_DRAMA = "ALL DRAMA";
    readonly MAX_RESOURCE_PER_RESULT = 25;

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

    genres: IListNode[];
    languages: IListNode[];
    functionVoices: IListNode[];
    markings: IListNode[];
    companies: any[];
    venues: any[];
    actors: any[];

    form: UntypedFormGroup;
    searchStarted = false;

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _cdr: ChangeDetectorRef,
                private _knoraService: KnoraService,
                private _listService: ListService,
                private _stringService: StringService,
                private _helpDialog: MatDialog,
                private _fillInDialog: MatDialog) {
    }

    ngOnInit() {
        this.prepareCompanies();
        this.prepareVenues();
        this.prepareActors();

        this.genres = this._listService.getFlattenList("genre");
        this.languages = this._listService.getFlattenList("language");
        this.functionVoices = this._listService.getFlattenList("functionVoice");
        this.markings = this._listService.getFlattenList("marking");

        this.form = new UntypedFormGroup({
            text: new UntypedFormControl("", []),
            author: new UntypedFormControl("", []),
            bookTitle: new UntypedFormControl("", []),
            genre: new UntypedFormControl("", []),
            lexia: new UntypedFormControl("", []),
            language: new UntypedFormControl("", []),
            function: new UntypedFormControl("", []),
            marking: new UntypedFormControl("", []),
            createdDate: new UntypedFormControl("", [CustomValidators.correctDate]),
            performedCompany: new UntypedFormControl("", []),
            performedVenue: new UntypedFormControl("", []),
            performedActor: new UntypedFormControl("", []),
            plays: new UntypedFormControl(false, [])
        });
    }

    prepareCompanies() {
        this._knoraService.getCompaniesCount()
            .pipe(
               mergeMap(amount => {
                   if (amount === 0) {
                       return forkJoin([of(0)]);
                   }

                   const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);
                   const requests = [];

                   for (let offset = 0; offset < maxOffset; offset++) {
                       requests.push(this._knoraService.getCompanies(offset));
                   }

                   return forkJoin([of(amount), forkJoin(requests)])
               })
            )
            .subscribe(result => {
                if (result[1]) {
                    this.companies = []
                        .concat(...result[1])
                        .map(company => {
                            if (company.hasCompanyTitle.length === 1) {
                                company.hasCompanyTitle = company.hasCompanyTitle[0].value;
                                return company;
                            }
                        })
                        .sort((res1, res2) => this.sortCompanies(res1, res2));
                }
            })
    }

    prepareVenues() {
        this._knoraService.getVenuesCount()
            .pipe(
                mergeMap(amount => {
                    if (amount === 0) {
                        return forkJoin([of(0)]);
                    }

                    const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);
                    const requests = [];

                    for (let offset = 0; offset < maxOffset; offset++) {
                        requests.push(this._knoraService.getVenues(offset));
                    }

                    return forkJoin([of(amount), forkJoin(requests)])
                })
            )
            .subscribe(result => {
                if (result[1]) {
                    this.venues = []
                        .concat(...result[1])
                        .map(venue => {
                            if (venue.hasPlaceVenue.length === 1) {
                                venue.value = this._listService.getNameOfNode(venue.hasPlaceVenue[0].listNode);
                                venue.hasPlaceVenue = venue.hasPlaceVenue[0].listNode;
                                return venue;
                            }
                        })
                        .sort((res1, res2) => this.sortVenues(res1, res2));
                }
            })
    }

    prepareActors() {
        this._knoraService.getActorsCount()
            .pipe(
                mergeMap(amount => {
                    if (amount === 0) {
                        return forkJoin([of(0)]);
                    }

                    const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);
                    const requests = [];

                    for (let offset = 0; offset < maxOffset; offset++) {
                        requests.push(this._knoraService.getActors(offset));
                    }

                    return forkJoin([of(amount), forkJoin(requests)])
                })
            )
            .subscribe(result => {
                if (result[1]) {
                    this.actors = []
                        .concat(...result[1])
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
                }
            })
    }

    ngAfterViewInit() {
        this._route.queryParams
            .subscribe(data => {
                let queryParamAdded = false;
                this.resetAll();

                if (data.text) {
                    this.form.get("text").setValue(data.text);
                    this.textRef.searchVal1 = data.text;
                    queryParamAdded = true;
                }

                if (data.title) {
                    const REGEX = /^(the\s)?(a\s)?(an\s)?(.*)$/;
                    const bt = data.title.toLowerCase().match(REGEX)[4];
                    this.form.get("bookTitle").setValue(bt);
                    this.bookTitleRef.searchVal1 = bt;
                    queryParamAdded = true;
                }

                if (data.author) {
                    this.form.get("author").setValue(data.author);
                    this.authorLastNameRef.searchVal1 = data.author;
                    queryParamAdded = true;
                }

                if (data.lexia) {
                    this.form.get("lexia").setValue(data.lexia);
                    this.lexiaRef.searchVal1 = data.lexia;
                    queryParamAdded = true;
                }

                if (data.plays === "true") {
                    this.form.get("plays").setValue(true);
                    this.genreRef.searchVal1 = this._listService.getIdOfNode(this._ALL_DRAMA);
                    queryParamAdded = true;
                } else if (data.genre && this._listService.getIdOfNode(data.genre) !== "-1") {
                    const genre_id = this._listService.getIdOfNode(data.genre);
                    this.form.get("genre").setValue(genre_id);
                    this.genreRef.searchVal1 = genre_id;
                    queryParamAdded = true;
                }

                if (data.date) {
                    const REGEX = /^(\d{1,4})(-(\d{1,4}))?$/;
                    const arr = data.date.match(REGEX);

                    if (arr && arr[1]) {
                        if (!arr[3]) {
                            this.form.get("createdDate").setValue(data.date);
                            this.createdDateRef.searchVal1 = arr[1];
                            queryParamAdded = true;
                        }

                        if (arr[3] && (Number(arr[3]) > Number(arr[1]))) {
                            this.form.get("createdDate").setValue(data.date);
                            this.createdDateRef.searchVal1 = arr[1];
                            this.createdDateRef.searchVal2 = arr[3];
                            queryParamAdded = true;
                        }
                    }
                }

                if (data.marking && this._listService.getIdOfNode(data.marking) !== "-1") {
                    const mark_id = this._listService.getIdOfNode(data.marking);
                    this.form.get("marking").setValue(mark_id);
                    this.markingRef.searchVal1 = mark_id;
                    queryParamAdded = true;
                }

                if (data.function && this._listService.getIdOfNode(data.function) !== "-1") {
                    const func_id = this._listService.getIdOfNode(data.function);
                    this.form.get("function").setValue(func_id);
                    this.functionRef.searchVal1 = func_id;
                    queryParamAdded = true;
                }

                if (data.language && this._listService.getIdOfNode(data.language) !== "-1") {
                    const lang_id = this._listService.getIdOfNode(data.language);
                    this.form.get("language").setValue(lang_id);
                    this.languageRef.searchVal1 = lang_id;
                    queryParamAdded = true;
                }

                if (data.company) {
                    // TODO Set Form Control
                    this.performedCompanyRef.searchVal1 = data.company;
                    this.performedCompanyRef.priority = 0;
                    queryParamAdded = true;
                } else {
                    this.performedCompanyRef.priority = 1;
                }

                if (data.venue) {
                    // TODO Set Form Control
                    this.performedVenueRef.searchVal1 = data.venue;
                    this.performedVenueRef.priority = 0;
                    queryParamAdded = true;
                } else {
                    this.performedVenueRef.priority = 1;
                }

                if (data.actor) {
                    // TODO Set Form Control
                    this.performedActorRef.searchVal1 = data.actor;
                    this.performedActorRef.priority = 0;
                    queryParamAdded = true;
                } else {
                    this.performedActorRef.priority = 1;
                }

                if (queryParamAdded) {
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
        const createdDateEmpty = this.form.get("createdDate").value.length == 0;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = this._DIALOG_WIDTH;

        const params = {};

        if (this.form.get("createdDate").invalid) {
            dialogConfig.data = {
                title: "Please note",
                text: this._stringService.getString("date_invalid")
            };

            this._fillInDialog.open(FillInComponent, dialogConfig);
            return;
        }

        if (!text && !authorName && !bookTitle && !lexia && createdDateEmpty
            && !this.form.get("language").value
            && !this.form.get("function").value
            && !this.form.get("marking").value
            && !this.form.get("performedCompany").value
            && !this.form.get("performedVenue").value
            && !this.form.get("performedActor").value
            && (!this.form.get("plays").value && !this.form.get("genre").value)) {

            dialogConfig.data = {
                title: this._stringService.getString("default_title"),
                text: this._stringService.getString("text_not_filled")
            };
            this._helpDialog.open(FillInComponent, dialogConfig);
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

        if (this.form.get("language").value) {
            const lang_id = this.form.get("language").value;
            this.languageRef.searchVal1 = lang_id;
            this.languageRef.priority = 0;
            params["language"] = this._listService.getNameOfNode(lang_id);
        } else {
            this.languageRef.searchVal1 = null;
            this.languageRef.priority = 1;
        }

        if (this.form.get("function").value) {
            const func_id = this.form.get("function").value;
            this.functionRef.searchVal1 = func_id;
            this.functionRef.priority = 0;
            params["function"] = this._listService.getNameOfNode(func_id);
        } else {
            this.functionRef.searchVal1 = null;
            this.functionRef.priority = 1;
        }

        if (this.form.get("marking").value) {
            const mark_id = this.form.get("marking").value;
            this.markingRef.searchVal1 = mark_id;
            this.markingRef.priority = 0;
            params["marking"] = this._listService.getNameOfNode(mark_id);
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

            params["date"] = this.form.get("createdDate").value;
        } else {
            this.createdDateRef.searchVal1 = null;
            this.createdDateRef.searchVal2 = null;
        }

        if (this.form.get("performedCompany").value) {
            this.performedCompanyRef.searchVal1 = this.form.get("performedCompany").value;
            this.performedCompanyRef.priority = 0;
            params["company"] = this.form.get("performedCompany").value;
        } else {
            this.performedCompanyRef.searchVal1 = null;
            this.performedCompanyRef.priority = 1;
        }

        if (this.form.get("performedVenue").value) {
            this.performedVenueRef.searchVal1 = this.form.get("performedVenue").value;
            this.performedVenueRef.priority = 0;
            params["venue"] = this.form.get("performedVenue").value;
        } else {
            this.performedVenueRef.searchVal1 = null;
            this.performedVenueRef.priority = 1;
        }

        if (this.form.get("performedActor").value) {
            this.performedActorRef.searchVal1 = this.form.get("performedActor").value;
            this.performedActorRef.priority = 0;
            params["actor"] = this.form.get("performedActor").value;
        } else {
            this.performedActorRef.searchVal1 = null;
            this.performedActorRef.priority = 1;
        }

        if (this.form.get("plays").value) {
            this.genreRef.searchVal1 = this._listService.getIdOfNode(this._ALL_DRAMA);
            params["plays"] = "true";
        } else {
            if (this.form.get("genre").value) {
                this.genreRef.searchVal1 = this.form.get("genre").value;
                this.genreRef.priority = 0;
                params["genre"] = this._listService.getNameOfNode(this.form.get("genre").value);
            } else {
                this.genreRef.searchVal1 = null;
                this.genreRef.priority = 1;
            }
        }

        if (params) {
            this._router.navigate(["search/advanced"], { queryParams: params});
        }
    }

    getHelpText(formControlName: string) {
        switch (formControlName) {
            case ("text"): {
                this.openHelpDialog(this._stringService.getString("text_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("author"): {
                this.openHelpDialog(this._stringService.getString("author_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("bookTitle"): {
                this.openHelpDialog(this._stringService.getString("title_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("lexia"): {
                this.openHelpDialog(this._stringService.getString("lexia_help"), "What is quoted?");
                break;
            }
            case ("createdDate"): {
                this.openHelpDialog(this._stringService.getString("date_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("marking"): {
                this.openHelpDialog(this._stringService.getString("marking_help"), "\"Marking\"");
                break;
            }
            case ("function"): {
                this.openHelpDialog(this._stringService.getString("function_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("performedCompany"): {
                this.openHelpDialog(this._stringService.getString("per_company_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("performedVenue"): {
                this.openHelpDialog(this._stringService.getString("per_venue_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("performedActor"): {
                this.openHelpDialog(this._stringService.getString("per_actor_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("language"): {
                this.openHelpDialog(this._stringService.getString("language_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("genre"): {
                this.openHelpDialog(this._stringService.getString("genre_help"), this._stringService.getString("default_title"));
                break;
            }
            case ("plays"): {
                this.openHelpDialog(this._stringService.getString("plays_help"), this._stringService.getString("default_title"));
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
        // Resets all the values in the structure
        this.textRef.searchVal1 = null;
        this.authorLastNameRef.searchVal1 = null;
        this.bookTitleRef.searchVal1 = null;
        this.genreRef.searchVal1 = null;
        this.lexiaRef.searchVal1 = null;
        this.languageRef.searchVal1 = null;
        this.functionRef.searchVal1 = null;
        this.markingRef.searchVal1 = null;
        this.createdDateRef.searchVal1 = null;
        this.performedCompanyRef.searchVal1 = null;
        this.performedVenueRef.searchVal1 = null;
        this.performedActorRef.searchVal1 = null;
        // Resets the result box
        this.resultBox.reset();
    }

    onChange(toggled) {
        toggled ? this.form.get("genre").disable() : this.form.get("genre").enable();
    }

    openHelpDialog(text: string, title: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = this._DIALOG_WIDTH;
        dialogConfig.data = {
            text,
            title
        };
        this._helpDialog.open(HelpComponent, dialogConfig);
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
