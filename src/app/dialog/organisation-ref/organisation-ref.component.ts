import {Component, Inject, OnInit} from "@angular/core";
import {ApiService} from "../../services/apiService/api.service";
import {Book, Organisation, Venue} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: "app-organisation-ref",
    templateUrl: "./organisation-ref.component.html",
    styleUrls: ["../category-ref.component.scss"]
})
export class OrganisationRefComponent implements OnInit {
    addingModus: boolean;
    clonedList: any[];
    allOrganistions: Organisation[];
    filteredList: Organisation[];
    filterWord: string;
    listChanged: boolean;
    max: number;

    constructor(private dialogRef: MatDialogRef<OrganisationRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
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
        this.allOrganistions = this.apiService.getOrganisations(true);
        this.filteredList = [...this.allOrganistions];
        this.listChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    addOrganisation(organisation: Organisation) {
        this.clonedList.push(organisation);
        this.listChanged = true;
    }

    removeOrganisation(id: number) {
        this.clonedList = this.clonedList.filter((organisation) => organisation.id !== id);
        this.listChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.allOrganistions.filter((organisation) => (organisation.name.toLowerCase().indexOf(value.toLowerCase()) > -1));
    }

    isUsed(id: number): boolean {
        return this.clonedList.filter((organisation) => organisation.id === id).length !== 0;
    }

    hasMaximum(): boolean | null {
        return this.max ? this.clonedList.length === this.max : null;
    }

    clear() {
        this.filterWord = "";
        this.filteredList = [...this.allOrganistions];
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.clonedList]});
    }

    chooseElement(organisation: Organisation) {
        if ((this.clonedList.length !== 0) && (this.clonedList[0].id === organisation.id)) {
            return;
        }

        this.clonedList = [];
        this.clonedList.push(organisation);
        this.listChanged = true;
    }

}
