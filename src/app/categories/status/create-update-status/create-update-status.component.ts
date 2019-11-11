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
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateStatusComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.status = JSON.parse(JSON.stringify(data.resource));
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(this.status ? this.status.name : "", [Validators.required])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.status) {
            this.status.name = this.form.get("name").value;
            // update request
            this.apiService.updateLanguage(this.status.id, this.status)
                .subscribe((data) => {
                  this.dialogRef.close({refresh: true});
                });
        } else {
            const newStatus = {
                name: this.form.get("name").value,
            };
            // create request
            this.apiService.createStatus(newStatus)
                .subscribe((data) => {
                  this.dialogRef.close({refresh: true});
                });
        }
    }

    getTitle(): string {
        return this.status ? "Edit status" : "Create new status";
    }

    getButtonText(): string {
        return this.status ? "SAVE" : "CREATE";
    }

}
