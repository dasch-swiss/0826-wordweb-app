import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {Book} from "../../model/model";
import {AuthorRefComponent} from "../../dialog/author-ref/author-ref.component";
import {SatPopover} from "@ncstate/sat-popover";
import {VenueRefComponent} from "../../dialog/venue-ref/venue-ref.component";
import {OrganisationRefComponent} from "../../dialog/organisation-ref/organisation-ref.component";

@Component({
    selector: "app-book",
    templateUrl: "./book.component.html",
    styleUrls: ["../category.component.scss"]
})
export class BookComponent implements OnInit {

    displayedColumns: string[] = ["internalID", "title", "authors", "venues", "organisations", "order", "references", "action"];
    dataSource: MatTableDataSource<Book>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog,
                private venueDialog: MatDialog,
                private organisationDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getBooks(true));
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filterPredicate = this.customFilter;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    customFilter(book: Book, filterValue: string): boolean {
        const containsInternalID = book.internalID.indexOf(filterValue) > -1;
        const containsTitle = book.title.toLowerCase().indexOf(filterValue) > -1;
        const containsAuthorName = book.authors.filter(author => {
            const fullName = `${author.firstName} ${author.lastName}`;
            return fullName.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;
        const containsVenue = book.venues.filter(venue => {
            const fullName = `${venue.name}, ${venue.city}`;
            return fullName.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;
        const containsOrganisation = book.organisations.filter(organisation => {
            return organisation.name.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;

        return containsInternalID || containsTitle || containsAuthorName || containsVenue || containsOrganisation;
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource.filteredData.length;
    }

    edit() {
    }

    delete() {
    }

    updateProperty(event: string | number, property: string, book: Book, popover: SatPopover) {
        book[property] = event;
        this.apiService.updateBook(book.id, book);
        this.resetTable();
        this.applyFilter(this.value);
        popover.close();
    }

    editAuthor(book: Book) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: book.authors,
            editMod: true
        };
        const dialogRef = this.authorDialog.open(AuthorRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyBook = JSON.parse(JSON.stringify(book));
                copyBook.authors = data.data;
                this.apiService.updateBook(copyBook.id, copyBook);
                this.resetTable();
            }
        });
    }

    editVenue(book: Book) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: book.venues,
            editMod: true
        };
        const dialogRef = this.venueDialog.open(VenueRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyBook = JSON.parse(JSON.stringify(book));
                copyBook.venues = data.data;
                this.apiService.updateBook(copyBook.id, copyBook);
                this.resetTable();
            }
        });
    }

    editOrganisation(book: Book) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: book.organisations,
            editMod: true
        };
        const dialogRef = this.organisationDialog.open(OrganisationRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyBook = JSON.parse(JSON.stringify(book));
                copyBook.organisations = data.data;
                this.apiService.updateBook(copyBook.id, copyBook);
                this.resetTable();
            }
        });
    }

}
