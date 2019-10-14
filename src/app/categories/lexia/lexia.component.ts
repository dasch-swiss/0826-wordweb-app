import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Book, Lexia} from "../../model/model";
import {SatPopover} from "@ncstate/sat-popover";
import {ApiService} from "../../services/api.service";
import {CreateUpdateBookComponent} from "../book/create-update-book/create-update-book.component";
import {CreateUpdateLexiaComponent} from "./create-update-lexia/create-update-lexia.component";

@Component({
  selector: "app-lexia",
  templateUrl: "./lexia.component.html",
  styleUrls: ["./lexia.component.scss"]
})
export class LexiaComponent implements OnInit {
displayedColumns: string[] = ["internalID", "name", "order", "references", "action"];
    dataSource: MatTableDataSource<Lexia>;
    value: string;

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private apiService: ApiService,
                private createLexiaDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getLexias());
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

    editRow(lexia: Lexia) {
        this.createOrEditResource(true, lexia);
    }

    createOrEditResource(editMod: boolean, resource: Lexia = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
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

    updateProperty(event: string | number, property: string, lexia: Lexia, popover: SatPopover) {
        lexia[property] = event;
        this.apiService.updateLexia(lexia.id, lexia);
        this.resetTable();
        this.applyFilter(this.value ? this.value : "");
        popover.close();
    }

}
