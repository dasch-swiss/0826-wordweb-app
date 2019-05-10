import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService, Book, Author} from "../api.service";
import {DragboxComponent} from "../dragbox/dragbox.component";
import {CreateBookComponent} from "../create-book/create-book.component";

@Component({
    selector: "app-edit-books",
    templateUrl: "./edit-books.component.html",
    styleUrls: ["./edit-books.component.scss"]
})
export class EditBooksComponent implements OnInit {

    displayedColumns: string[] = ["title", "authors", "order", "references", "action"];
    dataSource: MatTableDataSource<Book>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog,
                private createBookDialog: MatDialog) {
        this.dataSource = new MatTableDataSource(this.apiService.getBooks());
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource.filteredData.length;
    }

    copyArray(authors: Author[]) {
        return authors;
    }

    open(authors: any[]) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: this.copyArray(authors)
        };
        this.authorDialog.open(DragboxComponent, dialogConfig);
    }

    openCreateBook() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        // dialogConfig.width = "450px";
        this.createBookDialog.open(CreateBookComponent, dialogConfig);
    }

}
