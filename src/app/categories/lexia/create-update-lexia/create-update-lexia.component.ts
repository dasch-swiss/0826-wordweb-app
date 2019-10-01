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
            lexia: new FormControl(this.editMod ? this.lexia.lexia : "", [Validators.required])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
          this.lexia.internalID = this.form.get("internalID").value;
            this.lexia.lexia = this.form.get("lexia").value;
            // update request
            this.apiService.updateLexia(this.lexia.id, this.lexia);
            this.dialogRef.close({refresh: true});
        } else {
            const newLexia = {
                internalID: this.form.get("internalID").value,
                lexia: this.form.get("lexia").value,
            };
            // create request
            this.apiService.createLexia(newLexia);
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
