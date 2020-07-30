import {Component, OnInit} from "@angular/core";
import {Image} from "../../model/model";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-image",
    templateUrl: "./image.component.html",
    styleUrls: ["../category.scss"]
})
export class ImageComponent implements OnInit {
    images: Image[];
    treeTable: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "references", "action"];
    value: string;

    constructor(private apiService: ApiService,
                private treeService: TreeTableService) {
        this.value = "";
    }

    ngOnInit() {
        this.apiService.getImage(0, true)
            .subscribe((image) => {
                this.images = image.nodes as Image[];
                this.treeTable = this.treeService.toTreeTable(this.images);
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

    create() {
        // ToDo
    }

    delete(id: number) {
        console.log(`Image ID: ${id}`);
    }

}
