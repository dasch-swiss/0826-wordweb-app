import {Component, OnInit} from "@angular/core";
import {ApiService} from "../api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {AuthorSetComponent} from "../author-set/author-set.component";

@Component({
    selector: "app-create-book",
    templateUrl: "./create-book.component.html",
    styleUrls: ["./create-book.component.scss"]
})
export class CreateBookComponent implements OnInit {
    form: FormGroup;
    authorList: any[];

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog) {
        this.form = new FormGroup({
            title: new FormControl("", [Validators.required]),
            author: new FormControl("", []),
            subject: new FormControl("", []),
            genre: new FormControl("", []),
            venue: new FormControl("", []),
            organisation: new FormControl("", [])
        });
    }

    ngOnInit() {
        this.authorList = [];
    }

    cancel() {
    }

    create() {
    }

    addAuthor() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: this.authorList,
            editMod: false,
        };
        const dialogRef = this.authorDialog.open(AuthorSetComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.cancel) {
                this.authorList = data.data;
            }
        });
    }
}
