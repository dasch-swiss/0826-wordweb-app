import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {Contributor} from "../../../model/model";

@Component({
  selector: "app-create-update-contributor",
  templateUrl: "./create-update-contributor.component.html",
  styleUrls: ["./create-update-contributor.component.scss"]
})
export class CreateUpdateContributorComponent implements OnInit {
    contributor: any;
    editMod: boolean;
    form: FormGroup;
    genders: any;

    constructor(private dialogRef: MatDialogRef<CreateUpdateContributorComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.contributor = JSON.parse(JSON.stringify(data.resource)) as Contributor;
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.genders = this.apiService.getGenders();

        this.form = new FormGroup({
            internalID: new FormControl(this.editMod ? this.contributor.internalID : "", [Validators.required]),
            firstName: new FormControl(this.editMod ? this.contributor.firstName : "", [Validators.required]),
            lastName: new FormControl(this.editMod ? this.contributor.lastName : "", [Validators.required]),
            gender: new FormControl(this.editMod ? this.contributor.gender.id : "", [Validators.required]),
            email: new FormControl(this.editMod ? this.contributor.email : "", [])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.contributor.internalID = this.form.get("internalID").value;
            this.contributor.firstName = this.form.get("firstName").value;
            this.contributor.lastName = this.form.get("lastName").value;
            this.contributor.email = this.form.get("email").value;
            this.contributor.gender = this.form.get("gender").value;
            // update request
            this.apiService.updateContributor(this.contributor.id, this.contributor)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        } else {
            const newContributor = {
                internalID: this.form.get("internalID").value,
                firstName: this.form.get("firstName").value,
                lastName: this.form.get("lastName").value,
                gender: this.form.get("gender").value,
                email: this.form.get("email").value
            };
            // create request
            this.apiService.createContributor(newContributor)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
    }

    getTitle(): string {
        return this.editMod ? "Edit contributor" : "Create new contributor";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }

}

