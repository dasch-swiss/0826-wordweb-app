import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../services/api.service";
import {Author, Category, IRefInfo} from "../model/model";

@Component({
    selector: "app-category-ref",
    templateUrl: "./category-ref.component.html",
    styleUrls: ["./category-ref.scss"]
})
export class CategoryRefComponent implements OnInit {
    readonly refInfo: IRefInfo;
    private fullList: Category[];
    private filteredList: Category[];
    filterWord: string;
    listOpen: boolean;
    selectionChanged: boolean;
    selectedCat: Category[];

    constructor(private apiService: ApiService, private dialogRef: MatDialogRef<CategoryRefComponent>, @Inject(MAT_DIALOG_DATA) data) {
        this.refInfo = data;
        this.selectionChanged = false;
        this.filteredList = [];
    }

    ngOnInit() {
        switch (this.refInfo.resType) {
            case "author": {
                this.apiService.getAuthors().subscribe((authors) => {
                    this.fullList = authors;
                    this.filteredList = [...this.fullList];
                });
                break;
            }
            case "book": {
                this.apiService.getBooks().subscribe((books) => {
                    this.fullList = books;
                    this.filteredList = [...this.fullList];
                });
            }
        }

        if (this.refInfo.editMode) {
            this.selectedCat = [...this.refInfo.res];
            this.closeList();
        } else {
            this.selectedCat = this.refInfo.res.length !== 0 ? [...this.refInfo.res] : [];
            this.openList();
        }

    }

    openList() {
        this.listOpen = true;
    }

    closeList() {
        this.listOpen = false;
    }

    addCategory(category: Category) {
        this.selectedCat.push(category);
        this.selectionChanged = true;
    }

    removeCategory(id: number) {
        this.selectedCat = this.selectedCat.filter((category) => category.id !== id);
        this.selectionChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.fullList.filter(category => this.refInfo.filter(category, value));
    }

    isUsed(id: number): boolean {
        return this.selectedCat.filter((category) => category.id === id).length !== 0;
    }

    hasMaximum(): boolean | null {
        return this.refInfo.maxRes ? this.selectedCat.length === this.refInfo.maxRes : null;
    }

    clear() {
        this.filterWord = "";
        this.filteredList = [...this.fullList];
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.selectedCat]});
    }

    chooseElement(author: Author) {
        if ((this.selectedCat.length !== 0) && (this.selectedCat[0].id === author.id)) {
            return;
        }

        this.selectedCat = [];
        this.selectedCat.push(author);
        this.selectionChanged = true;
    }

}
