import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../api.service";

@Component({
    selector: "app-create-language",
    templateUrl: "./create-language.component.html",
    styleUrls: ["./create-language.component.scss"]
})
export class CreateLanguageComponent implements OnInit {
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateLanguageComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.form = new FormGroup({
            language: new FormControl("", [Validators.required])
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

    addLanguage() {
        console.log("add language");
    }

}
