import {Component, OnInit} from "@angular/core";
import {Language} from "../../model/model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {TreeTableService} from "../../services/tree-table.service";
import {CreateUpdateGenreComponent} from "./create-update-genre/create-update-genre.component";
import {ListService} from "../../services/list.service";

@Component({
    selector: "app-genre",
    templateUrl: "./genre.component.html",
    styleUrls: ["../list.scss"]
})
export class GenreComponent implements OnInit {
    flattenTree: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "action"];
    value: string;

    constructor(private _listService: ListService,
                private _treeTableService: TreeTableService,
                private _createGenreDialog: MatDialog) {
        this.value = "";
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        const treeTable = this._treeTableService.toTreeTable(this._listService.getList("genre"));
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
        const dialogRef = this._createGenreDialog.open(CreateUpdateGenreComponent, dialogConfig);
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
