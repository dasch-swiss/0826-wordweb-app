import {Component, Inject, OnInit} from "@angular/core";
import {ApiService, Author} from "../api.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: "app-dragbox",
    templateUrl: "./author-set.component.html",
    styleUrls: ["./author-set.component.scss"]
})
export class AuthorSetComponent implements OnInit {

    copyValues: any[];
    addingModus: boolean;
    list: Author[];
    filteredList: Author[];

    value: string;
    valueChanged: boolean;

    constructor(private dialogRef: MatDialogRef<AuthorSetComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        console.log(data["editMod"], data["values"]);
        if (data["editMod"]) {
            this.copyValues = [...data["values"]];
        } else {
            this.copyValues = data["values"].length !== 0 ? [...data["values"]] : [];
        }
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
        this.filteredList = this.list.filter((author) => (author.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1) || (author.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1) || (author.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1));
    }

    isUsed(id: number): boolean {
        return this.copyValues.filter((author) => author.id === id).length !== 0;
    }

    clear() {
        this.value = "";
        this.filteredList = [...this.list];
    }

    cancel() {
        this.dialogRef.close({ cancel: true, data: null});
    }

    save() {
        this.dialogRef.close({ cancel: false, data: [...this.copyValues]});
    }

}
