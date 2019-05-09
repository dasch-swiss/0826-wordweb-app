import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-create-book",
    templateUrl: "./create-book.component.html",
    styleUrls: ["./create-book.component.scss"]
})
export class CreateBookComponent implements OnInit {
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateBookComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.form = new FormGroup({
            title: new FormControl("", [Validators.required]),
            subject: new FormControl("", []),
            genre: new FormControl("", []),
            venue: new FormControl("", []),
            organisation: new FormControl("", [])
        });
    }

    ngOnInit() {
    }

    cancel() {
        this.dialogRef.close();
    }

    create() {
        this.dialogRef.close();
    }
}
