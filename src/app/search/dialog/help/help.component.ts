import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: "app-help",
    templateUrl: "./help.component.html",
    styleUrls: ["./help.component.scss"]
})
export class HelpComponent implements OnInit {
    title: string;
    text: string;

    constructor(private _dialogRef: MatDialogRef<HelpComponent>,
                @Inject(MAT_DIALOG_DATA) data) {
        this.title = data.title;
        this.text = data.text;
    }

    ngOnInit() {
    }

    close() {
        this._dialogRef.close();
    }

}
