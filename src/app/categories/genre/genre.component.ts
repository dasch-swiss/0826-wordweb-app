import {Component, OnInit, ViewChild} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {Language} from "../../model/model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {TreeTableService} from "../../services/tree-table.service";
import {CreateUpdateGenreComponent} from "./create-update-genre/create-update-genre.component";
import {ListService} from "../../services/list.service";

@Component({
    selector: "app-genre",
    templateUrl: "./genre.component.html",
    styleUrls: ["./genre.component.scss"]
})
export class GenreComponent implements OnInit {
    treeTable: any[];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ["name", "references", "action"];
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private _apiService: ApiService,
                private _listService: ListService,
                private _treeTableService: TreeTableService,
                private _createGenreDialog: MatDialog) {
        this.value = "";
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this._listService.printLists();
        // console.log(this._listService.getFlattenList("genre"));
        // this.dataSource = this._listService.getFlattenList("genre");
        this._apiService.getGenre(0, true)
            .subscribe((genre) => {
                this.treeTable = this._treeTableService.toTreeTable(genre).nodes;
                this.dataSource = this.flattenTree();
            });
    }

    create() {
        this.createOrEditResource(false);
    }

    edit(language: Language) {
        this.createOrEditResource(true, language);
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
                this.dataSource.sort = this.sort;
            }
        });
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
        // return this.dataSource ? this.dataSource.filteredData.length : 0;
    }

    delete(id: number) {
        console.log(`Genre ID: ${id}`);
    }

    flattenTree(): MatTableDataSource<any> {
        const flattenTree = this.treeTable.reduce((acc, bla) => this._treeTableService.flattenTree(acc, bla), []);
        return new MatTableDataSource(flattenTree.filter(x => x.isVisible));
    }

    nodeClick(element: any) {
        element.isExpanded ? this._treeTableService.close(element) : this._treeTableService.expand(element);
        this.dataSource = this.flattenTree();
    }

}
