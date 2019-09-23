import {Component, OnInit} from "@angular/core";
import {Author, Book} from "./model/model";
import {ApiService} from "./services/apiService/api.service";
import {Router} from "@angular/router";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    bookList: Book[];
    passageList: any[];
    authorList: Author[];

    list: string;

    constructor(private apiService: ApiService) {
        this.bookList = apiService.getBooks(true);
    }

    ngOnInit() {
    }

    showBooks() {
        this.list = "book";
        this.bookList = this.apiService.getBooks(true);
    }

    showAuthors() {
        this.list = "author";
        this.authorList = this.apiService.getAuthors();
    }

    showPassages() {
        this.list = "passage";
        this.passageList = this.apiService.getPassages(true).map(passage => {
            passage["collapsed"] = false;
            return passage;
        });
    }

    collapse(passage: any) {
        passage["collapsed"] = !passage["collapsed"];
    }

}
