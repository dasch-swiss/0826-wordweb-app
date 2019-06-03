import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
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
        this.form = new FormGroup({
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

        const data: any = {
            internalID: "&000000",
            firstName: "Hansueli",
            lastName: "Schweizer",
            description: "Swiss Singer",
            birthDate: 1973,
            deathDate: 2053
        };
        this.apiService.createAuthor(data);
        this.dialogRef.close({refresh: true});
    }

}
