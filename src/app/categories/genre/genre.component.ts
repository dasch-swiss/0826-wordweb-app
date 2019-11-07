import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {Genre} from "../../model/model";
import {MatTableDataSource} from "@angular/material";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-genre",
    templateUrl: "./genre.component.html",
    styleUrls: ["./genre.component.scss"]
})
export class GenreComponent implements OnInit {
    genres: Genre[];
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
        this.apiService.getGenre(0, true)
            .subscribe((genre) => {
                this.genres = genre.nodes as Genre[];
                console.log(this.treeTable, this.genres);
                this.treeTable = this.genres.map((g) => this.treeTableService.toTreeTable(g));
                this.flattenTree();
                console.log(this.treeTable, this.genres);
            });
    }

    generateDataSource(newTree): MatTableDataSource<any> {
        return new MatTableDataSource(newTree.filter(x => x.isVisible));
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

    flattenTree() {
        const flattenTree = this.treeTable.reduce((acc, bla) => this.treeTableService.flattenTree(acc, bla), []);
        this.dataSource = this.generateDataSource(flattenTree);
    }

    nodeClick(element: any) {
        element.isExpanded ? this.treeTableService.close(element) : this.treeTableService.expand(element);
        this.flattenTree();
    }

}
