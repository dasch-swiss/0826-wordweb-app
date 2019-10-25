import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";
import {CustomValidators} from "../../../customValidators";

@Component({
    selector: "app-create-update-author",
    templateUrl: "./create-update-author.component.html",
    styleUrls: ["./create-update-author.component.scss"]
})
export class CreateUpdateAuthorComponent implements OnInit {
    author: any;
    editMod: boolean;
    form: FormGroup;
    genders: any;
    activeDisabled: boolean;

    constructor(private dialogRef: MatDialogRef<CreateUpdateAuthorComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.author = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
        this.activeDisabled = true;
    }

    ngOnInit() {
        this.genders = this.apiService.getGenders();

        this.form = new FormGroup({
            internalID: new FormControl(this.editMod ? this.author.internalID : "", [Validators.required]),
            firstName: new FormControl(this.editMod ? this.author.firstName : "", [Validators.required]),
            lastName: new FormControl(this.editMod ? this.author.lastName : "", [Validators.required]),
            description: new FormControl(this.editMod ? this.author.description : "", []),
            gender: new FormControl(this.editMod ? this.author.gender.id : "", [Validators.required]),
            birthCheck: new FormControl(this.editMod && this.author.birthStartDate, []),
            birth: new FormGroup({
                birthStartDate: new FormControl(this.editMod ? this.author.birthStartDate : "", [Validators.required]),
                birthEndDate: new FormControl(this.editMod ? this.author.birthEndDate : "", [Validators.required]),
            }, [CustomValidators.correctYearSpan("birthStartDate", "birthEndDate")]),
            deathCheck: new FormControl(this.editMod && this.author.deathStartDate, []),
            death: new FormGroup({
                deathStartDate: new FormControl(this.editMod ? this.author.deathStartDate : "", [Validators.required]),
                deathEndDate: new FormControl(this.editMod ? this.author.deathEndDate : "", [Validators.required]),
            }, [CustomValidators.correctYearSpan("deathStartDate", "deathEndDate")]),
            flCheck: new FormControl(this.editMod && this.author.flStartDate, []),
            fl: new FormGroup({
                flStartDate: new FormControl(this.editMod ? this.author.flStartDate : "", [Validators.required]),
                flEndDate: new FormControl(this.editMod ? this.author.flEndDate : "", [Validators.required])
            }, [CustomValidators.correctYearSpan("flStartDate", "flEndDate")])
        });

        if (!this.author) {
            this.form.get("birth").disable();
            this.form.get("death").disable();
            this.form.get("fl").disable();
        }

        if (this.author && !this.author.birthStartDate) {
            this.form.get("birth").disable();
        }

        if (this.author && !this.author.deathStartDate) {
            this.form.get("death").disable();
        }

        if (this.author && !this.author.flStartDate) {
            this.form.get("fl").disable();
        }
    }

    submit() {
        if (this.editMod) {
            this.author.internalID = this.form.get("internalID").value;
            this.author.firstName = this.form.get("firstName").value;
            this.author.lastName = this.form.get("lastName").value;
            this.author.description = this.form.get("description").value;
            this.author.gender = this.form.get("gender").value;
            this.author.birthStartDate = this.form.get("birth").status === "DISABLED" ? "" : this.form.get("birth").get("birthStartDate").value;
            this.author.birthEndDate = this.form.get("birth").status === "DISABLED" ? "" : this.form.get("birth").get("birthEndDate").value;
            this.author.deathStartDate = this.form.get("death").status === "DISABLED" ? "" : this.form.get("death").get("deathStartDate").value;
            this.author.deathEndDate = this.form.get("death").status === "DISABLED" ? "" : this.form.get("death").get("deathEndDate").value;
            this.author.flStartDate = this.form.get("fl").status === "DISABLED" ? "" : this.form.get("fl").get("flStartDate").value;
            this.author.flEndDate = this.form.get("fl").status === "DISABLED" ? "" : this.form.get("fl").get("flEndDate").value;
            this.author.humanAsLexia =  "";
            this.author.internalComment = "";
            // update request
            this.apiService.updateAuthor(this.author.id, this.author);
            this.dialogRef.close({refresh: true});
        } else {
            const newAuthor = {
                internalID: this.form.get("internalID").value,
                firstName: this.form.get("firstName").value,
                lastName: this.form.get("lastName").value,
                description: this.form.get("description").value,
                gender: this.form.get("gender").value,
                birthStartDate: this.form.get("birth").status === "DISABLED" ? "" : this.form.get("birth").get("birthStartDate").value,
                birthEndDate: this.form.get("birth").status === "DISABLED" ? "" : this.form.get("birth").get("birthEndDate").value,
                deathStartDate: this.form.get("death").status === "DISABLED" ? "" : this.form.get("death").get("deathStartDate").value,
                deathEndDate: this.form.get("death").status === "DISABLED" ? "" : this.form.get("death").get("deathEndDate").value,
                flStartDate: this.form.get("fl").status === "DISABLED" ? "" : this.form.get("fl").get("flStartDate").value,
                flEndDate: this.form.get("fl").status === "DISABLED" ? "" : this.form.get("fl").get("flEndDate").value,
                humanAsLexia: "",
                internalComment: ""
            };
            // create request
            this.apiService.createAuthor(newAuthor);
            this.dialogRef.close({refresh: true});
        }
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).enable() : this.form.get(groupName).disable();
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    getTitle(): string {
        return this.editMod ? "Edit author" : "Create new author";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }

}
