import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {Genre} from "../../model/model";
import {MatTableDataSource} from "@angular/material";

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

    constructor(private apiService: ApiService) {
        this.value = "";
    }

    // static toTreeTable(rootNode: any) {
    //     const treeTable = JSON.parse(JSON.stringify(rootNode));
    //     return treeTable.map(genre => {
    //         genre.isVisible = true;
    //         genre.isExpanded = true;
    //         return genre;
    //     });
    // }

    toTreeTable(rootNode: any) {
        const depth = 0;
        const treeTable = JSON.parse(JSON.stringify(rootNode));
        return this.traverseTree(depth, treeTable);
    }

    traverseTree(counter, treeTable) {
        treeTable.map((el) => {
            el.isVisible = true;
            el.isExpanded = true;
            el.depth = counter;
            return el.nodes.length > 0 ? this.traverseTree((counter + 1), el.nodes) : el;
        });
        return treeTable;
    }

    ngOnInit() {
        this.apiService.getGenre(0, true)
            .subscribe((genre) => {
                this.genres = genre.nodes as Genre[];
                this.treeTable = this.toTreeTable(this.genres);
                console.log(this.treeTable);
                const newTree = this.treeTable.reduce((acc, element) => this.flattenTree(acc, element), []);

                this.dataSource = new MatTableDataSource(newTree);

                console.log(newTree);
            });
    }

    flattenTree(acc, element) {
        acc.push(element);
        if (element.nodes.length > 0) {
            element.nodes.map((el) => {
                this.flattenTree(acc, el);
            });
        }
        return acc;
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
