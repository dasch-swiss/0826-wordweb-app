import {Component, OnInit, ViewChild} from "@angular/core";
import {ApiService, Organisation} from "../../api.service";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";

@Component({
  selector: "app-organisation",
  templateUrl: "./organisation.component.html",
  styleUrls: ["../category.component.scss"]
})
export class OrganisationComponent implements OnInit {

  displayedColumns: string[] = ["name", "order", "references", "action"];
  dataSource: MatTableDataSource<Organisation>;
  value: string;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService,
              private createOrganisationDialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.apiService.getOrganisations());
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

  openCreateOrganisation() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = "450px";
    // this.createOrganisationDialog.open(CreateOrganisationComponent, dialogConfig);
  }

}
