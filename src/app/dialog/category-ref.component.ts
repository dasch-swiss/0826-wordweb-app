import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../services/api.service";
import {Author, Category, IRefInfo, Property} from "../model/model";

@Component({
    selector: "app-category-ref",
    templateUrl: "./category-ref.component.html",
    styleUrls: ["./category-ref.scss"]
})
export class CategoryRefComponent implements OnInit {
    refInfo: IRefInfo;
    fullList: Category[];
    filteredList: Category[];
    filterWord: string;
    listOpen: boolean;
    selectionChanged: boolean;
    selectedCat: Category[];

    static validateData(data: any): IRefInfo {
        const newRefInfo = {
            res: Array.isArray(data.res) ? data.res : [data.res],
            resType: data.resType,
            props: data.props,
            btnTxt: data.btnTxt,
            titleTxt: data.titleTxt,
            editMode: data.editMode,
        };

        if (data.maxRes) {
            newRefInfo["maxRes"] = data.maxRes;
        }

        if (data.filter) {
            newRefInfo["filter"] = data.filter;
        }

        return newRefInfo;
    }

    constructor(private apiService: ApiService, private dialogRef: MatDialogRef<CategoryRefComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        this.selectionChanged = false;
        this.filteredList = [];
        this.selectedCat = [];
    }

    ngOnInit() {
        this.refInfo = CategoryRefComponent.validateData(this.data);

        switch (this.refInfo.resType) {
            case "author": {
                this.apiService.getAuthors().subscribe((authors) => {
                    this.fullList = authors;
                    this.filteredList = [...this.fullList];
                });
                break;
            }
            case "book": {
                this.apiService.getBooks(true).subscribe((books) => {
                    this.fullList = books;
                    this.filteredList = [...this.fullList];
                });
                break;
            }
            case "passage": {
                this.apiService.getPassages().subscribe((passages) => {
                   this.fullList = passages;
                   this.filteredList = [...this.fullList];
                });
                break;
            }
            case "lexia": {
                this.apiService.getLexias().subscribe((lexias) => {
                    this.fullList = lexias;
                    this.filteredList = [...this.fullList];
                });
                break;
            }
            case "organisation": {
                this.apiService.getOrganisations().subscribe((organisations) => {
                    this.fullList = organisations;
                    this.filteredList = [...this.fullList];
                });
                break;
            }
            case "venue": {
                this.apiService.getVenues().subscribe((venues) => {
                    this.fullList = venues;
                    this.filteredList = [...this.fullList];
                });
                break;
            }
            case "contributor": {
                this.apiService.getContributors().subscribe((contributor) => {
                    this.fullList = contributor;
                    this.filteredList = [...this.fullList];
                });
                break;
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

    getPropValue(category: Category, prop: Property): string[] {
        if (prop.subPropNames) {
            const authors = category[prop.propName];
            console.log("a", authors, category);
            // const subPropValues = [];
            // for (const author of authors) {
            //     const name = [];
            //     for (const subPropName of prop.subPropNames) {
            //         name.push(author.subPropName);
            //     }
            //     subPropValues.push(name.join(" "));
            // }
            // return subPropValues;
        } else {
            return category[prop.propName];
        }
    }

}
