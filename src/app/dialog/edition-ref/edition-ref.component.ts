import {Component, Inject, OnInit} from "@angular/core";
import {Book, Edition} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";

@Component({
    selector: "app-edition-ref",
    templateUrl: "./edition-ref.component.html",
    styleUrls: ["../category-ref.component.scss"]
})
export class EditionRefComponent implements OnInit {

    copyValues: any[];
    addingModus: boolean;
    list: Edition[];
    filteredList: Edition[];

    value: string;
    valueChanged: boolean;
    maximum: number;

    constructor(private dialogRef: MatDialogRef<EditionRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
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
        this.list = this.apiService.getEditions(true);
        this.filteredList = [...this.list];
        this.valueChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    add(edition: Edition) {
        this.copyValues.push(edition);
        this.valueChanged = true;
        console.log(this.copyValues);
    }

    remove(id: number) {
        this.copyValues = this.copyValues.filter((edition) => edition.id !== id);
        this.valueChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.list.filter((edition) => {
            const containsPublicationInfo = edition.publicationInfo.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsBook = edition.book.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsLanguage = edition.language.name.toLowerCase().indexOf(value.toLowerCase()) > -1;

            return containsPublicationInfo || containsBook || containsLanguage;
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

    choseElement(edition: Edition) {
        if ((this.copyValues.length !== 0) && (this.copyValues[0].id === edition)) {
            return;
        }

        this.copyValues = [];
        this.copyValues.push(edition);
        this.valueChanged = true;
    }

}
