import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";
import {FormalClass, Image, Passage} from "../../../model/model";

@Component({
    selector: "app-create-update-lexia",
    templateUrl: "./create-update-lexia.component.html",
    styleUrls: ["./create-update-lexia.component.scss"]
})
export class CreateUpdateLexiaComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    lexia: any;
    editMod: boolean;
    form: FormGroup;
    passageList: Passage[];
    formalClassList: FormalClass[];
    imageList: Image[];

    constructor(private dialogRef: MatDialogRef<CreateUpdateLexiaComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.lexia = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.editMod ? this.lexia.internalID : "", []),
            name: new FormControl(this.editMod ? this.lexia.name : "", [Validators.required])
        });

        this.passageList = this.lexia ? this.lexia.usedIn : [];
        this.formalClassList = this.lexia ? (this.lexia.formalClass ? [this.lexia.formalClass] : []) : [];
        this.imageList = this.lexia ? (this.lexia.formalClass ? [this.lexia.formalClass] : []) : [];
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

    addPassage() {
    }

    removePassage(passage: Passage) {
    }

    addFormalClass() {
    }

    removeFormalClass(formalClass: FormalClass) {
    }

    addImage() {
    }

    removeImage(image: Image) {
    }

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.editMod ? "Edit lexia" : "Create new lexia";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }

}
