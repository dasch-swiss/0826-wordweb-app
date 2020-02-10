import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: "app-advanced-search",
    templateUrl: "./advanced-search.component.html",
    styleUrls: ["./advanced-search.component.scss"]
})
export class AdvancedSearchComponent implements OnInit {
    form: FormGroup;
    dateStartPlaceholder: string;
    dateEndPlaceholder: string;

    ngOnInit() {
        this.form = new FormGroup({
            searchText: new FormControl("", []),
            author: new FormControl("", []),
            bookTitle: new FormControl("", []),
            genre: new FormControl("", []),
            lexia: new FormControl("", []),
            createdDateCheck: new FormControl(false, []),
            createdDateStart: new FormControl("", []),
            createdDateEnd: new FormControl("", []),
            performedDateCheck: new FormControl(false, []),
            performedDateStart: new FormControl("", []),
            performedDateEnd: new FormControl("", []),
            publicationDateCheck: new FormControl(false, []),
            publicationDateStart: new FormControl("", []),
            publicationDateEnd: new FormControl("", [])
        });

        this.form.get("createdDateEnd").disable();
        this.form.get("performedDateEnd").disable();

        this.setDatePlaceholder();
    }

    search() {
        console.log("Searching");
    }

    onChange(event, dateType: string) {

        if (event.checked) {
            this.form.get(`${dateType}End`).enable();
            this.dateStartPlaceholder = "Date Start";
            this.dateEndPlaceholder = "Date End";
        } else {
            this.form.get(`${dateType}End`).disable();
            this.setDatePlaceholder();
        }
    }

    setDatePlaceholder() {
        this.dateStartPlaceholder = "Exact Date";
        this.dateEndPlaceholder = "";
    }

}
