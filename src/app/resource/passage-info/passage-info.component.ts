import {Component, Input, OnInit} from "@angular/core";
import {KnoraService} from "../../services/knora.service";
import {ListService} from "../../services/list.service";
import {forkJoin, from, of} from "rxjs";
import {map, mergeMap, toArray, delay} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: "app-passage-info",
    templateUrl: "./passage-info.component.html",
    styleUrls: ["./passage-info.component.scss"]
})
export class PassageInfoComponent implements OnInit {
    @Input() passage: any;
    passageData: any;

    constructor(private knoraService: KnoraService, public listService: ListService, private spinner: NgxSpinnerService) {
        this.spinner.show("spinner", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            type: "ball-spin-clockwise",
            size: "medium"
        });
    }

    ngOnInit(): void {
        of(this.passage)
            .pipe(
                // Requests the contributor
                mergeMap((pass: any) => forkJoin([of(pass), from(pass.wasContributedBy)
                        .pipe(
                            mergeMap((contributor: any) => this.knoraService.getPassageRes(contributor.id)),
                            toArray())]
                    )
                ),
                // Requests all the lexias contained in the passage
                mergeMap(([pass, contributors]) => forkJoin([of(pass), of(contributors), from(pass.contains)
                    .pipe(
                        mergeMap((lexia: any) => this.knoraService.getPassageRes(lexia.id)),
                        toArray()
                    )])
                ),
                // Requests the book in which the passage occurs in
                mergeMap(([pass, contributors, lexias]) => forkJoin([of(pass), of(contributors), of(lexias), from(pass.occursIn)
                    .pipe(
                        mergeMap((book: any) => this.knoraService.getPassageRes(book.id)),
                        // Requests the authors of the book
                        mergeMap((book: any) => forkJoin([of(book), from(book.isWrittenBy)
                            .pipe(
                                mergeMap((author: any) => this.knoraService.getPassageRes(author.id)),
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
                            mergeMap((sPassage: any) => this.knoraService.getPassageRes(sPassage.id)),
                            mergeMap((sPassage: any) => forkJoin([of(sPassage), from(sPassage.occursIn)
                                .pipe(
                                    mergeMap((sBook: any) => this.knoraService.getPassageRes(sBook.id)),
                                    mergeMap((sBook: any) => forkJoin([of(sBook), from(sBook.isWrittenBy)
                                        .pipe(
                                            mergeMap((author: any) => this.knoraService.getPassageRes(author.id)),
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
                            console.log("All details: ", data);
                            this.passageData = data;
                            // this.detailStarted = false;
                            this.spinner.hide(`spinner`);
                        });
                } else {
                    console.log("All details: ", data);
                    this.passageData = data;
                    // this.detailStarted = false;
                    this.spinner.hide(`spinner`);
                }
            });
    }

}
