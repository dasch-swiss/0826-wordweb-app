import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService, Author, Edition} from "../../api.service";
import {AuthorRefComponent} from "../../dialog/author-ref/author-ref.component";

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
              private authorDialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.apiService.getEditions());
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

  editBook(books: any[]) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data = {
  //     values: this.copyArray(editions),
  //     editMod: true
  //   };
  //   const dialogRef = this.authorDialog.open(AuthorRefComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe((data) => {
  //     console.log(data);
  //   });
  }

  editLanguage(language: any) {

  }

}
