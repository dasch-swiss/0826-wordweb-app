import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {KnoraService} from "../../services/knora.service";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {ResultsComponent} from "../results/results.component";
import {forkJoin, of} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: "app-browsing",
    templateUrl: "./browsing.component.html",
    styleUrls: ["./browsing.component.scss"]
})
export class BrowsingComponent implements OnInit, AfterViewInit {
    @ViewChild("results") resultBox: ResultsComponent;

    readonly MAX_RESOURCE_PER_RESULT = 25;

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

    authorRef: IDisplayedProperty = this.myPassage.props[12].res.props[9];
    lexiaRef: IDisplayedProperty = this.myPassage.props[15];
    bookRef: IDisplayedProperty = this.myPassage.props[12];

    books = {};
    authors = {};
    lexias = {};

    alphabeticResources: Array<any>;
    alphabeticResAmount: number;

    alphabeticSearchStarted = false;
    errorObject = null;
    chars: Array<string> = [];

    resTypeSelected: string;
    charSelected: string;
    listElSelected: string;

    constructor(private _knoraService: KnoraService,
                private _spinner: NgxSpinnerService,
                private _router: Router,
                private _route: ActivatedRoute,
                private _cdr: ChangeDetectorRef) {
    }

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

    static checkResType(res: string): boolean {
        return (res === "book" || res === "author" || res === "lexia");
    }

    static checkLetter(char: string): boolean {
        return /^[a-zA-Z]$/.test(char);
    }

    ngOnInit() {
        // Preparation for caching and alphabetic menu
        for (const letter of BrowsingComponent.getCharacterRange()) {
            this.books[letter] = null;
            this.authors[letter] = null;
            this.lexias[letter] = null;
            this.chars.push(letter);
        }
    }

    ngAfterViewInit() {
        this._route.queryParams
            .subscribe(data => {
                if (data.res && BrowsingComponent.checkResType(data.res)) {
                    this.resTypeSelected = data.res;

                    if (data.letter && BrowsingComponent.checkLetter(data.letter)) {
                        this.charSelected = data.letter;
                        this.requestResources();

                        if (data.id) {
                            this.listElSelected = data.id;
                            this.selectDetail();
                        }
                    }

                } else {
                    this._router.navigate(["search/browsing"], {queryParams: {res: "book"}});
                }
            });

        this._cdr.detectChanges();
    }

    requestResources() {
        this.alphabeticSearchStarted = true;
        this._spinner.show(`spinner-${this.charSelected}`, {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            size: "small"
        });

        if (this.resTypeSelected === "author") {
            this.requestAuthors();

        } else if (this.resTypeSelected === "book") {
            this.requestBooks();

        } else if (this.resTypeSelected === "lexia") {
            this.requestLexias();
        }
    }

    requestBooks() {
        if (!this.books[this.charSelected]) {
            this._knoraService.getPrimaryBooksCount(this.charSelected)
                .pipe(
                    mergeMap(amount => {
                        if (amount === 0) {
                            return forkJoin([of(0)]);
                        }

                        const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);
                        const requests = [];

                        for (let offset = 0; offset < maxOffset; offset++) {
                            requests.push(this._knoraService.getPrimaryBooks(this.charSelected, offset));
                        }

                        return forkJoin([of(amount), forkJoin(requests)]);
                    })
                )
                .subscribe(result => {
                    this.alphabeticResAmount = result[0];
                    this.books[this.charSelected] = {amount: result[0]};
                    this._spinner.hide(`spinner-${this.charSelected}`);
                    this.alphabeticSearchStarted = false;

                    if (result[1]) {
                        this.alphabeticResources = []
                            .concat(...result[1])
                            .sort((book1, book2) => this.sortBook(book1, book2));
                        this.books[this.charSelected].data = this.alphabeticResources;
                    }
                }, error => {
                    this._spinner.hide(`spinner-${this.charSelected}`);
                });
        } else {
            this._spinner.hide(`spinner-${this.charSelected}`);
            this.alphabeticSearchStarted = false;
            // Gets data from cache
            this.alphabeticResources = this.books[this.charSelected].data;
            this.alphabeticResAmount = this.books[this.charSelected].amount;
        }
    }

    requestAuthors() {
        if (!this.authors[this.charSelected]) {
            this._knoraService.getPrimaryAuthorsCount(this.charSelected)
                .pipe(
                    mergeMap(amount => {
                        if (amount === 0) {
                            return forkJoin([of(0)]);
                        }

                        const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);
                        const requests = [];

                        for (let offset = 0; offset < maxOffset; offset++) {
                            requests.push(this._knoraService.getPrimaryAuthors(this.charSelected, offset));
                        }

                        return forkJoin([of(amount), forkJoin(requests)]);
                    })
                )
                .subscribe(result => {
                    this.alphabeticResAmount = result[0];
                    this.authors[this.charSelected] = {amount: result[0]};
                    this._spinner.hide(`spinner-${this.charSelected}`);
                    this.alphabeticSearchStarted = false;

                    if (result[1]) {
                        this.alphabeticResources = []
                            .concat(...result[1])
                            .sort((author1, author2) => this.sortAuthor(author1, author2));
                        this.authors[this.charSelected].data = this.alphabeticResources;
                    }
                }, error => {
                    this._spinner.hide(`spinner-${this.charSelected}`);
                });
        } else {
            this._spinner.hide(`spinner-${this.charSelected}`);
            this.alphabeticSearchStarted = false;
            // Gets data from cache
            this.alphabeticResources = this.authors[this.charSelected].data;
            this.alphabeticResAmount = this.authors[this.charSelected].amount;
        }
    }

    requestLexias() {
        if (!this.lexias[this.charSelected]) {
            this._knoraService.getLexiasCount(this.charSelected)
                .pipe(
                    mergeMap(amount => {
                        if (amount === 0) {
                            return forkJoin([of(0)]);
                        }

                        const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);
                        const requests = [];

                        for (let offset = 0; offset < maxOffset; offset++) {
                            requests.push(this._knoraService.getLexias(this.charSelected, offset));
                        }

                        return forkJoin([of(amount), forkJoin(requests)]);
                    })
                )
                .subscribe(result => {
                    this.alphabeticResAmount = result[0];
                    this.lexias[this.charSelected] = {amount: result[0]};
                    this._spinner.hide(`spinner-${this.charSelected}`);
                    this.alphabeticSearchStarted = false;

                    if (result[1]) {
                        this.alphabeticResources = []
                            .concat(...result[1])
                            .sort((lexia1, lexia2) => this.sortLexia(lexia1, lexia2));
                        this.lexias[this.charSelected].data = this.alphabeticResources;
                    }
                }, error => {
                    this._spinner.hide(`spinner-${this.charSelected}`);
                });
        } else {
            this._spinner.hide(`spinner-${this.charSelected}`);
            this.alphabeticSearchStarted = false;
            // Gets data from cache
            this.alphabeticResources = this.lexias[this.charSelected].data;
            this.alphabeticResAmount = this.lexias[this.charSelected].amount;
        }
    }

    sortBook(book1, book2): number {
        const bookTitle1 = book1.hasBookTitle[0].value.toUpperCase();
        const bookTitle2 = book2.hasBookTitle[0].value.toUpperCase();

        return bookTitle1 <= bookTitle2 ? (bookTitle1 === bookTitle2 ? 0 : -1) : 1;
    }

    sortAuthor(author1, author2): number {
        const authorName1 = author1.hasLastName[0].value.toUpperCase();
        const authorName2 = author2.hasLastName[0].value.toUpperCase();

        return authorName1 <= authorName2 ? (authorName1 === authorName2 ? 0 : -1) : 1;
    }

    sortLexia(lexia1, lexia2): number {
        const lexTitle1 = lexia1.hasLexiaTitle[0].value.toUpperCase();
        const lexTitle2 = lexia2.hasLexiaTitle[0].value.toUpperCase();

        return lexTitle1 <= lexTitle2 ? (lexia1 === lexia2 ? 0 : -1) : 1;
    }

    selectResType(name: string) {
        if (this.alphabeticSearchStarted) {
            return;
        }

        // Clears the results from previous search
        if (this.resTypeSelected !== name) {
            this.resTypeSelected = name;
            this.charSelected = null;
            this.alphabeticResources = null;
            this.resultBox.reset();
            this._router.navigate(["search/browsing"], { queryParams: {res: name}});
        }
    }

    selectChar(event) {
        this.resultBox.reset();
        this._router.navigate(["search/browsing"], { queryParams: {letter: event, res: this.resTypeSelected}});
    }

    getListName(alphaRes: any): string {
        switch (this.resTypeSelected) {
            case "author": {
                return (alphaRes.hasFirstName && alphaRes.hasFirstName[0].value !== "_") ? `${alphaRes.hasLastName[0].value}, ${alphaRes.hasFirstName[0].value}` : alphaRes.hasLastName[0].value;
            }
            case "book": {
                return alphaRes.hasPrefixBookTitle ? `${alphaRes.hasPrefixBookTitle[0].value} ${alphaRes.hasBookTitle[0].value}` : `${alphaRes.hasBookTitle[0].value}`;
            }
            case "lexia": {
                return alphaRes.hasLexiaTitle[0].value;
            }

        }
    }

    selectFromList(resID: any) {
        this._router.navigate(["search/browsing"], { queryParams: {id: resID}, queryParamsHandling : "merge"});
    }

    selectDetail() {
        if (this.resTypeSelected === "author") {
            this.authorRef.searchVal1 = this.listElSelected;
            this.bookRef.searchVal1 = null;
            this.lexiaRef.searchVal1 = null;

        } else if (this.resTypeSelected === "book") {
            this.bookRef.searchVal1 = this.listElSelected;
            this.authorRef.searchVal1 = null;
            this.lexiaRef.searchVal1 = null;

        } else if (this.resTypeSelected === "lexia") {
            this.lexiaRef.searchVal1 = this.listElSelected;
            this.bookRef.searchVal1 = null;
            this.authorRef.searchVal1 = null;
        }

        this.resultBox.search(this.myPassage);
    }

}
