import {Component, OnInit, ViewChild} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {Gender} from "../../model/model";
import {MatSort} from "@angular/material/sort";
import {ApiService} from "../../services/api.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreateUpdateGenderComponent} from "./create-update-gender/create-update-gender.component";

@Component({
    selector: "app-gender",
    templateUrl: "./gender.component.html",
    styleUrls: ["../category.scss"]
})
export class GenderComponent implements OnInit {
    displayedColumns: string[] = ["name", "order", "references", "action"];
    dataSource: MatTableDataSource<Gender>;
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private createGenderDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.apiService.getGenders().subscribe((genders) => {
            console.log(genders);
            this.dataSource = new MatTableDataSource(genders);
            this.dataSource.sort = this.sort;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource ? this.dataSource.filteredData.length : 0;
    }

    create() {
        this.createOrEditResource(false);
    }

    edit(gender: Gender) {
        this.createOrEditResource(true, gender);
    }

    createOrEditResource(editMod: boolean, resource: Gender = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createGenderDialog.open(CreateUpdateGenderComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    delete(id: number) {
        console.log(`Book ID: ${id}`);
    }

}
