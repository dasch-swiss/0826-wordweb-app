import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: "app-simple-search",
    templateUrl: "./simple-search.component.html",
    styleUrls: ["./simple-search.component.scss"]
})
export class SimpleSearchComponent implements OnInit {
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
            dateCheck: new FormControl(false, []),
            dateStart: new FormControl("", []),
            dateEnd: new FormControl("", [])
        });

        this.form.get("dateEnd").disable();

        this.setDatePlaceholder();
    }

    search() {
        console.log("Searching");
    }

    onChange(event) {
        if (event.checked) {
            this.form.get("dateEnd").enable();
            this.dateStartPlaceholder = "Date Start";
            this.dateEndPlaceholder = "Date End";
        } else {
            this.form.get("dateEnd").disable();
            this.setDatePlaceholder();
        }
    }

    setDatePlaceholder() {
        this.dateStartPlaceholder = "Exact Date";
        this.dateEndPlaceholder = "";
    }

}
