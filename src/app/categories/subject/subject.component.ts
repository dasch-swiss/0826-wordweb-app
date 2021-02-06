import {Component, OnInit} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {ListService} from "../../services/list.service";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-subject",
    templateUrl: "./subject.component.html",
    styleUrls: ["../list.scss"]
})
export class SubjectComponent implements OnInit {
    flattenTree: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "action"];
    value: string;

    constructor(private _listService: ListService,
                private _treeTableService: TreeTableService) {
        this.value = "";
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        const treeTable = this._treeTableService.toTreeTable(this._listService.getList("subject"));
        this.flattenTree = this._treeTableService.flattenTree(treeTable.nodes);
        this.dataSource = new MatTableDataSource(this.flattenTree.filter(x => x.isVisible));
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
