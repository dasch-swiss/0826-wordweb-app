import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
    selectedSearch: string;

    constructor(private router: Router, private route: ActivatedRoute) {
        this.router.events
            .pipe(
                filter(data => data instanceof (NavigationEnd))
            )
            .subscribe(data => {
                this.selectedSearch = this.route.snapshot.firstChild.url[0].path;
        });
    }

    selectSearch(search: any) {
        this.router.navigate([`${search}`], { relativeTo: this.route });
    }

    ngOnInit() {
    }

}
