import {Component, Inject, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {Author} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: "app-author-ref",
  templateUrl: "./author-ref.component.html",
  styleUrls: ["../category-ref.scss"]
})
export class AuthorRefComponent implements OnInit {
    addingModus: boolean;
    clonedList: any[];
    allAuthors: Author[];
    filteredList: Author[];
    filterWord: string;
    listChanged: boolean;
    max: number;

    constructor(private dialogRef: MatDialogRef<AuthorRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        if (data.editMod) {
            this.clonedList = [...data.list];
            this.closeList();
        } else {
            this.clonedList = data.list.length !== 0 ? [...data.list] : [];
            this.openList();
        }

        this.max = data.max;
        this.listChanged = false;
        this.filteredList = [];
    }

    ngOnInit() {
        this.apiService.getAuthors().subscribe((authors) => {
            this.allAuthors = authors;
            this.filteredList = [...this.allAuthors];
        });
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    addAuthor(author: Author) {
        this.clonedList.push(author);
        this.listChanged = true;
    }

    removeAuthor(id: number) {
        this.clonedList = this.clonedList.filter((author) => author.id !== id);
        this.listChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.allAuthors.filter((author) => {
            const containsID = author.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsFirstName = author.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsLastName = author.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1;

            return containsID || containsFirstName || containsLastName;
        });
    }

    isUsed(id: number): boolean {
        return this.clonedList.filter((author) => author.id === id).length !== 0;
    }

    hasMaximum(): boolean | null {
        return this.max ? this.clonedList.length === this.max : null;
    }

    clear() {
        this.filterWord = "";
        this.filteredList = [...this.allAuthors];
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.clonedList]});
    }

    chooseElement(author: Author) {
        if ((this.clonedList.length !== 0) && (this.clonedList[0].id === author.id)) {
            return;
        }

        this.clonedList = [];
        this.clonedList.push(author);
        this.listChanged = true;
    }

}

