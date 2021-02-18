import {Component, OnInit} from "@angular/core";
import {Language} from "../../model/model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {TreeTableService} from "../../services/tree-table.service";
import {CreateUpdateGenreComponent} from "./create-update-genre/create-update-genre.component";
import {ListService} from "../../services/list.service";
import {ITreeTableNode} from "../../model/listModel";
import {ExportService} from "../../services/export.service";

@Component({
    selector: "app-genre",
    templateUrl: "./genre.component.html",
    styleUrls: ["../list.scss"]
})
export class GenreComponent implements OnInit {
    flattenTreeTable: ITreeTableNode[];
    dataSource: MatTableDataSource<ITreeTableNode>;
    displayedColumns: string[] = ["name", "action"];
    value: string;

    constructor(private _listService: ListService,
                private _exportService: ExportService,
                private _treeTableService: TreeTableService,
                private _createGenreDialog: MatDialog) {
        this.value = "";
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.flattenTreeTable = this._treeTableService.toTreeTableFlatten(this._listService.getList("genre"));
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
        const dataToExport = this.flattenTreeTable.map(fc => this._listService.getMinNodeInfo(fc));
        this._exportService.exportToCsv(dataToExport, "wordweb_genre");
    }

    rowCount() {
        return this.dataSource ? this.dataSource.filteredData.length : 0;
    }

    nodeClick(element: any) {
        element.isExpanded ? this._treeTableService.close(element) : this._treeTableService.expand(element);
        this.dataSource = new MatTableDataSource(this.flattenTreeTable.filter(x => x.isVisible));
    }

}
