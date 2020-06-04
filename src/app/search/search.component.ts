import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
    selectedSearch: string;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.selectedSearch = "simple-search";
    }

    simple() {
        this.selectedSearch = "simple-search";
    }

    advanced() {
        this.selectedSearch = "advanced-search";
    }

    expert() {
        this.selectedSearch = "expert-search";
    }

    browse() {
        this.selectedSearch = "browsing";
    }

}
