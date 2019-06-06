import {Component, Inject, OnInit} from "@angular/core";
import {ApiService} from "../../services/apiService/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {AuthorRefComponent} from "../../dialog/author-ref/author-ref.component";
import {VenueRefComponent} from "../../dialog/venue-ref/venue-ref.component";
import {OrganisationRefComponent} from "../../dialog/organisation-ref/organisation-ref.component";
import {Router} from "@angular/router";
import {Author, Organisation, Venue} from "../../model/model";

@Component({
    selector: "app-create-book",
    templateUrl: "./create-book.component.html",
    styleUrls: ["./create-book.component.scss"]
})
export class CreateBookComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    book: any;
    editMod: boolean;
    form: FormGroup;
    authorList: Author[];
    venueList: Venue[];
    organisationList: Organisation[];

    states: string[] = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
        "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
        "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
        "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
        "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
        "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog,
                private venueDialog: MatDialog,
                private router: Router,
                private dialogRef: MatDialogRef<CreateBookComponent>,
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
        const dialogRef = this.venueDialog.open(OrganisationRefComponent, dialogConfig);
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

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.editMod ? "Buch bearbeiten" : "Neues Buch erstellen";
    }

    getButtonText(): string {
        return this.editMod ? "SPEICHERN" : "ERSTELLEN";
    }
}
