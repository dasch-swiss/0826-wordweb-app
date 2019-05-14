import {Component, Inject, OnInit} from "@angular/core";
import {ApiService, Author, Venue} from "../api.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: "app-venue-set",
  templateUrl: "./venue-set.component.html",
  styleUrls: ["./venue-set.component.scss"]
})
export class VenueSetComponent implements OnInit {

  copyValues: any[];
  addingModus: boolean;
  list: Venue[];
  filteredList: Venue[];

  value: string;
  valueChanged: boolean;
  constructor(private dialogRef: MatDialogRef<VenueSetComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
    if (data["editMod"]) {
      this.copyValues = [...data["values"]];
    } else {
      this.copyValues = data["values"].length !== 0 ? [...data["values"]] : [];
    }
  }

  ngOnInit() {
    this.addingModus = false;
    this.list = this.apiService.getVenues();
    this.filteredList = [...this.list];
    this.valueChanged = false;
  }

  openList() {
    this.addingModus = true;
  }

  closeList() {
    this.addingModus = false;
  }

  addVenue(venue: Venue) {
    this.copyValues.push(venue);
    this.valueChanged = true;
    console.log(this.copyValues);
  }

  removeVenue(id: number) {
    this.copyValues = this.copyValues.filter((venue) => venue.id !== id);
    this.valueChanged = true;
  }

  applyFilter(value: string) {
    this.filteredList = this.list.filter((venue) => (venue.name.toLowerCase().indexOf(value.toLowerCase()) > -1) || (venue.city.toLowerCase().indexOf(value.toLowerCase()) > -1));
  }

  isUsed(id: number): boolean {
    return this.copyValues.filter((venue) => venue.id === id).length !== 0;
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
