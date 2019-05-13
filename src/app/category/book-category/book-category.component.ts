import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService, Book, Author} from "../../api.service";
import {AuthorSetComponent} from "../../author-set/author-set.component";

@Component({
    selector: "app-edit-books",
    templateUrl: "./book-category.component.html",
    styleUrls: ["./book-category.component.scss"]
})
export class BookCategoryComponent implements OnInit {

    displayedColumns: string[] = ["title", "authors", "order", "references", "action"];
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
        const dialogRef = this.authorDialog.open(AuthorSetComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
           console.log(data);
        });
    }

}
