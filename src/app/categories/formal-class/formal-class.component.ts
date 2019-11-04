import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {TreeTableService} from "../../services/tree-table.service";
import {FormalClass} from "../../model/model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: "app-formal-class",
    templateUrl: "./formal-class.component.html",
    styleUrls: ["../category.scss"]
})
export class FormalClassComponent implements OnInit {
    formalClasses: FormalClass[];
    treeTable: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "references", "action"];
    value: string;

    constructor(private apiService: ApiService,
                private treeService: TreeTableService) {
        this.value = "";
    }

    ngOnInit() {
        this.apiService.getFormalClass(0, true)
            .subscribe((formalClasses) => {
                this.formalClasses = formalClasses.nodes as FormalClass[];
                this.treeTable = this.treeService.toTreeTable(this.formalClasses);
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
