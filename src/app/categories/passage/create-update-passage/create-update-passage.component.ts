import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";

@Component({
    selector: "app-create-update-passage",
    templateUrl: "./create-update-passage.component.html",
    styleUrls: ["./create-update-passage.component.scss"]
})
export class CreateUpdatePassageComponent implements OnInit {
    passage: any;
    editMod: boolean;
    form: FormGroup;
    statuses: any;

    constructor(private dialogRef: MatDialogRef<CreateUpdatePassageComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.passage = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
        console.log(this.passage);
    }

    ngOnInit() {
        this.form = new FormGroup({
            text: new FormControl(this.editMod ? this.passage.text : "", []),
            textHist: new FormControl(this.editMod ? this.passage.textHist : "", []),
            page: new FormControl(this.editMod ? this.passage.page : "", []),
            pageHist: new FormControl(this.editMod ? this.passage.pageHist : "", []),
            status: new FormControl(this.editMod ? this.passage.status.id : "", [])
        });

        this.statuses = this.apiService.getStatuses();
    }

    submit() {
      if (this.editMod) {
        this.passage.text = this.form.get("text").value;
        this.passage.textHist = this.form.get("textHist").value;
        this.passage.page = this.form.get("page").value;
        this.passage.pageHist = this.form.get("pageHist").value;
        this.passage.status = this.form.get("status").value;
        // TODO: Implement update status request
        this.dialogRef.close({refresh: true});
      } else {
        const newPassage = {
          text: this.form.get("text").value,
          textHist: this.form.get("textHist").value,
          page: this.form.get("page").value,
          pageHist: this.form.get("pageHist").value,
          status: this.form.get("status").value
        };
        // TODO: Implement create status request
        this.dialogRef.close({refresh: true});
      }
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    getTitle(): string {
        return this.editMod ? "Edit passage" : "Create new passage";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }

}
