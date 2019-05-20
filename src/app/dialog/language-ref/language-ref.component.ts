import {Component, Inject, OnInit} from "@angular/core";
import {Language} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";

@Component({
  selector: "app-language-ref",
  templateUrl: "./language-ref.component.html",
  styleUrls: ["../category-ref.component.scss"]
})
export class LanguageRefComponent implements OnInit {

  copyValues: any[];
  addingModus: boolean;
  list: Language[];
  filteredList: Language[];

  value: string;
  valueChanged: boolean;

  constructor(private dialogRef: MatDialogRef<LanguageRefComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
    if (data["editMod"]) {
      this.copyValues = [...data["values"]];
    } else {
      this.copyValues = data["values"].length !== 0 ? [...data["values"]] : [];
    }
  }

  ngOnInit() {
    this.addingModus = false;
    this.list = this.apiService.getLanguages();
    this.filteredList = [...this.list];
    this.valueChanged = false;
  }

  openList() {
    this.addingModus = true;
  }

  closeList() {
    this.addingModus = false;
  }

  add(language: Language) {
    this.copyValues.push(language);
    this.valueChanged = true;
    console.log(this.copyValues);
  }

  remove(id: number) {
    this.copyValues = this.copyValues.filter((language) => language.id !== id);
    this.valueChanged = true;
  }

  applyFilter(value: string) {
    this.filteredList = this.list.filter((language) => (language.name.toLowerCase().indexOf(value.toLowerCase()) > -1));
  }

  isUsed(id: number): boolean {
    return this.copyValues.filter((language) => language.id === id).length !== 0;
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
