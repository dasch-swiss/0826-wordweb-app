import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Lexia} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateLexiaComponent} from "./create-update-lexia/create-update-lexia.component";

@Component({
    selector: "app-lexia",
    templateUrl: "./lexia.component.html",
    styleUrls: ["../category.scss"]
})
export class LexiaComponent implements OnInit {
    displayedColumns: string[] = ["internalID", "name", "order", "references", "action"];
    dataSource: MatTableDataSource<Lexia>;
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private createLexiaDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.apiService.getLexias(true).subscribe((lexias) => {
            console.log(lexias);
            this.dataSource = new MatTableDataSource(lexias);
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

    editRow(lexia: Lexia) {
        this.createOrEditResource(true, lexia);
    }

    createOrEditResource(editMod: boolean, resource: Lexia = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createLexiaDialog.open(CreateUpdateLexiaComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    deleteRow(id: number) {
    }

}
