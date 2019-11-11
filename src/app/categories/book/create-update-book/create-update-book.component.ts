import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Author, Genre, Lexia, Organisation, Subject, Venue} from "../../../model/model";
import {ApiService} from "../../../services/api.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {AuthorRefComponent} from "../../../dialog/author-ref/author-ref.component";
import {VenueRefComponent} from "../../../dialog/venue-ref/venue-ref.component";
import {OrganisationRefComponent} from "../../../dialog/organisation-ref/organisation-ref.component";
import {CustomValidators} from "../../../customValidators";

@Component({
    selector: "app-create-update-book",
    templateUrl: "./create-update-book.component.html",
    styleUrls: ["./create-update-book.component.scss"]
})
export class CreateUpdateBookComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    book: any;
    form: FormGroup;
    authorList: Author[];
    venueList: Venue[];
    organisationList: Organisation[];
    subjectList: Subject[];
    genreList: Genre[];
    lexiaList: Lexia[];
    languages: any;

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog,
                private venueDialog: MatDialog,
                private organisationDialog: MatDialog,
                private languageDialog: MatDialog,
                private dialogRef: MatDialogRef<CreateUpdateBookComponent>,
                @Inject(MAT_DIALOG_DATA) data) {
        this.book = JSON.parse(JSON.stringify(data.resource));
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalID: new FormControl(this.book ? this.book.internalID : "", [Validators.required]),
            title: new FormControl(this.book ? this.book.title : "", [Validators.required]),
            edition: new FormControl(this.book ? this.book.edition : "", []),
            editionHist: new FormControl(this.book ? this.book.editionHist : "", []),
            language: new FormControl(this.book ? this.book.language.id : "", [Validators.required]),
            createdCheck: new FormControl(this.book ? this.book.createdStartDate : "", []),
            created: new FormGroup({
                createdStartDate: new FormControl(this.book ? this.book.createdStartDate : "", [Validators.required]),
                createdEndDate: new FormControl(this.book ? this.book.createdEndDate : "", [Validators.required])
            }, [CustomValidators.correctYearSpan("createdStartDate", "createdEndDate")]),
            publishedCheck: new FormControl(this.book ? this.book.publishedStartDate : "", []),
            published: new FormGroup({
                publishedStartDate: new FormControl(this.book ? this.book.publishedStartDate : "", [Validators.required]),
                publishedEndDate: new FormControl(this.book ? this.book.publishedEndDate : "", [Validators.required])
            }, [CustomValidators.correctYearSpan("publishedStartDate", "publishedEndDate")]),
            licensedCheck: new FormControl(this.book ? this.book.licenseStartDate : "", []),
            licensed: new FormGroup({
                licenseStartDate: new FormControl(this.book ? this.book.licenseStartDate : "", [Validators.required]),
                licenseEndDate: new FormControl(this.book ? this.book.licenseEndDate : "", [Validators.required])
            }, [CustomValidators.correctYearSpan("licenseStartDate", "licenseEndDate")]),
            firstPerformedCheck: new FormControl(this.book ? this.book.firstPerformedStartDate : "", []),
            firstPerformed: new FormGroup({
                firstPerformedStartDate: new FormControl(this.book ? this.book.firstPerformedStartDate : "", [Validators.required]),
                firstPerformedEndDate: new FormControl(this.book ? this.book.firstPerformedEndDate : "", [Validators.required])
            }, [CustomValidators.correctYearSpan("firstPerformedStartDate", "firstPerformedEndDate")]),
            publicComment: new FormControl(this.book ? this.book.publicComment : "", []),
            internalComment: new FormControl(this.book ? this.book.internalComment : "", []),
            order: new FormControl(this.book ? this.book.order : 0, [])
        });

        if (this.book) {
            if (!this.book.publishedStartDate) {
                this.form.get("published").disable();
            }

            if (!this.book.createdStartDate) {
                this.form.get("created").disable();
            }

            if (!this.book.licenseStartDate) {
                this.form.get("licensed").disable();
            }

            if (!this.book.firstPerformedStartDate) {
                this.form.get("firstPerformed").disable();
            }
        } else {
            this.form.get("created").disable();
            this.form.get("published").disable();
            this.form.get("licensed").disable();
            this.form.get("firstPerformed").disable();
        }

        this.languages = this.apiService.getLanguages();

        this.lexiaList = this.book ? (Object.keys(this.book.bookAsLexia).length === 0 ? [] : [this.book.bookAsLexia]) : [];
        this.authorList = this.book ? this.book.authors : [];
        this.venueList = this.book ? this.book.venues : [];
        this.organisationList = this.book ? this.book.organisations : [];
        this.subjectList = this.book ? this.book.subjects : [];
        this.genreList = this.book ? this.book.genres : [];
    }

    submit() {
        if (this.book) {
            this.book.internalID = this.form.get("internalID").value;
            this.book.title = this.form.get("title").value;
            this.book.authors = this.authorList;
            this.book.venues = this.venueList;
            this.book.organisations = this.organisationList;
            this.book.subjects = this.subjectList;
            this.book.genres = this.genreList;
            // update request
            this.apiService.updateBook(this.book.id, this.book)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        } else {
            const newBook = {
                internalID: this.form.get("internalID").value,
                title: this.form.get("title").value,
                authors: this.authorList,
                venues: this.venueList,
                organisations: this.organisationList,
                subjects: this.subjectList,
                genres: this.genreList
            };
            // create request
            this.apiService.createBook(newBook)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
    }

    cancel() {
        this.dialogRef.close({refresh: false});
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

    addSubject() {
    }

    removeSubject(subject: Subject) {
        const index = this.subjectList.indexOf(subject);

        if (index >= 0) {
            this.subjectList.splice(index, 1);
        }
    }

    addGenre() {
    }

    removeGenre(genre: Genre) {
    }

    addLexia() {
    }

    removeLexia(lexia: Lexia) {
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).enable() : this.form.get(groupName).disable();
    }

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.book ? "Edit book" : "Create new book";
    }

    getButtonText(): string {
        return this.book ? "SAVE" : "CREATE";
    }
}

