import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Author, Genre, Lexia, Organisation, Subject, Venue} from "../../../model/model";
import {ApiService} from "../../../services/api.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {CustomValidators} from "../../../customValidators";
import {CategoryRefComponent} from "../../../dialog/category-ref.component";
import {TreeRefComponent} from "../../../dialog/tree-ref/tree-ref.component";

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
                private lexiaDialog: MatDialog,
                private genreDialog: MatDialog,
                private subjectDialog: MatDialog,
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

        this.lexiaList = this.book ? this.book.bookAsLexia ? [this.book.bookAsLexia] : [] : [];
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
            res: this.authorList,
            resType: "author",
            props: ["internalID", "firstName", "lastName"],
            filter: (author: Author, value: string): boolean => {
                const containsID = author.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsFirstName = author.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsLastName = author.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1;

                return containsID || containsFirstName || containsLastName;
            },
            btnTxt: "select author",
            titleTxt: "Add author",
            editMode: true
        };

        const dialogRef = this.authorDialog.open(CategoryRefComponent, dialogConfig);
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
            res: this.venueList,
            resType: "venue",
            props: ["internalID", "name", "place"],
            filter: (venue: Venue, value: string): boolean => {
                const containsID = venue.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsName = venue.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsCity = venue.place.toLowerCase().indexOf(value.toLowerCase()) > -1;

                return containsID || containsName || containsCity;
            },
            btnTxt: "select venue",
            titleTxt: "Add venue",
            editMode: true
        };

        const dialogRef = this.venueDialog.open(CategoryRefComponent, dialogConfig);
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
            res: this.organisationList,
            resType: "organisation",
            props: ["internalID", "name"],
            filter: (organisation: Organisation, value: string): boolean => {
                const containsID = organisation.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsName = organisation.name.toLowerCase().indexOf(value.toLowerCase()) > -1;

                return containsID || containsName;
            },
            btnTxt: "select company",
            titleTxt: "Add company",
            editMode: true
        };

        const dialogRef = this.organisationDialog.open(CategoryRefComponent, dialogConfig);
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
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            res: this.subjectList,
            resType: "subject",
            props: ["name"],
            btnTxt: "select subject",
            titleTxt: "Add Subject",
            editMode: true
        };

        const dialogRef = this.subjectDialog.open(TreeRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.subjectList = data.data;
            }
        });
    }

    removeSubject(subject: Subject) {
        const index = this.subjectList.indexOf(subject);

        if (index >= 0) {
            this.subjectList.splice(index, 1);
        }
    }

    addGenre() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            res: this.genreList,
            resType: "genre",
            props: ["name"],
            btnTxt: "select genre",
            titleTxt: "Add Genre",
            editMode: true
        };

        const dialogRef = this.genreDialog.open(TreeRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.genreList = data.data;
            }
        });
    }

    removeGenre(genre: Genre) {
        const index = this.genreList.indexOf(genre);

        if (index >= 0) {
            this.genreList.splice(index, 1);
        }
    }

    addLexia() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            res: this.lexiaList,
            resType: "lexia",
            props: ["internalID", "name"],
            filter: (lexia: Lexia, value: string): boolean => {
                const containsID = lexia.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsName = lexia.name.toLowerCase().indexOf(value.toLowerCase()) > -1;

                return containsID || containsName;
            },
            btnTxt: "select lexia",
            titleTxt: "Add Lexia",
            editMode: true
        };

        const dialogRef = this.lexiaDialog.open(CategoryRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.lexiaList = data.data;
            }
        });
    }

    removeLexia(lexia: Lexia) {
        const index = this.lexiaList.indexOf(lexia);

        if (index >= 0) {
            this.lexiaList.splice(index, 1);
        }
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

