import {Component, Inject, OnInit} from "@angular/core";
import {Book, Language} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";

@Component({
    selector: "app-language-ref",
    templateUrl: "./language-ref.component.html",
    styleUrls: ["../category-ref.component.scss"]
})
export class LanguageRefComponent implements OnInit {
    addingModus: boolean;
    clonedList: any[];
    allLanguages: Language[];
    filteredList: Language[];
    filterWord: string;
    listChanged: boolean;
    max: number;

    constructor(private dialogRef: MatDialogRef<LanguageRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
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
        this.allLanguages = this.apiService.getLanguages();
        this.filteredList = [...this.allLanguages];
        this.listChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    addLanguage(language: Language) {
        this.clonedList.push(language);
        this.listChanged = true;
    }

    removeLanguage(id: number) {
        this.clonedList = this.clonedList.filter((language) => language.id !== id);
        this.listChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.allLanguages.filter((language) => (language.name.toLowerCase().indexOf(value.toLowerCase()) > -1));
    }

    isUsed(id: number): boolean {
        return this.clonedList.filter((language) => language.id === id).length !== 0;
    }

    hasMaximum(): boolean | null {
        return this.max ? this.clonedList.length === this.max : null;
    }

    clear() {
        this.filterWord = "";
        this.filteredList = [...this.allLanguages];
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.clonedList]});
    }

    chooseElement(language: Language) {
        if ((this.clonedList.length !== 0) && (this.clonedList[0].id === language.id)) {
            return;
        }

        this.clonedList = [];
        this.clonedList.push(language);
        this.listChanged = true;
    }

}
