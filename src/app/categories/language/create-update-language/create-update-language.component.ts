import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";

@Component({
  selector: "app-create-update-language",
  templateUrl: "./create-update-language.component.html",
  styleUrls: ["./create-update-language.component.scss"]
})
export class CreateUpdateLanguageComponent implements OnInit {
    language: any;
    editMod: boolean;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateLanguageComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.language = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            language: new FormControl(this.editMod ? this.language.name : "", [Validators.required])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.language.name = this.form.get("language").value;
            // update request
            this.apiService.updateLanguage(this.language.id, this.language);
            this.dialogRef.close({refresh: true});
        } else {
            const newLanguage = {
                name: this.form.get("language").value,
            };
            // create request
            this.apiService.createLanguage(newLanguage);
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

