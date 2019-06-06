import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Edition} from "../../model/model";
import {ApiService} from "../../services/apiService/api.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {EditionRefComponent} from "../../dialog/edition-ref/edition-ref.component";

@Component({
    selector: "app-create-passage",
    templateUrl: "./create-update-passage.component.html",
    styleUrls: ["../create-update.component.scss"]
})
export class CreateUpdatePassageComponent implements OnInit {
    passage: any;
    editMod: boolean;
    form: FormGroup;
    editionList: Edition[];

    constructor(private apiService: ApiService,
                private editionDialog: MatDialog,
                private router: Router,
                private dialogRef: MatDialogRef<CreateUpdatePassageComponent>,
                @Inject(MAT_DIALOG_DATA) data) {
        this.passage = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            text: new FormControl(this.editMod ? this.passage.text : "", [Validators.required]),
            page: new FormControl(this.editMod ? this.passage.page : "", [])
        });

        this.editionList = this.editMod ? [this.passage.edition] : [];
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.passage.text = this.form.get("text").value;
            this.passage.page = this.form.get("page").value;
            this.passage.edition = this.editionList[0];
            // update request
            this.apiService.updatePassage(this.passage.id, this.passage);
            this.dialogRef.close({refresh: true});
        } else {
            const newPassage = {
                text: this.form.get("text").value,
                page: this.form.get("page").value,
                edition: this.editionList[0]
            };
            // create request
            this.apiService.createPassage(newPassage);
            this.dialogRef.close({refresh: true});
        }
    }

    addEdition() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: this.editionList,
            editMod: this.editionList.length > 0,
            max: 1
        };
        const dialogRef = this.editionDialog.open(EditionRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.editionList = data.data;
            }
        });
    }

    removeEdition(edition: Edition) {
        const index = this.editionList.indexOf(edition);

        if (index >= 0) {
            this.editionList.splice(index, 1);
        }
    }

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.editMod ? "Passage bearbeiten" : "Neue Passage erstellen";
    }

    getButtonText(): string {
        return this.editMod ? "SPEICHERN" : "ERSTELLEN";
    }
}
