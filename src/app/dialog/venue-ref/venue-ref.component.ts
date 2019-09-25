import {Component, Inject, OnInit} from "@angular/core";
import {ApiService} from "../../services/apiService/api.service";
import {Venue} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
    selector: "app-venue-set",
    templateUrl: "./venue-ref.component.html",
    styleUrls: ["../category-ref.component.scss"]
})
export class VenueRefComponent implements OnInit {
    addingModus: boolean;
    clonedList: any[];
    allVenues: Venue[];
    filteredList: Venue[];
    filterWord: string;
    listChanged: boolean;
    max: number;

    constructor(private dialogRef: MatDialogRef<VenueRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
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
        this.allVenues = this.apiService.getVenues();
        this.filteredList = [...this.allVenues];
        this.listChanged = false;
    }

    openList() {
        this.addingModus = true;
    }

    closeList() {
        this.addingModus = false;
    }

    addVenue(venue: Venue) {
        this.clonedList.push(venue);
        this.listChanged = true;
    }

    removeVenue(id: number) {
        this.clonedList = this.clonedList.filter((venue) => venue.id !== id);
        this.listChanged = true;
    }

    applyFilter(value: string) {
        this.filteredList = this.allVenues.filter((venue) => {
            const containsName = venue.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
            const containsCity = venue.place.toLowerCase().indexOf(value.toLowerCase()) > -1;

            return containsName || containsCity;
        });
    }

    isUsed(id: number): boolean {
        return this.clonedList.filter((venue) => venue.id === id).length !== 0;
    }

    hasMaximum(): boolean | null {
        return this.max ? this.clonedList.length === this.max : null;
    }

    clear() {
        this.filterWord = "";
        this.filteredList = [...this.allVenues];
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.clonedList]});
    }

    chooseElement(venue: Venue) {
        if ((this.clonedList.length !== 0) && (this.clonedList[0].id === venue.id)) {
            return;
        }

        this.clonedList = [];
        this.clonedList.push(venue);
        this.listChanged = true;
    }
}
