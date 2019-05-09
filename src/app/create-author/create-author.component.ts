import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-create-author",
    templateUrl: "./create-author.component.html",
    styleUrls: ["./create-author.component.scss"]
})
export class CreateAuthorComponent implements OnInit {
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateAuthorComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
    }

    ngOnInit() {
        this.form = new FormGroup( {
            firstName: new FormControl("", [Validators.required]),
            lastName: new FormControl("", [Validators.required]),
            description: new FormControl("", []),
            birthDate: new FormControl("", []),
            deathDate: new FormControl("", []),
            activeDate: new FormControl("", [])
        });
    }

    cancel() {
        this.dialogRef.close();
    }

    create() {
        const fd = new FormData();
        console.log(`${this.form.get("firstName").value} ${this.form.get("lastName").value}`);
        this.dialogRef.close();
    }

}
