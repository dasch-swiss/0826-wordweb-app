import {Component, Inject, OnInit} from "@angular/core";
import {ApiService} from "../../services/apiService/api.service";
import {Author, Book} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: "app-dragbox",
    templateUrl: "./author-ref.component.html",
    styleUrls: ["../category-ref.component.scss"]
})
export class AuthorRefComponent implements OnInit {

    copyValues: any[];
    addingModus: boolean;
    list: Author[];
    filteredList: Author[];

    value: string;
    valueChanged: boolean;
    maximum: number;

    constructor(private dialogRef: MatDialogRef<AuthorRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        if (data["editMod"]) {
            this.copyValues = [...data["values"]];
        } else {
            this.copyValues = data["values"].length !== 0 ? [...data["values"]] : [];
        }

        this.maximum = data["max"];
    }

    ngOnInit() {
        this.addingModus = false;
        this.list = this.apiService.getAuthors();
        this.filteredList = [...this.list];
        this.valueChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    addAuthor(author: Author) {
        this.copyValues.push(author);
        this.valueChanged = true;
        console.log(this.copyValues);
    }

    removeAuthor(id: number) {
        this.copyValues = this.copyValues.filter((author) => author.id !== id);
        this.valueChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.list.filter((author) => {
            const containsID = author.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsFirstName = author.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsLastName = author.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1;

            return containsID || containsFirstName || containsLastName;
        });
    }

    isUsed(id: number): boolean {
        return this.copyValues.filter((author) => author.id === id).length !== 0;
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

    choseElement(author: Author) {
        if ((this.copyValues.length !== 0) && (this.copyValues[0].id === author.id)) {
            return;
        }

        this.copyValues = [];
        this.copyValues.push(author);
        this.valueChanged = true;
    }

}
