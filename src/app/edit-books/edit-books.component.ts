import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService, Book, Author} from "../api.service";
import {DragboxComponent} from "../dragbox/dragbox.component";

@Component({
  selector: "app-edit-books",
  templateUrl: "./edit-books.component.html",
  styleUrls: ["./edit-books.component.css"]
})
export class EditBooksComponent implements OnInit {

  displayedColumns: string[] = ["title", "authors", "order", "references", "action"];
  dataSource: MatTableDataSource<Book>;
  value: string;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService,
              private testDialog: MatDialog) {
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

  open(bla: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      values: this.copyArray(bla)
    };
    this.testDialog.open(DragboxComponent, dialogConfig);
  }

}
