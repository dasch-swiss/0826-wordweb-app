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
        console.log("Searching");
        console.log(this.form.get("compText").value);
    }

}
