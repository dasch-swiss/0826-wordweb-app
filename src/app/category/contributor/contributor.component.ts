import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatSort, MatTableDataSource} from "@angular/material";
import {Contributor} from "../../model/model";
import {ApiService} from "../../services/apiService/api.service";

@Component({
    selector: "app-contributor",
    templateUrl: "./contributor.component.html",
    styleUrls: ["../category.component.scss"]
})
export class ContributorComponent implements OnInit {

    displayedColumns: string[] = ["firstName", "lastName", "email", "order", "references", "action"];
    dataSource: MatTableDataSource<Contributor>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

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

    openCreateContributor() {
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // dialogConfig.width = "450px";
        // this.createLexiaDialog.open(CreateContributorComponent, dialogConfig);
    }

}
