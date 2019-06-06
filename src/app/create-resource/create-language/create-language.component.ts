import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";

@Component({
    selector: "app-create-language",
    templateUrl: "./create-language.component.html",
    styleUrls: ["./create-language.component.scss"]
})
export class CreateLanguageComponent implements OnInit {
    language: any;
    editMod: boolean;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateLanguageComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
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
            const newBook = {
                name: this.form.get("language").value,
            };
            // create request
            this.apiService.createLanguage(newBook);
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
