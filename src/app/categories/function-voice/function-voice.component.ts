import {Component, OnInit} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {FunctionVoice} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-function-voice",
    templateUrl: "./function-voice.component.html",
    styleUrls: ["../category.scss"]
})
export class FunctionVoiceComponent implements OnInit {
    functionVoices: FunctionVoice[];
    treeTable: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "references", "action"];
    value: string;

    constructor(private apiService: ApiService,
                private treeService: TreeTableService) {
        this.value = "";
    }

    ngOnInit() {
        this.apiService.getFunctionVoice(0, true)
            .subscribe((functionVoices) => {
                this.functionVoices = functionVoices.nodes as FunctionVoice[];
                this.treeTable = this.treeService.toTreeTable(this.functionVoices);
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
