import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Author} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {SatPopover} from "@ncstate/sat-popover";
import {CreateUpdateAuthorComponent} from "./create-update-author/create-update-author.component";

@Component({
  selector: "app-author",
  templateUrl: "./author.component.html",
  styleUrls: ["./author.component.scss"]
})
export class AuthorComponent implements OnInit {

  displayedColumns: string[] = ["internalID", "firstName", "lastName", "gender", "description", "birthDate", "deathDate", "activeDate", "order", "references", "action"];
  dataSource: MatTableDataSource<Author>;
  value: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public apiService: ApiService,
              private createAuthorDialog: MatDialog) {
    this.resetTable();
  }

  resetTable() {
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

  create() {
    this.createOrEditResource(false);
  }

  edit(author: Author) {
    this.createOrEditResource(true, author);
  }

  updateProperty(event: string | number, property: string, author: Author, popover: SatPopover) {
    author[property] = event;
    this.apiService.updateAuthor(author.id, author);
    this.resetTable();
    this.applyFilter(this.value ? this.value : "");
    popover.close();
  }

  createOrEditResource(editMod: boolean, resource: Author = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    dialogConfig.data = {
      resource: resource,
      editMod: editMod,
    };
    const dialogRef = this.createAuthorDialog.open(CreateUpdateAuthorComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (data.refresh) {
        this.resetTable();
        this.dataSource.sort = this.sort;
      }
    });
  }

  delete(id: number) {
    console.log(`Author ID: ${id}`);
  }


}
