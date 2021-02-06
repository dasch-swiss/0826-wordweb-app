import {Component, OnInit} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {Gender} from "../../model/model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreateUpdateGenderComponent} from "./create-update-gender/create-update-gender.component";
import {ListService} from "../../services/list.service";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-gender",
    templateUrl: "./gender.component.html",
    styleUrls: ["../list.scss"]
})
export class GenderComponent implements OnInit {
    flattenTree: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "action"];
    value: string;

    constructor(private _listService: ListService,
                private _treeTableService: TreeTableService,
                private _createGenderDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        const treeTable = this._treeTableService.toTreeTable(this._listService.getList("gender"));
        this.flattenTree = this._treeTableService.flattenTree(treeTable.nodes);
        this.dataSource = new MatTableDataSource(this.flattenTree.filter(x => x.isVisible));
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(gender: Gender) {
        // this.createOrEditResource(true, gender);
    }

    createOrEditResource(editMod: boolean, resource: Gender = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this._createGenderDialog.open(CreateUpdateGenderComponent, dialogConfig);
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
