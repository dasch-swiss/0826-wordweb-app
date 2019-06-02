import {Component, Inject, OnInit} from "@angular/core";
import {Book} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";

@Component({
    selector: "app-book-ref",
    templateUrl: "./book-ref.component.html",
    styleUrls: ["../category-ref.component.scss"]
})
export class BookRefComponent implements OnInit {

    copyValues: any[];
    addingModus: boolean;
    list: Book[];
    filteredList: Book[];

    value: string;
    valueChanged: boolean;
    maximum: number;

    constructor(private dialogRef: MatDialogRef<BookRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        console.log(data);
        if (data["editMod"]) {
            this.copyValues = [...data["values"]];
        } else {
            this.copyValues = data["values"].length !== 0 ? [...data["values"]] : [];
        }

        this.maximum = data["max"];
    }

    ngOnInit() {
        this.addingModus = false;
        this.list = this.apiService.getBooks(true);
        this.filteredList = [...this.list];
        this.valueChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    add(book: Book) {
        this.copyValues.push(book);
        this.valueChanged = true;
        console.log(this.copyValues);
    }

    remove(id: number) {
        this.copyValues = this.copyValues.filter((book) => book.id !== id);
        this.valueChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.list.filter((book) => {
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
        return this.copyValues.filter((book) => book.id === id).length !== 0;
    }


    hasMaximum(): boolean | null {
        return this.maximum ? this.copyValues.length === this.maximum : null;
    }

    clear() {
        this.value = "";
        this.filteredList = [...this.list];
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.copyValues]});
    }

    choseElement(book: Book) {
        if ((this.copyValues.length !== 0) && (this.copyValues[0].id === book.id)) {
            return;
        }

        this.copyValues = [];
        this.copyValues.push(book);
        this.valueChanged = true;
    }

}
