import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";

@Component({
    selector: "app-create-update-lexia",
    templateUrl: "./create-update-lexia.component.html",
    styleUrls: ["./create-update-lexia.component.scss"]
})
export class CreateUpdateLexiaComponent implements OnInit {
    lexia: any;
    editMod: boolean;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateLexiaComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.lexia = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.editMod ? this.lexia.internalID : "", []),
            name: new FormControl(this.editMod ? this.lexia.name : "", [Validators.required])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.lexia.internalID = this.form.get("internalID").value;
            this.lexia.name = this.form.get("name").value;
            // update request
            this.apiService.updateLexia(this.lexia.id, this.lexia)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        } else {
            const newLexia = {
                internalID: this.form.get("internalID").value,
                name: this.form.get("name").value,
            };
            // create request
            this.apiService.createLexia(newLexia)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
    }

    getTitle(): string {
        return this.editMod ? "Edit lexia" : "Create new lexia";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }

}