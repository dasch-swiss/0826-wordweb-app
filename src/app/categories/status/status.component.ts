import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Language} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateLanguageComponent} from "../language/create-update-language/create-update-language.component";
import {CreateUpdateStatusComponent} from "./create-update-status/create-update-status.component";

@Component({
    selector: "app-status",
    templateUrl: "./status.component.html",
    styleUrls: ["../category.scss"]
})
export class StatusComponent implements OnInit {
    displayedColumns: string[] = ["name", "order", "references", "action"];
    dataSource: MatTableDataSource<Language>;
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private createStatusDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.apiService.getStatuses().subscribe((statuses) => {
            this.dataSource = new MatTableDataSource(statuses);
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

    edit(language: Language) {
        this.createOrEditResource(true, language);
    }

    createOrEditResource(editMod: boolean, resource: Language = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createStatusDialog.open(CreateUpdateStatusComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    delete(id: number) {
        console.log(`Status ID: ${id}`);
    }

}
