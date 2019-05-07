import {Component, OnInit, ViewChild} from "@angular/core";
import {MatSort, MatTableDataSource} from "@angular/material";
import {ApiService, Author} from "../api.service";

@Component({
  selector: "app-edit-authors",
  templateUrl: "./edit-authors.component.html",
  styleUrls: ["./edit-authors.component.css"]
})
export class EditAuthorsComponent implements OnInit {

  displayedColumns: string[] = ["firstName", "lastName", "description", "birthDate", "deathDate", "activeDate", "order", "references", "action"];
  dataSource: MatTableDataSource<Author>;
  value: string;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService) {
    this.dataSource = new MatTableDataSource(this.apiService.getAuthors());
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

}
