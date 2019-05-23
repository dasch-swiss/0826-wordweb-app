import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {Book, Author} from "../../model/model";
import {AuthorRefComponent} from "../../dialog/author-ref/author-ref.component";

@Component({
    selector: "app-book",
    templateUrl: "./book.component.html",
    styleUrls: ["../category.component.scss"]
})
export class BookComponent implements OnInit {

    displayedColumns: string[] = ["internalID", "title", "authors", "order", "references", "action"];
    dataSource: MatTableDataSource<Book>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private authorDialog: MatDialog) {
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

    editAuthor(authors: any[]) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            values: this.copyArray(authors),
            editMod: true
        };
        const dialogRef = this.authorDialog.open(AuthorRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
           console.log(data);
        });
    }

}
