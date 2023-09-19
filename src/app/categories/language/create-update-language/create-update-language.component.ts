import {Component, Inject, OnInit} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../services/api.service";

@Component({
  selector: "app-create-update-language",
  templateUrl: "./create-update-language.component.html",
  styleUrls: ["./create-update-language.component.scss"]
})
export class CreateUpdateLanguageComponent implements OnInit {
    language: any;
    form: UntypedFormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateLanguageComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.language = JSON.parse(JSON.stringify(data.resource));
    }

    ngOnInit() {
        this.form = new UntypedFormGroup({
            name: new UntypedFormControl(this.language ? this.language.name : "", [Validators.required])
        });
    }

    submit() {
        if (this.language) {
            this.language.name = this.form.get("name").value;
            // update request
            this.apiService.updateLanguage(this.language.id, this.language)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
            const newLanguage = {
                name: this.form.get("name").value,
            };
            // create request
            this.apiService.createLanguage(newLanguage)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    getTitle(): string {
        return this.language ? "Edit language" : "Create new language";
    }

    getButtonText(): string {
        return this.language ? "SAVE" : "CREATE";
    }

}

