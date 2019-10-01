import {Component} from "@angular/core";
import {Author, Book} from "./model/model";
import {ApiService} from "./services/api.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  bookList: Book[];
  passageList: any[];
  authorList: Author[];

  list: string;

  constructor(private apiService: ApiService) {
    this.bookList = apiService.getBooks(true);
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
