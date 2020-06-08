import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: "app-help",
    templateUrl: "./help.component.html",
    styleUrls: ["./help.component.scss"]
})
export class HelpComponent implements OnInit {
    text: string;
    name: string;

    constructor(private dialogRef: MatDialogRef<HelpComponent>,
                @Inject(MAT_DIALOG_DATA) data) {
        console.log(data.text);
        this.text = data.text;
        this.name = data.name;
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
