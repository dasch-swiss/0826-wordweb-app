import {Component, OnInit, ViewChild} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Book} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateBookComponent} from "./create-update-book/create-update-book.component";

@Component({
    selector: "app-book",
    templateUrl: "./book.component.html",
    styleUrls: ["./book.component.scss"],
    animations: [
        trigger("detailExpand", [
            state("collapsed, void", style({height: "0px", minHeight: "0"})),
            state("expanded", style({height: "*"})),
            transition("expanded <=> collapsed, void => expanded", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
        ]),
    ]
})
export class BookComponent implements OnInit {
    dataSource: MatTableDataSource<Book>;
    columnsToDisplay = ["detail", "internalID", "title", "authors", "createdDate", "publishDate", "order", "references", "action"];
    expandedElements: any[] = [];
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog,
                private venueDialog: MatDialog,
                private organisationDialog: MatDialog,
                private createBookDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.apiService.getBooks(true).subscribe((books) => {
            console.log(books);
            this.dataSource = new MatTableDataSource(books);
            this.dataSource.sort = this.sort;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filterPredicate = this.customFilter;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    customFilter(book: any, filterValue: string): boolean {
        const containsInternalID = book.internalID.indexOf(filterValue) > -1;
        const containsTitle = book.title.toLowerCase().indexOf(filterValue) > -1;
        const containEdition = book.edition.toLowerCase().indexOf(filterValue) > -1;
        const containEditionHist = book.editionHist.toLowerCase().indexOf(filterValue) > -1;
        const containsAuthorName = book.authors.filter(author => {
            const fullName = `${author.firstName} ${author.lastName}`;
            return fullName.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;
        const containsVenue = book.venues.filter(venue => {
            const fullName = `${venue.name}, ${venue.place}`;
            return fullName.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;
        const containsOrganisation = book.organisations.filter(organisation => {
            return organisation.name.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;

        return containsInternalID || containsTitle || containEdition || containEditionHist || containsAuthorName || containsVenue || containsOrganisation;
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource ? this.dataSource.filteredData.length : 0;
    }

    create() {
        this.createOrEditResource(false);
    }

    edit(book: Book) {
        this.createOrEditResource(true, book);
    }

    createOrEditResource(editMod: boolean, resource: Book = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createBookDialog.open(CreateUpdateBookComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    delete(id: number) {
        console.log(`Book ID: ${id}`);
    }

    contains(obj: any, arr: any[]) {
        for (const i of arr) {
            if (JSON.stringify(obj) === JSON.stringify(i)) {
                return true;
            }
        }
        return false;
    }

    addElement(obj: any, arr: any[]) {
        arr.push(obj);
    }

    removeElement(obj: any, arr: any[]) {
        return arr.filter((element => JSON.stringify(obj) !== JSON.stringify(element)));
    }

    expansion(element) {
        this.contains(element, this.expandedElements) ? this.expandedElements = this.removeElement(element, this.expandedElements) : this.addElement(element, this.expandedElements);
    }

    getDateFormat(dateStart: string, dateEnd: string): string {
        return dateStart === dateEnd ? dateStart : `${dateStart}-${dateEnd}`;
    }

}