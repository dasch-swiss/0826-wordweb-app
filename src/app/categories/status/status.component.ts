import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Language} from "../../model/model";
import {CreateUpdateStatusComponent} from "./create-update-status/create-update-status.component";
import {ListService} from "../../services/list.service";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-status",
    templateUrl: "./status.component.html",
    styleUrls: ["../list.scss"]
})
export class StatusComponent implements OnInit {
    flattenTree: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "action"];
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private _listService: ListService,
                private _treeTableService: TreeTableService,
                private _createStatusDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        const treeTable = this._treeTableService.toTreeTable(this._listService.getList("status"));
        this.flattenTree = this._treeTableService.flattenTree(treeTable.nodes);
        this.dataSource = new MatTableDataSource(this.flattenTree.filter(x => x.isVisible));
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
        console.log("export");
    }

    rowCount() {
        return this.dataSource ? this.dataSource.filteredData.length : 0;
    }

    nodeClick(element: any) {
        element.isExpanded ? this._treeTableService.close(element) : this._treeTableService.expand(element);
        this.dataSource = new MatTableDataSource(this.flattenTree.filter(x => x.isVisible));
    }

}
