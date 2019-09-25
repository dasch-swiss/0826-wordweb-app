import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {Book} from "../../model/model";
import {AuthorRefComponent} from "../../dialog/author-ref/author-ref.component";
import {SatPopover} from "@ncstate/sat-popover";
import {VenueRefComponent} from "../../dialog/venue-ref/venue-ref.component";
import {OrganisationRefComponent} from "../../dialog/organisation-ref/organisation-ref.component";
import {CreateUpdateBookComponent} from "../../create-resource/create-update-book/create-update-book.component";
import {animate, state, style, transition, trigger} from "@angular/animations";

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        position: 1,
        name: "Hydrogen",
        weight: 1.0079,
        symbol: "H",
        description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
    }, {
        position: 2,
        name: "Helium",
        weight: 4.0026,
        symbol: "He",
        description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
    }, {
        position: 3,
        name: "Lithium",
        weight: 6.941,
        symbol: "Li",
        description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
    }, {
        position: 4,
        name: "Beryllium",
        weight: 9.0122,
        symbol: "Be",
        description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
    }, {
        position: 5,
        name: "Boron",
        weight: 10.811,
        symbol: "B",
        description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth"s crust.`
    }, {
        position: 6,
        name: "Carbon",
        weight: 12.0107,
        symbol: "C",
        description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`
    }, {
        position: 7,
        name: "Nitrogen",
        weight: 14.0067,
        symbol: "N",
        description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
    }, {
        position: 8,
        name: "Oxygen",
        weight: 15.9994,
        symbol: "O",
        description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`
    }, {
        position: 9,
        name: "Fluorine",
        weight: 18.9984,
        symbol: "F",
        description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`
    }, {
        position: 10,
        name: "Neon",
        weight: 20.1797,
        symbol: "Ne",
        description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`
    },
];

@Component({
    selector: "app-book",
    templateUrl: "./book.component.html",
    styleUrls: ["../category.component.scss"],
    animations: [
        trigger("detailExpand", [
            state("collapsed", style({height: "0px", minHeight: "0"})),
            state("expanded", style({height: "*"})),
            transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
        ]),
    ]
})

export class BookComponent implements OnInit {
    displayedColumns: string[] = ["internalID", "title", "authors", "edition", "editionHist", "venues", "organisations", "order", "references", "action"];
    dataSource: MatTableDataSource<Book>;
    value: string;

    dataSource2 = ELEMENT_DATA;
    columnsToDisplay = ["action2", "name", "weight"];
    // columnsToDisplay = ["name", "weight", "symbol", "position", "action2"];
    expandedElement: PeriodicElement | null;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog,
                private venueDialog: MatDialog,
                private organisationDialog: MatDialog,
                private bookDialog: MatDialog) {
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
        return this.dataSource.filteredData.length;
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
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.bookDialog.open(CreateUpdateBookComponent, dialogConfig);
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

    updateProperty(event: string | number, property: string, book: Book, popover: SatPopover) {
        book[property] = event;
        this.apiService.updateBook(book.id, book);
        this.resetTable();
        this.applyFilter(this.value ? this.value : "");
        popover.close();
    }

    editAuthor(book: Book) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: book.authors,
            editMod: book.authors.length > 0
        };
        const dialogRef = this.authorDialog.open(AuthorRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyBook = JSON.parse(JSON.stringify(book));
                copyBook.authors = data.data;
                // update request
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
            list: book.venues,
            editMod: book.venues.length > 0
        };
        const dialogRef = this.venueDialog.open(VenueRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyBook = JSON.parse(JSON.stringify(book));
                copyBook.venues = data.data;
                // update request
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
            list: book.organisations,
            editMod: book.organisations.length > 0
        };
        const dialogRef = this.organisationDialog.open(OrganisationRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyBook = JSON.parse(JSON.stringify(book));
                copyBook.organisations = data.data;
                // update request
                this.apiService.updateBook(copyBook.id, copyBook);
                this.resetTable();
            }
        });
    }

}
