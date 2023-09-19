import {Component, Inject, OnInit} from "@angular/core";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";

@Component({
    selector: "app-fill-in",
    templateUrl: "./fill-in.component.html",
    styleUrls: ["./fill-in.component.scss"]
})
export class FillInComponent implements OnInit {
    title: string;
    text: string;

    constructor(private _dialogRef: MatDialogRef<FillInComponent>,
                @Inject(MAT_DIALOG_DATA) data) {
        console.log(data);
        this.title = data.title;
        this.text = data.text;
    }

    ngOnInit(): void {
    }

    close() {
        this._dialogRef.close();
    }

}
