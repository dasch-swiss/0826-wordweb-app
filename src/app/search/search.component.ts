import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
    selectedSearch: string;

    constructor() {}

    selectSearch(search: string) {
        this.selectedSearch = search;
    }

    ngOnInit() {
        this.selectedSearch = "simple";
    }

}
