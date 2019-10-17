import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Author, Language, Organisation, Venue} from "../../../model/model";
import {ApiService} from "../../../services/api.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {AuthorRefComponent} from "../../../dialog/author-ref/author-ref.component";
import {VenueRefComponent} from "../../../dialog/venue-ref/venue-ref.component";
import {OrganisationRefComponent} from "../../../dialog/organisation-ref/organisation-ref.component";
import {LanguageRefComponent} from "../../../dialog/language-ref/language-ref.component";

@Component({
    selector: "app-create-update-book",
    templateUrl: "./create-update-book.component.html",
    styleUrls: ["./create-update-book.component.scss"]
})
export class CreateUpdateBookComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    book: any;
    editMod: boolean;
    form: FormGroup;
    authorList: Author[];
    venueList: Venue[];
    organisationList: Organisation[];
    languageList: Language[];

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog,
                private venueDialog: MatDialog,
                private organisationDialog: MatDialog,
                private languageDialog: MatDialog,
                private router: Router,
                private dialogRef: MatDialogRef<CreateUpdateBookComponent>,
                @Inject(MAT_DIALOG_DATA) data) {
        this.book = JSON.parse(JSON.stringify(data.resource));
        this.editMod = data.editMod;
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.editMod ? this.book.internalID : "", [Validators.required]),
            title: new FormControl(this.editMod ? this.book.title : "", [Validators.required]),
            // author: new FormControl("", []),
            // subject: new FormControl("", []),
            // genre: new FormControl("", []),
            // venue: new FormControl("", []),
            // organisation: new FormControl("", [])
        });

        this.authorList = this.editMod ? this.book.authors : [];
        this.venueList = this.editMod ? this.book.venues : [];
        this.organisationList = this.editMod ? this.book.organisations : [];
        this.languageList = this.editMod ? [this.book.language] : [];
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    submit() {
        if (this.editMod) {
            this.book.internalID = this.form.get("internalID").value;
            this.book.title = this.form.get("title").value;
            this.book.authors = this.authorList;
            this.book.venues = this.venueList;
            this.book.organisations = this.organisationList;
            // update request
            this.apiService.updateBook(this.book.id, this.book);
            this.dialogRef.close({refresh: true});
        } else {
            const newBook = {
                internalID: this.form.get("internalID").value,
                title: this.form.get("title").value,
                authors: this.authorList,
                venues: this.venueList,
                organisations: this.organisationList
            };
            // create request
            this.apiService.createBook(newBook);
            this.dialogRef.close({refresh: true});
        }
    }

    addAuthor() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: this.authorList,
            editMod: this.authorList.length > 0,
            max: 10
        };
        const dialogRef = this.authorDialog.open(AuthorRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.authorList = data.data;
            }
        });
    }

    removeAuthor(author: Author) {
        const index = this.authorList.indexOf(author);

        if (index >= 0) {
            this.authorList.splice(index, 1);
        }
    }

    addVenue() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: this.venueList,
            editMod: this.venueList.length > 0,
            max: 10
        };
        const dialogRef = this.venueDialog.open(VenueRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.venueList = data.data;
            }
        });
    }

    removeVenue(venue: Venue) {
        const index = this.venueList.indexOf(venue);

        if (index >= 0) {
            this.venueList.splice(index, 1);
        }
    }

    addOrganisation() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: this.organisationList,
            editMod: this.organisationList.length > 0,
            max: 10
        };
        const dialogRef = this.organisationDialog.open(OrganisationRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.organisationList = data.data;
            }
        });
    }

    removeOrganisation(organisation: Organisation) {
        const index = this.organisationList.indexOf(organisation);

        if (index >= 0) {
            this.organisationList.splice(index, 1);
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
        return this.editMod ? "Edit book" : "Create new book";
    }

    getButtonText(): string {
        return this.editMod ? "SAVE" : "CREATE";
    }
}

