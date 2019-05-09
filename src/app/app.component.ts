import {Component, OnInit} from "@angular/core";
import {ApiService, Author, Book, Edition, EditionOriginal, PassageOriginal} from "./api.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    bookList: Book[];
    passageList: any[];
    authorList: Author[];
    editionList: Edition[];
    editionOriginalList: EditionOriginal[];
    passageOriginalList: PassageOriginal[];

    list: string;

    constructor(private apiService: ApiService) {
        this.bookList = apiService.getBooks();
    }

    ngOnInit() {
    }

    showBooks() {
        this.list = "book";
        this.bookList = this.apiService.getBooks();
    }

    showAuthors() {
        this.list = "author";
        this.authorList = this.apiService.getAuthors();
    }

    showEditions() {
        this.list = "edition";
        this.editionList = this.apiService.getEditions();
    }

    showPassages() {
        this.list = "passage";
        this.passageList = this.apiService.getPassages().map(passage => {
            passage["collapsed"] = false;
            return passage;
        });
    }

    showEditionsOriginal() {
        this.list = "editionOriginal";
        this.editionOriginalList = this.apiService.getEditionsOriginal().map(editionOriginal => {
            editionOriginal["collapsed"] = false;
            return editionOriginal;
        });
    }

    showPassagesOriginal() {
        this.list = "passageOriginal";
        this.passageOriginalList = this.apiService.getPassagesOriginal().map(passageOriginal => {
            passageOriginal["collapsed"] = false;
            return passageOriginal;
        });
    }

    collapse(passage: any) {
        passage["collapsed"] = !passage["collapsed"];
    }

    showEditBooks() {
        this.list = "editBooks";
    }

    showEditAuthor() {
        this.list = "editAuthors";
    }

    showEditLanguage() {
        this.list = "editLanguages";
    }

}
