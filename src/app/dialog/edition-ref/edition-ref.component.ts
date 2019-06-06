import {Component, Inject, OnInit} from "@angular/core";
import {Edition} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";

@Component({
    selector: "app-edition-ref",
    templateUrl: "./edition-ref.component.html",
    styleUrls: ["../category-ref.component.scss"]
})
export class EditionRefComponent implements OnInit {
    addingModus: boolean;
    clonedList: any[];
    allEditions: Edition[];
    filteredList: Edition[];
    filterWord: string;
    listChanged: boolean;
    max: number;

    constructor(private dialogRef: MatDialogRef<EditionRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
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
        this.allEditions = this.apiService.getEditions(true);
        this.filteredList = [...this.allEditions];
        this.listChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    addEdition(edition: Edition) {
        this.clonedList.push(edition);
        this.listChanged = true;
    }

    removeEdition(id: number) {
        this.clonedList = this.clonedList.filter((edition) => edition.id !== id);
        this.listChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.allEditions.filter((edition) => {
            const containsPublicationInfo = edition.publicationInfo.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsBook = edition.book.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsLanguage = edition.language.name.toLowerCase().indexOf(value.toLowerCase()) > -1;

            return containsPublicationInfo || containsBook || containsLanguage;
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
        this.filteredList = [...this.allEditions];
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.clonedList]});
    }

    chooseElement(edition: Edition) {
        if ((this.clonedList.length !== 0) && (this.clonedList[0].id === edition)) {
            return;
        }

        this.clonedList = [];
        this.clonedList.push(edition);
        this.listChanged = true;
    }

}
