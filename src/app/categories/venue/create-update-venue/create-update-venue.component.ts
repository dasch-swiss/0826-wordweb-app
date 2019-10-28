import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";

@Component({
    selector: "app-create-update-venue",
    templateUrl: "./create-update-venue.component.html",
    styleUrls: ["./create-update-venue.component.scss"]
})
export class CreateUpdateVenueComponent implements OnInit {
    venue: any;
    editMod: boolean;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateVenueComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.venue = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.editMod ? this.venue.internalID : "", []),
            name: new FormControl(this.editMod ? this.venue.name : "", [Validators.required]),
            place: new FormControl(this.editMod ? this.venue.place : "", [])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.venue.internalID = this.form.get("internalID").value;
            this.venue.name = this.form.get("name").value;
            this.venue.place = this.form.get("place").value;
            // update request
            this.apiService.updateVenue(this.venue.id, this.venue)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        } else {
            const newVenue = {
                internalID: this.form.get("internalID").value,
                name: this.form.get("name").value,
                place: this.form.get("place").value
            };
            // create request
            this.apiService.createVenue(newVenue)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
    }

    getTitle(): string {
        return this.editMod ? "Edit venue" : "Create new venue";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }

}
