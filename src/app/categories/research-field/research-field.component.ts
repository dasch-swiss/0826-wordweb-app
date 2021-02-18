import {Component, OnInit} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {ListService} from "../../services/list.service";
import {TreeTableService} from "../../services/tree-table.service";
import {ITreeTableNode} from "../../model/listModel";
import {ExportService} from "../../services/export.service";

@Component({
    selector: "app-research-field",
    templateUrl: "./research-field.component.html",
    styleUrls: ["../list.scss"]
})
export class ResearchFieldComponent implements OnInit {
    flattenTreeTable: ITreeTableNode[];
    dataSource: MatTableDataSource<ITreeTableNode>;
    displayedColumns: string[] = ["name", "action"];
    value: string;

    constructor(private _listService: ListService,
                private _exportService: ExportService,
                private _treeTableService: TreeTableService) {
        this.value = "";
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.flattenTreeTable = this._treeTableService.toTreeTableFlatten(this._listService.getList("researchField"));
        this.dataSource = new MatTableDataSource(this.flattenTreeTable.filter(x => x.isVisible));
    }

    create() {
        // ToDo
    }

    edit(element) {
        console.log(element);
    }

    formatIndentation(node: any): string {
        return "&nbsp;".repeat(node.depth * 5);
    }

    export() {
        const dataToExport = this.flattenTreeTable.map(fc => this._listService.getMinNodeInfo(fc));
        this._exportService.exportToCsv(dataToExport, "wordweb_researchField");
    }

    rowCount() {
        return this.dataSource ? this.dataSource.filteredData.length : 0;
    }

    nodeClick(element: any) {
        element.isExpanded ? this._treeTableService.close(element) : this._treeTableService.expand(element);
        this.dataSource = new MatTableDataSource(this.flattenTreeTable.filter(x => x.isVisible));
    }
}

