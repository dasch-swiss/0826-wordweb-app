import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../services/api.service";
import {Lexia} from "../../../model/model";
import {CategoryRefComponent} from "../../../dialog/category-ref.component";

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

    constructor(private lexiaDialog: MatDialog,
                private dialogRef: MatDialogRef<CreateUpdateVenueComponent>,
                @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.venue = JSON.parse(JSON.stringify(data.resource));
        console.log(this.venue);
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.venue ? this.venue.internalID : "", []),
            name: new FormControl(this.venue ? this.venue.name : "", [Validators.required]),
            place: new FormControl(this.venue ? this.venue.place : "", [])
        });

        this.lexiaList = this.venue ? this.venue.venueAsLexia  ? [this.venue.venueAsLexia] : [] : [];
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
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            res: this.lexiaList,
            resType: "lexia",
            props: ["internalID", "name"],
            filter: (lexia: Lexia, value: string): boolean => {
                const containsID = lexia.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsName = lexia.name.toLowerCase().indexOf(value.toLowerCase()) > -1;

                return containsID || containsName;
            },
            btnTxt: "select lexia",
            titleTxt: "Add Lexia",
            editMode: true
        };

        const dialogRef = this.lexiaDialog.open(CategoryRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.lexiaList = data.data;
            }
        });
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
