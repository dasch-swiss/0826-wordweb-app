import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";
import {Lexia} from "../../../model/model";

@Component({
  selector: "app-create-update-organisation",
  templateUrl: "./create-update-organisation.component.html",
  styleUrls: ["./create-update-organisation.component.scss"]
})
export class CreateUpdateOrganisationComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    organisation: any;
    form: FormGroup;
    lexiaList: Lexia[];

    constructor(private dialogRef: MatDialogRef<CreateUpdateOrganisationComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.organisation = JSON.parse(JSON.stringify(data.resource));
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.organisation ? this.organisation.internalID : "", []),
            name: new FormControl(this.organisation ? this.organisation.name : "", [Validators.required])
        });

        this.lexiaList = this.organisation ? (Object.keys(this.organisation.organisationAsLexia).length === 0 ? [] : [this.organisation.organisationAsLexia]) : [];
    }

    submit() {
        if (this.organisation) {
            this.organisation.internalID = this.form.get("internalID").value;
            this.organisation.name = this.form.get("name").value;
            // update request
            this.apiService.updateOrganisation(this.organisation.id, this.organisation)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        } else {
            const newOrganisation = {
                internalID: this.form.get("internalID").value,
                name: this.form.get("name").value
            };
            // create request
            this.apiService.createOrganistaion(newOrganisation)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    addLexia() {
    }

    removeLexia(lexia: Lexia) {
    }

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.organisation ? "Edit company" : "Create new company";
    }

    getButtonText(): string {
        return this.organisation ? "SAVE" : "CREATE";
    }

}
