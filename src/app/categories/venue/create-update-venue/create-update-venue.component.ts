import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";
import {Lexia} from "../../../model/model";

@Component({
    selector: "app-create-update-venue",
    templateUrl: "./create-update-venue.component.html",
    styleUrls: ["./create-update-venue.component.scss"]
})
export class CreateUpdateVenueComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    venue: any;
    form: FormGroup;
    lexiaList: Lexia[];

    constructor(private dialogRef: MatDialogRef<CreateUpdateVenueComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.venue = JSON.parse(JSON.stringify(data.resource));
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.venue ? this.venue.internalID : "", []),
            name: new FormControl(this.venue ? this.venue.name : "", [Validators.required]),
            place: new FormControl(this.venue ? this.venue.place : "", [])
        });

        this.lexiaList = this.venue ? (Object.keys(this.venue.venueAsLexia).length === 0 ? [] : [this.venue.venueAsLexia]) : [];
    }

    submit() {
        if (this.venue) {
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
        return this.venue ? "Edit venue" : "Create new venue";
    }

    getButtonText(): string {
        return this.venue ? "SAVE" : "CREATE";
    }

}
