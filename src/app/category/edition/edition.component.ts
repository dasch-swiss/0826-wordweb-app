import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {Book, Edition} from "../../model/model";
import {BookRefComponent} from "../../dialog/book-ref/book-ref.component";
import {LanguageRefComponent} from "../../dialog/language-ref/language-ref.component";
import {SatPopover} from "@ncstate/sat-popover";

@Component({
    selector: "app-edition",
    templateUrl: "./edition.component.html",
    styleUrls: ["../category.component.scss"]
})
export class EditionComponent implements OnInit {

    displayedColumns: string[] = ["publicationInfo", "book", "language", "references", "action"];
    dataSource: MatTableDataSource<Edition>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private bookDialog: MatDialog,
                private languageDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getEditions(true));
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filterPredicate = this.customFilter;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    customFilter(edition: Edition, filterValue: string): boolean {
        const containsPublicationInfo = edition.publicationInfo.toLowerCase().indexOf(filterValue) > -1;
        const containsBook = edition.book.title.toLowerCase().indexOf(filterValue) > -1;
        const containsLanguage = edition.language.name.toLowerCase().indexOf(filterValue) > -1;

        return containsPublicationInfo || containsBook || containsLanguage;
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource.filteredData.length;
    }

    updateProperty(event: string | number, property: string, edition: Edition, popover: SatPopover) {
        edition[property] = event;
        this.apiService.updateEdition(edition.id, edition);
        this.resetTable();
        popover.close();
    }

    editBook(edition: Edition) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: [edition.book],
            editMod: true,
            max: 1
        };
        const dialogRef = this.bookDialog.open(BookRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyEdition = JSON.parse(JSON.stringify(edition));
                copyEdition.book = data.data[0];
                this.apiService.updateEdition(copyEdition.id, copyEdition);
                this.resetTable();
            }
        });
    }

    editLanguage(edition: Edition) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: [edition.language],
            editMod: true,
            max: 1
        };
        const dialogRef = this.languageDialog.open(LanguageRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyEdition = JSON.parse(JSON.stringify(edition));
                copyEdition.language = data.data[0];
                this.apiService.updateEdition(copyEdition.id, copyEdition);
                this.resetTable();
            }
        });
    }

}
