import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "app-create-author",
    templateUrl: "./create-update-author.component.html",
    styleUrls: ["../create-update.component.scss"]
})
export class CreateUpdateAuthorComponent implements OnInit {
    author: any;
    editMod: boolean;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateAuthorComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.author = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.editMod ? this.author.internalID : "", []),
            firstName: new FormControl(this.editMod ? this.author.firstName : "", [Validators.required]),
            lastName: new FormControl(this.editMod ? this.author.lastName : "", [Validators.required]),
            description: new FormControl(this.editMod ? this.author.description : "", []),
            birthDate: new FormControl(this.editMod ? this.author.birthDate : "", []),
            deathDate: new FormControl(this.editMod ? this.author.deathDate : "", []),
            activeDate: new FormControl(this.editMod ? this.author.activeDate : "", [])
        });
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.author.internalID = this.form.get("internalID").value;
            this.author.firstName = this.form.get("firstName").value;
            this.author.lastName = this.form.get("lastName").value;
            this.author.description = this.form.get("description").value;
            this.author.birthDate = this.form.get("birthDate").value;
            this.author.deathDate = this.form.get("deathDate").value;
            // update request
            this.apiService.updateAuthor(this.author.id, this.author);
            this.dialogRef.close({refresh: true});
        } else {
            const newAuthor = {
                internalID: this.form.get("internalID").value,
                firstName: this.form.get("firstName").value,
                lastName: this.form.get("lastName").value,
                description: this.form.get("description").value,
                birthDate: this.form.get("birthDate").value,
                deathDate: this.form.get("deathDate").value,
            };
            // create request
            this.apiService.createAuthor(newAuthor);
            this.dialogRef.close({refresh: true});
        }
    }

    getTitle(): string {
        return this.editMod ? "Autor bearbeiten" : "Neuen Autor erstellen";
    }

    getButtonText(): string {
        return this.editMod ? "SPEICHERN" : "ERSTELLEN";
    }

}
