import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";

@Component({
  selector: "app-create-update-organisation",
  templateUrl: "./create-update-organisation.component.html",
  styleUrls: ["./create-update-organisation.component.scss"]
})
export class CreateUpdateOrganisationComponent implements OnInit {
    organisation: any;
    editMod: boolean;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateOrganisationComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.organisation = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.editMod ? this.organisation.internalID : "", []),
            name: new FormControl(this.editMod ? this.organisation.name : "", [Validators.required])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.organisation.internalID = this.form.get("internalID").value;
            this.organisation.name = this.form.get("name").value;
            // update request
            this.apiService.updateOrganisation(this.organisation.id, this.organisation);
            this.dialogRef.close({refresh: true});
        } else {
            const newOrganisation = {
                internalID: this.form.get("internalID").value,
                name: this.form.get("name").value
            };
            // create request
            this.apiService.createOrganistaion(newOrganisation);
            this.dialogRef.close({refresh: true});
        }
    }

    getTitle(): string {
        return this.editMod ? "Sprache bearbeiten" : "Neue Sprache erstellen";
    }

    getButtonText(): string {
        return this.editMod ? "SPEICHERN" : "ERSTELLEN";
    }

}
