import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    simple() {
        this.router.navigate(["simple-search"]);
    }

    advanced() {
        this.router.navigate(["advanced-search"]);
    }

    expert() {
        this.router.navigate(["expert-search"]);
    }

    browse() {
        this.router.navigate(["browsing"]);
    }

}
