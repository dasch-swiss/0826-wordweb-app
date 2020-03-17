import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Book} from "../../model/model";

@Component({
    selector: "app-simple-search",
    templateUrl: "./simple-search.component.html",
    styleUrls: ["./simple-search.component.scss"]
})
export class SimpleSearchComponent implements OnInit {
    form: FormGroup;
    passages: any;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            searchText: new FormControl("", []),
            author: new FormControl("", []),
            bookTitle: new FormControl("", []),
            genre: new FormControl("", []),
            lexia: new FormControl("", []),
            date: new FormControl("", [])
        });
    }

    search() {
        this.apiService.getPassages(true).subscribe(data => {
            for (const passage of data) {
                this.apiService.getBook((passage.occursIn as Book) .id, true).subscribe(book => {
                    passage.occursIn = book;
                    this.passages = data;
                    console.log(this.passages);
                });
            }
        });
    }

}
