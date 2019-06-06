import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/apiService/api.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {BookRefComponent} from "../../dialog/book-ref/book-ref.component";
import {LanguageRefComponent} from "../../dialog/language-ref/language-ref.component";
import {Book, Language} from "../../model/model";

@Component({
    selector: "app-create-edition",
    templateUrl: "./create-edition.component.html",
    styleUrls: ["../create-update.component.scss"]
})
export class CreateEditionComponent implements OnInit {
    edition: any;
    editMod: boolean;
    form: FormGroup;
    bookList: Book[];
    languageList: Language[];

    constructor(private apiService: ApiService,
                private bookDialog: MatDialog,
                private languageDialog: MatDialog,
                private router: Router,
                private dialogRef: MatDialogRef<CreateEditionComponent>,
                @Inject(MAT_DIALOG_DATA) data) {
        this.edition = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            publicationInfo: new FormControl(this.editMod ? this.edition.publicationInfo : "", [Validators.required]),
            book: new FormControl("", []),
            language: new FormControl("", [])
        });

        this.languageList = this.editMod ? [this.edition.language] : [];
        this.bookList = this.editMod ? [this.edition.book] : [];
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.edition.publicationInfo = this.form.get("publicationInfo").value;
            this.edition.book = this.bookList[0];
            this.edition.language = this.languageList[0];
            // update request
            this.apiService.updateEdition(this.edition.id, this.edition);
            this.dialogRef.close({refresh: true});
        } else {
            const newEdition = {
                publicationInfo: this.form.get("publicationInfo").value,
                book: this.bookList[0],
                language: this.languageList[0]
            };
            // create request
            this.apiService.createEdition(newEdition);
            this.dialogRef.close({refresh: true});
        }
    }

    addBook() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: this.bookList,
            editMod: this.bookList.length > 0,
            max: 1
        };
        const dialogRef = this.bookDialog.open(BookRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.bookList = data.data;
            }
        });
    }

    removeBook(book: Book) {
        const index = this.bookList.indexOf(book);

        if (index >= 0) {
            this.bookList.splice(index, 1);
        }
    }

    addLanguage() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: this.languageList,
            editMod: this.languageList.length > 0,
            max: 1
        };
        const dialogRef = this.languageDialog.open(LanguageRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.languageList = data.data;
            }
        });
    }

    removeLanguage(language: Language) {
        const index = this.languageList.indexOf(language);

        if (index >= 0) {
            this.languageList.splice(index, 1);
        }
    }

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.editMod ? "Edition bearbeiten" : "Neue Edition erstellen";
    }

    getButtonText(): string {
        return this.editMod ? "SPEICHERN" : "ERSTELLEN";
    }

}
