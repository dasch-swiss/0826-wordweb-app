import {Component, OnInit} from "@angular/core";
import {Marking} from "../../model/model";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-marking",
    templateUrl: "./marking.component.html",
    styleUrls: ["../category.scss"]
})
export class MarkingComponent implements OnInit {
    markings: Marking[];
    treeTable: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "references", "action"];
    value: string;

    constructor(private apiService: ApiService,
                private treeTableService: TreeTableService) {
        this.value = "";
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.apiService.getMarking(0, true)
            .subscribe((marking) => {
                this.markings = marking.nodes as Marking[];
                this.treeTable = this.markings.map((m) => this.treeTableService.toTreeTable(m));
                this.dataSource = this.flattenTree();
            });
    }

    edit(element) {
        console.log(element);
    }

    formatIndentation(node: any): string {
        return "&nbsp;".repeat(node.depth * 5);
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
        // ToDo
    }

    delete(id: number) {
        console.log(`Marking ID: ${id}`);
    }

    flattenTree(): MatTableDataSource<any> {
        const flattenTree = this.treeTable.reduce((acc, bla) => this.treeTableService.flattenTree(acc, bla), []);
        return new MatTableDataSource(flattenTree.filter(x => x.isVisible));
    }

    nodeClick(element: any) {
        element.isExpanded ? this.treeTableService.close(element) : this.treeTableService.expand(element);
        this.dataSource = this.flattenTree();
    }
}
