import {Component, OnInit, ViewChild} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {Genre, Language} from "../../model/model";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {TreeTableService} from "../../services/tree-table.service";
import {CreateUpdateLanguageComponent} from "../language/create-update-language/create-update-language.component";
import {CreateUpdateGenreComponent} from "./create-update-genre/create-update-genre.component";

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

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private treeTableService: TreeTableService,
                private createGenreDialog: MatDialog) {
        this.value = "";
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.apiService.getGenre(0, true)
            .subscribe((genre) => {
                this.genres = genre.nodes as Genre[];
                this.treeTable = this.genres.map((g) => this.treeTableService.toTreeTable(g));
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
        const dialogRef = this.createGenreDialog.open(CreateUpdateGenreComponent, dialogConfig);
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
        return this.dataSource ? this.dataSource.filteredData.length : 0;
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
