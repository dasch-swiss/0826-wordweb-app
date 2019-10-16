import {Component, Inject, OnInit} from "@angular/core";
import {Book} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/api.service";

@Component({
  selector: "app-book-ref",
  templateUrl: "./book-ref.component.html",
  styleUrls: ["../category-ref.scss"]
})
export class BookRefComponent implements OnInit {
   addingModus: boolean;
    clonedList: any[];
    allBooks: Book[];
    filteredList: Book[];
    filterWord: string;
    listChanged: boolean;
    max: number;

    constructor(private dialogRef: MatDialogRef<BookRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        if (data["editMod"]) {
            this.clonedList = [...data["list"]];
            this.closeList();
        } else {
            this.clonedList = data["list"].length !== 0 ? [...data["list"]] : [];
            this.openList();
        }

        this.max = data["max"];
    }

    ngOnInit() {
        this.allBooks = this.apiService.getBooks(true);
        this.filteredList = [...this.allBooks];
        this.listChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    addBook(book: Book) {
        this.clonedList.push(book);
        this.listChanged = true;
        console.log(this.clonedList);
    }

    removeBook(id: number) {
        this.clonedList = this.clonedList.filter((book) => book.id !== id);
        this.listChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.allBooks.filter((book: any) => {
            const containsID = book.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsTitle = book.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsAuthorName = book.authors.filter(author => {
                const fullName = `${author.firstName} ${author.lastName}`;
                return fullName.toLowerCase().indexOf(value.toLowerCase()) > -1;
            }).length > 0;

            return containsID || containsTitle || containsAuthorName ;
        });
    }

    isUsed(id: number): boolean {
        return this.clonedList.filter((book) => book.id === id).length !== 0;
    }


    hasMaximum(): boolean | null {
        return this.max ? this.clonedList.length === this.max : null;
    }

    clear() {
        this.filterWord = "";
        this.filteredList = [...this.allBooks];
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.clonedList]});
    }

    chooseElement(book: Book) {
        if ((this.clonedList.length !== 0) && (this.clonedList[0].id === book.id)) {
            return;
        }

        this.clonedList = [];
        this.clonedList.push(book);
        this.listChanged = true;
    }

}

