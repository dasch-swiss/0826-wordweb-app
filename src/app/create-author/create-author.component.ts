import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";

@Component({
  selector: "app-create-author",
  templateUrl: "./create-author.component.html",
  styleUrls: ["./create-author.component.scss"]
})
export class CreateAuthorComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateAuthorComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  create() {
    this.dialogRef.close();
  }

}
