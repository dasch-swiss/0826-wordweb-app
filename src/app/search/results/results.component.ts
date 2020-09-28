import {Component, OnInit} from "@angular/core";
import {IMainClass} from "../../model/displayModel";
import {NgxSpinnerService} from "ngx-spinner";
import {forkJoin, Observable} from "rxjs";
import {KnoraService} from "../../services/knora.service";
import {ListService} from "../../services/list.service";

@Component({
    selector: "app-results",
    templateUrl: "./results.component.html",
    styleUrls: ["./results.component.scss"]
})
export class ResultsComponent implements OnInit {
    structure: IMainClass;

    nPassages: Observable<number>;
    passages: Array<any>;
    detailPassages = {};
    sortOrder: string;

    searchStarted = false;
    detailStarted = false;
    errorObject = null;
    priority = 0;

    constructor(
        private spinner: NgxSpinnerService,
        public listService: ListService,
        private knoraService: KnoraService) {
    }

    ngOnInit() {
        this.sortOrder = "Title";
    }

    public search(structure, priority = this.priority) {
        console.log(structure);
        this.structure = structure;

        this.spinner.show("spinner-big", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            type: "ball-spin-clockwise",
            size: "medium"
        });

        this.passages = null;
        this.errorObject = null;
        this.searchStarted = true;

        this.nPassages = this.knoraService.gravsearchQueryCount(this.structure, priority);

        this.knoraService.gravseachQuery(this.structure, priority)
            .subscribe(data => {
                console.log(data);
                this.passages = data.map(passage => {
                    passage.expanded = false;
                    passage.original = false;
                    return passage;
                });
                this.sortResults();
                console.log(this.passages);
                this.searchStarted = false;
                this.spinner.hide("spinner-big");
            }, error => {
                this.errorObject = error;
                this.searchStarted = false;
                this.spinner.hide("spinner-big");
            });
    }

    public reset() {
        this.passages = null;
        this.structure = null;
        this.errorObject = null;
        this.nPassages = null;
        this.searchStarted = false;
        this.sortOrder = "Title";
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

        this.knoraService.gravseachQuery(this.structure, this.priority, offset)
            .subscribe(data => {
                console.log(data);
                this.passages.push(...data);
                this.sortResults();
                this.spinner.hide("spinner-small");
                this.searchStarted = false;
            }, error => {
                this.errorObject = error;
                this.spinner.hide("spinner-small");
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
        this.spinner.show(`spinner-${passage.id}`, {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            type: "ball-spin-clockwise",
            size: "small"
        });

        const detailStructure = JSON.parse(JSON.stringify(this.structure));
        detailStructure.iri = passage.id;

        if (!this.detailPassages[passage.id]) {
            this.knoraService.getPassageRes(passage.id)
                .subscribe((data: any) => {
                    const a = forkJoin<any>(data.occursIn.map(item => this.knoraService.getPassageRes(item.id)));
                    const b = forkJoin<any>(data.isMentionedIn.map(item => this.knoraService.getPassageRes(item.id)));
                    const c = forkJoin<any>(data.wasContributedBy.map(item => this.knoraService.getPassageRes(item.id)));
                    const d = forkJoin<any>(data.contains.map(item => this.knoraService.getPassageRes(item.id)));

                    forkJoin<any>(a, b, c, d)
                        .subscribe(([resA, resB, resC, resD]) => {
                            resA.map(book => {
                                forkJoin<any>(book.isWrittenBy.map(item => this.knoraService.getPassageRes(item.id)))
                                    .subscribe(authors => {
                                        book.isWrittenBy = authors;
                                        data.occursIn = resA;

                                        resB.map(sPassage => {
                                            forkJoin<any>(sPassage.occursIn.map(item => this.knoraService.getPassageRes(item.id)))
                                                .subscribe(sBooks => {
                                                    sBooks.map((sBook: any) => {
                                                        forkJoin<any>(sBook.isWrittenBy.map(item => this.knoraService.getPassageRes(item.id)))
                                                            .subscribe(sAuthors => {
                                                                sBook.isWrittenBy = sAuthors;
                                                                sPassage.occursIn = sBooks;
                                                                data.isMentionedIn = resB;

                                                                data.wasContributedBy = resC;
                                                                data.contains = resD;
                                                                console.log(data);

                                                                this.detailPassages[passage.id] = data;
                                                                this.detailStarted = false;
                                                                this.spinner.hide(`spinner-${passage.id}`);
                                                            }, error => {
                                                                // TODO Different error concept reporting
                                                                this.detailStarted = false;
                                                                this.spinner.hide(`spinner-${passage.id}`);
                                                            });
                                                    });
                                                }, error => {
                                                    // TODO Different error concept reporting
                                                    this.detailStarted = false;
                                                    this.spinner.hide(`spinner-${passage.id}`);
                                                });
                                        });
                                    });
                            });
                        }, error => {
                        // TODO Different error concept reporting
                        this.detailStarted = false;
                        this.spinner.hide(`spinner-${passage.id}`);
                    });

                    // forkJoin<any>(a, b, c, d)
                    //     .subscribe(([resA, resB, resC, resD]) => {
                    //
                    //         resA.map(book => {
                    //             forkJoin<any>(book.isWrittenBy.map(item => this.knoraService.getPassageRes(item.id)))
                    //                 .subscribe(authors => {
                    //                     book.isWrittenBy = authors;
                    //                     data.occursIn = resA;
                    //                     console.log("After 2", data);
                    //                 });
                    //         });
                    //
                    //         resB.map(sPassage => {
                    //             forkJoin<any>(sPassage.occursIn.map(item => this.knoraService.getPassageRes(item.id)))
                    //                 .subscribe(sBooks => {
                    //                     sBooks.map(sBook => {
                    //                         forkJoin<any>(sBook.isWrittenBy.map(item => this.knoraService.getPassageRes(item.id)))
                    //                             .subscribe(sAuthors => {
                    //                                 sBook.isWrittenBy = sAuthors;
                    //                                 sPassage.occursIn = sBooks;
                    //                                 data.isMentionedIn = resB;
                    //                                 console.log("After 3", data);
                    //                             });
                    //                     });
                    //                 });
                    //         });
                    //
                    //         data.wasContributedBy = resC;
                    //         data.contains = resD;
                    //         console.log("End", data);
                    //
                    //     });
                }, error => {
                    // TODO Different error concept reporting
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
        return passage.original ? "Show normalized spelling" : "Show original spelling";
    }

    sortResults() {
        if (this.sortOrder === "Title") {
            this.passages
                .sort((p1, p2) => this.sortTitle(p1, p2));
        } else if (this.sortOrder === "Author") {
            this.passages
                .sort((p1, p2) => this.sortAuthor(p1, p2));
        } else if (this.sortOrder === "Date") {
            this.passages
                .sort((p1, p2) => this.sortDate(p1, p2));
        }
    }

    sortTitle(passage1, passage2): number {
        const bookTitle1 = passage1.hasDisplayedTitle[0].value.toUpperCase();
        const bookTitle2 = passage2.hasDisplayedTitle[0].value.toUpperCase();

        if (bookTitle1 === bookTitle2) {
            // TODO Specify here
            return 0;
        }

        return bookTitle1 < bookTitle2 ? -1 : 1;
    }

    sortAuthor(passage1, passage2): number {
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

    sortDate(passage1, passage2): number {
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
}
