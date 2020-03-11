import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Book} from "../../model/model";
import {ApiService} from "../../services/api.service";

@Component({
    selector: "app-advanced-search",
    templateUrl: "./advanced-search.component.html",
    styleUrls: ["./advanced-search.component.scss"]
})
export class AdvancedSearchComponent implements OnInit {
    form: FormGroup;
    passages: any;

    operators1 = [
        {value: "-"},
        {value: "NOT"}
    ];

    operators2 = [
        {value: "AND"},
        {value: "NOT"}
    ];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            compText: new FormControl("-", []),
            text: new FormControl("", []),
            compAuthor: new FormControl("AND", []),
            author: new FormControl("", []),
            compBookTitle: new FormControl("AND", []),
            bookTitle: new FormControl("", []),
            compGenre: new FormControl("AND", []),
            genre: new FormControl("", []),
            compLexia: new FormControl("AND", []),
            lexia: new FormControl("", []),
            compSubject: new FormControl("AND", []),
            subject: new FormControl("", []),
            compLanguage: new FormControl("AND", []),
            language: new FormControl("", []),
            compFunction: new FormControl("AND", []),
            function: new FormControl("", []),
            compMarking: new FormControl("AND", []),
            marking: new FormControl("", []),
            compCreatedDate: new FormControl("AND", []),
            createdDate: new FormControl("", []),
            compPerformedDate: new FormControl("AND", []),
            performedDate: new FormControl("", []),
            compPublicationDate: new FormControl("AND", []),
            publicationDate: new FormControl("", []),
        });
    }

    search() {
        this.apiService.getPassages(true).subscribe(data => {
            for (const passage of data) {
                this.apiService.getBook((passage.occursIn as Book).id, true).subscribe(book => {
                    passage.occursIn = book;
                    this.passages = data;
                    console.log(this.passages);
                });
            }
        });
    }

}
