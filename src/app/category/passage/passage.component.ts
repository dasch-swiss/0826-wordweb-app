import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Book, Passage} from "../../model/model";
import {ApiService} from "../../services/apiService/api.service";
import {EditionRefComponent} from "../../dialog/edition-ref/edition-ref.component";
import {SatPopover} from "@ncstate/sat-popover";

@Component({
    selector: "app-passage",
    templateUrl: "./passage.component.html",
    styleUrls: ["../category.component.scss"]
})
export class PassageComponent implements OnInit {

    displayedColumns: string[] = ["edition", "text", "page", "order", "references", "action"];
    dataSource: MatTableDataSource<Passage>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private bookDialog: MatDialog,
                private languageDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getPassages(true));
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filterPredicate = this.customFilter;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    customFilter(passage: Passage, filterValue: string): boolean {
        const containsEdition = passage.edition.publicationInfo.toLowerCase().indexOf(filterValue) > -1;
        const containsText = passage.text.toLowerCase().indexOf(filterValue) > -1;

        return containsEdition || containsText;
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource.filteredData.length;
    }

    updateProperty(event: string | number, property: string, passage: Passage, popover: SatPopover) {
        passage[property] = event;
        this.apiService.updatePassage(passage.id, passage);
        this.resetTable();
        popover.close();
    }

    copyArray(book: Book[]) {
        return book;
    }

    editEdition(edition: any[]) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: this.copyArray(edition),
            editMod: true,
            max: 1
        };
        const dialogRef = this.languageDialog.open(EditionRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            console.log(data);
        });
    }

}
