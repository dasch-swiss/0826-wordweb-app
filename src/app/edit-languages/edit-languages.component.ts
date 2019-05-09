import {Component, OnInit, ViewChild} from "@angular/core";
import {MatSort, MatTableDataSource} from "@angular/material";
import {ApiService, Language} from "../api.service";

@Component({
  selector: "app-edit-languages",
  templateUrl: "./edit-languages.component.html",
  styleUrls: ["./edit-languages.component.scss"]
})
export class EditLanguagesComponent implements OnInit {

  displayedColumns: string[] = ["language", "order", "references", "action"];
  dataSource: MatTableDataSource<Language>;
  value: string;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService) {
    this.dataSource = new MatTableDataSource(this.apiService.getLanguages());
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
