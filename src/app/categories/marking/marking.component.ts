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
                private treeService: TreeTableService) {
        this.value = "";
    }

    ngOnInit() {
        this.apiService.getMarking(0, true)
            .subscribe((genre) => {
                this.markings = genre.nodes as Marking[];
                this.treeTable = this.treeService.toTreeTable(this.markings);
                const newTree = this.treeTable.reduce((acc, element) => this.treeService.flattenTree(acc, element), []);

                this.dataSource = new MatTableDataSource(newTree);
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

}
