import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-create-update-status",
    templateUrl: "./create-update-status.component.html",
    styleUrls: ["./create-update-status.component.scss"]
})
export class CreateUpdateStatusComponent implements OnInit {
    status: any;
    editMod: boolean;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateStatusComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.status = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(this.editMod ? this.status.name : "", [Validators.required])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.status.name = this.form.get("name").value;
            // update request
            this.apiService.updateLanguage(this.status.id, this.status);
            this.dialogRef.close({refresh: true});
        } else {
            const newStatus = {
                name: this.form.get("name").value,
            };
            // create request
            this.apiService.createStatus(newStatus);
            this.dialogRef.close({refresh: true});
        }
    }

    getTitle(): string {
        return this.editMod ? "Edit status" : "Create new status";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }

}
