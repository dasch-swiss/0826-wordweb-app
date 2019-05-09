import {Component, Inject, OnInit} from "@angular/core";
import {ApiService, Author} from "../api.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: "app-dragbox",
  templateUrl: "./dragbox.component.html",
  styleUrls: ["./dragbox.component.scss"]
})
export class DragboxComponent implements OnInit {

  copyValues: any[];
  addingModus: boolean;
  list: Author[];
  filteredList: Author[];

  value: string;
  valueChanged: boolean;

  constructor(private dialogRef: MatDialogRef<DragboxComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
    this.copyValues = [...data["values"]];
  }

  ngOnInit() {
    this.addingModus = false;
    this.list = this.apiService.getAuthors();
    this.filteredList = [...this.list];
    this.valueChanged = false;
  }

  addAuthors() {
    this.addingModus = true;
  }

  addAuthor(author: Author) {
    this.copyValues.push(author);
    this.valueChanged = true;
  }

  removeAuthor(id: number) {
    this.copyValues = this.copyValues.filter((author) => author.id !== id);
    this.valueChanged = true;
  }

  applyFilter(value: string) {
    this.filteredList = this.list.filter((author) => (author.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1) || (author.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1) || (author.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1));
  }

  isUsed(id: number): boolean {
    return this.copyValues.filter((author) => author.id === id).length !== 0;
  }

  clear() {
    this.value = "";
    this.filteredList = [...this.list];
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close();
  }

}
