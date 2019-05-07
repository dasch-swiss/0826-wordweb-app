import {Component, OnInit, ViewChild} from "@angular/core";
import {MatSort, MatTableDataSource} from "@angular/material";
import {ApiService, Book, Author} from "../api.service";

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

  constructor(private apiService: ApiService) {
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

}
