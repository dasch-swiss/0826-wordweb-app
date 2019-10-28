import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-create-update-gender",
    templateUrl: "./create-update-gender.component.html",
    styleUrls: ["./create-update-gender.component.scss"]
})
export class CreateUpdateGenderComponent implements OnInit {
    gender: any;
    editMod: boolean;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateGenderComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.gender = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(this.editMod ? this.gender.name : "", [Validators.required])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.gender.name = this.form.get("name").value;
            // update request
            this.apiService.updateLanguage(this.gender.id, this.gender)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        } else {
            const newGender = {
                name: this.form.get("name").value,
            };
            // create request
            this.apiService.createGender(newGender)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
    }

    getTitle(): string {
        return this.editMod ? "Edit gender" : "Create new gender";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }

}
