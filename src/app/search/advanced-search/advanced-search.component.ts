import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: "app-advanced-search",
    templateUrl: "./advanced-search.component.html",
    styleUrls: ["./advanced-search.component.scss"]
})
export class AdvancedSearchComponent implements OnInit {
    form: FormGroup;

    operators1 = [
        {value: "-"},
        {value: "NOT"}
    ];

    operators2 = [
        {value: "AND"},
        {value: "NOT"}
    ];

    ngOnInit() {
        this.form = new FormGroup({
            searchText: new FormControl("", []),
            author: new FormControl("", []),
            bookTitle: new FormControl("", []),
            genre: new FormControl("", []),
            lexia: new FormControl("", []),
            createdDateStart: new FormControl("", []),
            performedDateStart: new FormControl("", []),
            publicationDateStart: new FormControl("", []),
        });
    }

    search() {
        console.log("Searching");
    }

}
