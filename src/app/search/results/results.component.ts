import {Component, Input, OnInit} from "@angular/core";
import {IMainClass} from "../../model/displayModel";
import {NgxSpinnerService} from "ngx-spinner";
import {Observable} from "rxjs";
import {KnoraService} from "../../services/knora.service";

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

    searchStarted = false;
    detailStarted = false;
    errorObject = null;
    priority = 0;

    constructor(
        private spinner: NgxSpinnerService,
        private knoraService: KnoraService) {
    }

    ngOnInit() {
    }

    search(structure) {
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

        this.nPassages = this.knoraService.graveSearchQueryCount(this.structure, this.priority);

        this.knoraService.graveSeachQuery(this.structure, this.priority)
            .subscribe(data => {
                console.log(data);
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

        this.knoraService.graveSeachQuery(this.structure, this.priority, offset)
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
                .subscribe(data => {
                    // this.detailPassages[passage.id] = data[0];
                    console.log("After", data);
                    this.detailStarted = false;
                    this.spinner.hide(`spinner-${passage.id}`);
                }, error => {
                    // TODO Different error concept reporting
                    this.detailStarted = false;
                    this.spinner.hide(`spinner-${passage.id}`);
                });
        }

        // if (!this.detailPassages[passage.id]) {
        //     this.knoraService.graveSeachQuery(detailStructure, 1)
        //         .subscribe(data => {
        //             this.detailPassages[passage.id] = data[0];
        //             console.log("DEtail", data);
        //             this.detailStarted = false;
        //             this.spinner.hide(`spinner-${passage.id}`);
        //         }, error => {
        //             // TODO Different error concept reporting
        //             this.detailStarted = false;
        //             this.spinner.hide(`spinner-${passage.id}`);
        //         });
        // }
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

    setOrder($event) {
        if ($event.value === "Title") {
            this.passages.sort((a, b) => {
                return a.occursIn[0].hasBookTitle[0].value < b.occursIn[0].hasBookTitle[0].value ? -1 : 1;
            });
        }
    }

}
