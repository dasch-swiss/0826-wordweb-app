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

    copyValues: any[];
    addingModus: boolean;
    list: Organisation[];
    filteredList: Organisation[];

    value: string;
    valueChanged: boolean;
    maximum: number;

    constructor(private dialogRef: MatDialogRef<OrganisationRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        if (data["editMod"]) {
            this.copyValues = [...data["values"]];
        } else {
            this.copyValues = data["values"].length !== 0 ? [...data["values"]] : [];
        }

        this.maximum = data["max"];
    }

    ngOnInit() {
        this.addingModus = false;
        this.list = this.apiService.getOrganisations();
        this.filteredList = [...this.list];
        this.valueChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    add(organisation: Organisation) {
        this.copyValues.push(organisation);
        this.valueChanged = true;
        console.log(this.copyValues);
    }

    remove(id: number) {
        this.copyValues = this.copyValues.filter((organisation) => organisation.id !== id);
        this.valueChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.list.filter((organisation) => (organisation.name.toLowerCase().indexOf(value.toLowerCase()) > -1));
    }

    isUsed(id: number): boolean {
        return this.copyValues.filter((organisation) => organisation.id === id).length !== 0;
    }

    hasMaximum(): boolean | null {
        return this.maximum ? this.copyValues.length === this.maximum : null;
    }

    clear() {
        this.value = "";
        this.filteredList = [...this.list];
    }

    cancel() {
        this.dialogRef.close({cancel: true, data: null});
    }

    save() {
        this.dialogRef.close({cancel: false, data: [...this.copyValues]});
    }

    choseElement(organisation: Organisation) {
        if ((this.copyValues.length !== 0) && (this.copyValues[0].id === organisation.id)) {
            return;
        }

        this.copyValues = [];
        this.copyValues.push(organisation);
        this.valueChanged = true;
    }

}
