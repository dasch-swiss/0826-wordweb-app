import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/api.service";
import { Contributor} from "../../model/model";
import {CreateUpdateContributorComponent} from "./create-update-contributor/create-update-contributor.component";

@Component({
  selector: "app-contributor",
  templateUrl: "./contributor.component.html",
  styleUrls: ["../category.scss"]
})
export class ContributorComponent implements OnInit {

    displayedColumns: string[] = ["internalID", "firstName", "lastName", "gender", "email", "order", "references", "action"];
    dataSource: MatTableDataSource<Contributor>;
    value: string;

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private apiService: ApiService,
                private createContributorDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getContributors());
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

    delete(id: number) {
    }

    create() {
      this.createOrEditResource(false);
    }

    edit(contributor: Contributor) {
        this.createOrEditResource(true, contributor);
    }

    createOrEditResource(editMod: boolean, resource: Contributor = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createContributorDialog.open(CreateUpdateContributorComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    openCreateContributor() {
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // dialogConfig.width = "450px";
        // this.createLexiaDialog.open(CreateContributorComponent, dialogConfig);
    }

}
