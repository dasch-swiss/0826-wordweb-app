import {Component, OnInit} from "@angular/core";
import {IMainClass} from "../../model/displayModel";
import {NgxSpinnerService} from "ngx-spinner";
import {forkJoin, Observable, from, of} from "rxjs";
import {mergeMap, toArray, map} from "rxjs/operators";
import {KnoraService} from "../../services/knora.service";
import {ListService} from "../../services/list.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";

@Component({
    selector: "app-results",
    templateUrl: "./results.component.html",
    styleUrls: ["./results.component.scss"]
})
export class ResultsComponent implements OnInit {
    readonly PRIORITY = 0;
    readonly MAX_RESOURCE_PER_RESULT = 25;

    structure: IMainClass;
    form: UntypedFormGroup;

    nPassages: Observable<number>;
    passages: Array<any>;
    detailPassages = {};
    sortOrders = [];

    searchStarted = false;
    detailStarted = false;
    errorObject = null;

    static sortTitleAZ(passage1, passage2): number {
        const bookTitle1 = passage1.hasDisplayedTitle[0].value.toUpperCase();
        const bookTitle2 = passage2.hasDisplayedTitle[0].value.toUpperCase();

        if (bookTitle1 === bookTitle2) {
            // TODO Specify here
            return 0;
        }

        return bookTitle1 < bookTitle2 ? -1 : 1;
    }

    static sortTitleZA(passage1, passage2): number {
        const bookTitle1 = passage1.hasDisplayedTitle[0].value.toUpperCase();
        const bookTitle2 = passage2.hasDisplayedTitle[0].value.toUpperCase();

        if (bookTitle1 === bookTitle2) {
            // TODO Specify here
            return 0;
        }

        return bookTitle1 > bookTitle2 ? -1 : 1;
    }

    static sortAuthorAZ(passage1, passage2): number {
        const authorName1 = passage1.occursIn[0].isWrittenBy[0].hasLastName[0].value.toUpperCase();
        const authorName2 = passage2.occursIn[0].isWrittenBy[0].hasLastName[0].value.toUpperCase();

        if (authorName1 === authorName2) {
            const date1 = passage1.occursIn[0].hasCreationDate[0].start;
            const date2 = passage2.occursIn[0].hasCreationDate[0].start;

            if (date1 === date2) {
                const bookTitle1 = passage1.hasDisplayedTitle[0].value.toUpperCase();
                const bookTitle2 = passage2.hasDisplayedTitle[0].value.toUpperCase();

                return bookTitle1 < bookTitle2 ? -1 : (bookTitle1 > bookTitle2 ? 1 : 0);
            }

            return date1 < date2 ? -1 : 1;
        }

        return authorName1 < authorName2 ? -1 : 1;
    }

    static sortAuthorZA(passage1, passage2): number {
        const authorName1 = passage1.occursIn[0].isWrittenBy[0].hasLastName[0].value.toUpperCase();
        const authorName2 = passage2.occursIn[0].isWrittenBy[0].hasLastName[0].value.toUpperCase();

        if (authorName1 === authorName2) {
            const date1 = passage1.occursIn[0].hasCreationDate[0].start;
            const date2 = passage2.occursIn[0].hasCreationDate[0].start;

            if (date1 === date2) {
                const bookTitle1 = passage1.hasDisplayedTitle[0].value.toUpperCase();
                const bookTitle2 = passage2.hasDisplayedTitle[0].value.toUpperCase();

                return bookTitle1 < bookTitle2 ? -1 : (bookTitle1 > bookTitle2 ? 1 : 0);
            }

            return date1 < date2 ? -1 : 1;
        }

        return authorName1 > authorName2 ? -1 : 1;
    }

    static sortDateOld(passage1, passage2): number {
        const date1 = passage1.occursIn[0].hasCreationDate[0].start;
        const date2 = passage2.occursIn[0].hasCreationDate[0].start;

        if (date1 === date2) {
            const authorName1 = passage1.occursIn[0].isWrittenBy[0].hasLastName[0].value.toUpperCase();
            const authorName2 = passage2.occursIn[0].isWrittenBy[0].hasLastName[0].value.toUpperCase();

            if (authorName1 === authorName2) {
                const bookTitle1 = passage1.hasDisplayedTitle[0].value.toUpperCase();
                const bookTitle2 = passage2.hasDisplayedTitle[0].value.toUpperCase();

                return bookTitle1 < bookTitle2 ? -1 : (bookTitle1 > bookTitle2 ? 1 : 0);
            }

            return authorName1 < authorName2 ? -1 : 1;
        }

        return date1 < date2 ? -1 : 1;
    }

    static sortDateLate(passage1, passage2): number {
        const date1 = passage1.occursIn[0].hasCreationDate[0].start;
        const date2 = passage2.occursIn[0].hasCreationDate[0].start;

        if (date1 === date2) {
            const authorName1 = passage1.occursIn[0].isWrittenBy[0].hasLastName[0].value.toUpperCase();
            const authorName2 = passage2.occursIn[0].isWrittenBy[0].hasLastName[0].value.toUpperCase();

            if (authorName1 === authorName2) {
                const bookTitle1 = passage1.hasDisplayedTitle[0].value.toUpperCase();
                const bookTitle2 = passage2.hasDisplayedTitle[0].value.toUpperCase();

                return bookTitle1 < bookTitle2 ? -1 : (bookTitle1 > bookTitle2 ? 1 : 0);
            }

            return authorName1 < authorName2 ? -1 : 1;
        }

        return date1 > date2 ? -1 : 1;
    }

    constructor(
        public listService: ListService,
        private _spinner: NgxSpinnerService,
        public _knoraService: KnoraService,
        private _clipBoard: Clipboard,
        private _snackBar: MatSnackBar) {
    }

    ngOnInit() {
        // Sorting object with possible sort orders
        this.sortOrders = [
            {
                name: "Title: A-Z",
                sort: ResultsComponent.sortTitleAZ
            },
            {
                name: "Title: Z-A",
                sort: ResultsComponent.sortTitleZA
            },
            {
                name: "Author: A-Z",
                sort: ResultsComponent.sortAuthorAZ
            },
            {
                name: "Author: Z-A",
                sort: ResultsComponent.sortAuthorZA
            },
            {
                name: "Date: Oldest",
                sort: ResultsComponent.sortDateOld
            },
            {
                name: "Date: Latest",
                sort: ResultsComponent.sortDateLate
            }
        ];
        // Form for sorting
        this.form = new UntypedFormGroup({
            sorting: new UntypedFormControl("Date: Oldest", [])
        });
    }

    search(structure, priority = this.PRIORITY) {
        // Returns if a search is already going on
        if (this.searchStarted) {
            return;
        }

        this.structure = structure;
        this.passages = null;

        this._spinner.show("spinner-big", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            size: "medium"
        });

        this.errorObject = null;
        this.searchStarted = true;

        this.nPassages = this._knoraService.gravsearchQueryCount(this.structure, priority);

        this._knoraService.gravseachQuery(this.structure, priority)
            .subscribe(data => {
                this.passages = data.map(passage => {
                    passage.expanded = false;
                    passage.original = false;
                    passage.occursIn[0].isWrittenBy = passage.occursIn[0].isWrittenBy
                        .sort((author1, author2) => author1.hasLastName[0].value < author2.hasLastName[0].value ? -1 : (author1.hasLastName[0].value > author2.hasLastName[0].value ? 1 : 0));
                    return passage;
                });
                this.sortResults(this.form.get("sorting").value);
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            }, error => {
                this.errorObject = error;
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            });
    }

    reset() {
        this.passages = null;
        this.structure = null;
        this.errorObject = null;
        this.nPassages = null;
        this.searchStarted = false;
        this.form.get("sorting").setValue("Date: Oldest");
    }

    loadMoreResults() {
        this._spinner.show("spinner-small", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            size: "small"
        });

        this.errorObject = null;
        this.searchStarted = true;

        const offset = Math.floor(this.passages.length / this.MAX_RESOURCE_PER_RESULT);

        this._knoraService.gravseachQuery(this.structure, this.PRIORITY, offset)
            .subscribe(data => {
                const passageData = data.map(passage => {
                    passage.expanded = false;
                    passage.original = false;
                    passage.occursIn[0].isWrittenBy = passage.occursIn[0].isWrittenBy
                        .sort((author1, author2) => author1.hasLastName[0].value < author2.hasLastName[0].value ? -1 : (author1.hasLastName[0].value > author2.hasLastName[0].value ? 1 : 0));
                    return passage;
                });
                this.passages.push(...passageData);
                this.sortResults(this.form.get("sorting").value);
                this._spinner.hide("spinner-small");
                this.searchStarted = false;
            }, error => {
                this.errorObject = error;
                this._spinner.hide("spinner-small");
                this.searchStarted = false;
            });
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

        this._spinner.show(`spinner-${passage.id}`, {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            size: "small"
        });

        const detailStructure = JSON.parse(JSON.stringify(this.structure));
        detailStructure.iri = passage.id;

        if (!this.detailPassages[passage.id]) {

            this._knoraService.getPassageRes(passage.id)
                .pipe(
                    // Requests the contributor
                    mergeMap((pass: any) => forkJoin([of(pass), from(pass.wasContributedBy)
                            .pipe(
                                mergeMap((contributor: any) => this._knoraService.getPassageRes(contributor.id)),
                                toArray())]
                        )
                    ),
                    // Requests all the lexias contained in the passage
                    mergeMap(([pass, contributors]) => forkJoin([of(pass), of(contributors), from(pass.contains)
                        .pipe(
                            mergeMap((lexia: any) => this._knoraService.getPassageRes(lexia.id)),
                            toArray()
                        )])
                    ),
                    // Requests the book in which the passage occurs in
                    mergeMap(([pass, contributors, lexias]) => forkJoin([of(pass), of(contributors), of(lexias), from(pass.occursIn)
                        .pipe(
                            mergeMap((book: any) => this._knoraService.getPassageRes(book.id)),
                            // Check if book has performedIn and requests the venues
                            mergeMap((book: any) => {
                                if (book.performedIn) {
                                    return forkJoin([of(book), from(book.performedIn)
                                        .pipe(
                                            mergeMap((venue: any) => this._knoraService.getPassageRes(venue.id)),
                                            toArray()
                                        )]);
                                } else {
                                    return forkJoin([of(book), of("empty")]);
                                }
                            }),
                            map(([book, venues]) => {
                                if (venues !== "empty") {
                                    book.performedIn = venues;
                                }
                                return book;
                            }),
                            // Checks if book has performedBy and requests the companies
                            mergeMap((book: any) => {
                                if (book.performedBy) {
                                    return forkJoin([of(book), from(book.performedBy)
                                        .pipe(mergeMap((company: any) => this._knoraService.getPassageRes(company.id)), toArray())]);
                                } else {
                                    return forkJoin([of(book), of("empty")]);
                                }
                            }),
                            map(([book, companies]) => {
                                if (companies !== "empty") {
                                    book.performedBy = companies;
                                }
                                return book;
                            }),
                            // Checks if book has performedByActors and requests the actors (=persons)
                            mergeMap((book: any) => {
                                if (book.performedByActor) {
                                    return forkJoin([of(book), from(book.performedByActor)
                                        .pipe(mergeMap((actor: any) => this._knoraService.getPassageRes(actor.id)), toArray())]);
                                } else {
                                    return forkJoin([of(book), of("empty")]);
                                }
                            }),
                            map(([book, actors]) => {
                                if (actors !== "empty") {
                                    book.performedByActor = actors;
                                }
                                return book;
                            }),
                            // Requests the authors of the book
                            mergeMap((book: any) => forkJoin([of(book), from(book.isWrittenBy)
                                .pipe(
                                    mergeMap((author: any) => this._knoraService.getPassageRes(author.id)),
                                    toArray()
                                )])
                            ),
                            map(([book, authors]) => {
                                book.isWrittenBy = authors;
                                return book;
                            }),
                            toArray()
                        )])
                    ),
                    map(([pass, contributors, lexias, books]) => {
                        pass.wasContributedBy = contributors;
                        pass.contains = lexias;
                        pass.occursIn = books;
                        return pass;
                    })
                )
                .subscribe((data: any) => {
                    // Checks if the passages was mentioned somewhere. If yes, all the secondary data will be requested
                    if (data.isMentionedIn) {
                        from(data.isMentionedIn)
                            .pipe(
                                mergeMap((sPassage: any) => this._knoraService.getPassageRes(sPassage.id)),
                                mergeMap((sPassage: any) => forkJoin([of(sPassage), from(sPassage.occursIn)
                                    .pipe(
                                        mergeMap((sBook: any) => this._knoraService.getPassageRes(sBook.id)),
                                        mergeMap((sBook: any) => forkJoin([of(sBook), from(sBook.isWrittenBy)
                                            .pipe(
                                                mergeMap((author: any) => this._knoraService.getPassageRes(author.id)),
                                                toArray()
                                            )
                                        ])),
                                        map(([sBook, sAuthors]) => {
                                            sBook.isWrittenBy = sAuthors;
                                            return sBook;
                                        }),
                                        toArray()
                                    )])
                                ),
                                map(([sPassage, sBooks]) => {
                                    sPassage.occursIn = sBooks;
                                    return sPassage;
                                }),
                                toArray()
                            )
                            .subscribe(extraData => {
                                data.isMentionedIn = extraData;

                                this.detailPassages[passage.id] = data;
                                this.detailStarted = false;
                                this._spinner.hide(`spinner-${passage.id}`);
                            });
                    } else {
                        this.detailPassages[passage.id] = data;
                        this.detailStarted = false;
                        this._spinner.hide(`spinner-${passage.id}`);
                    }

                }, error => {
                    // TODO Different error concept reporting
                    this.detailStarted = false;
                    this._spinner.hide(`spinner-${passage.id}`);
                });

        }
    }

    expandBtnText(passage: any): string {
        return passage.expanded ? "Hide" : "Show more";
    }

    originalOrNormalized(passage: any) {
        passage.original = !passage.original;
    }

    spellingBtnText(passage: any): string {
        return passage.original ? "Show normalized spelling" : "Show original spelling";
    }

    sortResults(event) {
        for (const sortOrder of this.sortOrders) {
            if (event === sortOrder.name) {
                this.passages
                    .sort((p1, p2) => sortOrder.sort(p1, p2));
                return;
            }
        }
    }

    copyClipboard(ark: string) {
        this._clipBoard.copy(ark);
        this._snackBar.open("ARK was copied to clipboard");
    }

    openArk(arkUrl: string) {
        window.open(arkUrl, "_blank");
        return false;
    }
}
