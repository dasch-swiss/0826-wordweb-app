import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Language} from "../../model/model";
import {CreateUpdateStatusComponent} from "./create-update-status/create-update-status.component";
import {ListService} from "../../services/list.service";
import {TreeTableService} from "../../services/tree-table.service";
import {ITreeTableNode} from "../../model/listModel";
import {ExportService} from "../../services/export.service";

@Component({
    selector: "app-status",
    templateUrl: "./status.component.html",
    styleUrls: ["../list.scss"]
})
export class StatusComponent implements OnInit {
    flattenTreeTable: ITreeTableNode[];
    dataSource: MatTableDataSource<ITreeTableNode>;
    displayedColumns: string[] = ["name", "action"];
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private _listService: ListService,
                private _exportService: ExportService,
                private _treeTableService: TreeTableService,
                private _createStatusDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.flattenTreeTable = this._treeTableService.toTreeTableFlatten(this._listService.getList("status"));
        this.dataSource = new MatTableDataSource(this.flattenTreeTable.filter(x => x.isVisible));
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(language: Language) {
        // this.createOrEditResource(true, language);
    }

    createOrEditResource(editMod: boolean, resource: Language = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this._createStatusDialog.open(CreateUpdateStatusComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
            }
        });
    }

    formatIndentation(node: any): string {
        return "&nbsp;".repeat(node.depth * 5);
    }

    export() {
        const dataToExport = this.flattenTreeTable.map(fc => this._listService.getMinNodeInfo(fc));
        this._exportService.exportToCsv(dataToExport, "wordweb_status");
    }

    rowCount() {
        return this.dataSource ? this.dataSource.filteredData.length : 0;
    }

    nodeClick(element: any) {
        element.isExpanded ? this._treeTableService.close(element) : this._treeTableService.expand(element);
        this.dataSource = new MatTableDataSource(this.flattenTreeTable.filter(x => x.isVisible));
    }

}
