import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Author} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateAuthorComponent} from "./create-update-author/create-update-author.component";

@Component({
    selector: "app-author",
    templateUrl: "./author.component.html",
    styleUrls: ["../category.scss"]
})
export class AuthorComponent implements OnInit {

    displayedColumns: string[] = ["internalID", "firstName", "lastName", "gender", "description", "birthDate", "deathDate", "activeDate", "lexia", "order", "references", "action"];
    dataSource: MatTableDataSource<Author>;
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(public apiService: ApiService,
                private createAuthorDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.apiService.getAuthors(true).subscribe((authors) => {
            console.log(authors);
            this.dataSource = new MatTableDataSource(authors);
            this.dataSource.sort = this.sort;
        });

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
        this.createOrEditResource(false);
    }

    edit(author: Author) {
        this.createOrEditResource(true, author);
    }

    createOrEditResource(editMod: boolean, resource: Author = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource,
            editMod,
        };
        const dialogRef = this.createAuthorDialog.open(CreateUpdateAuthorComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    delete(id: number) {
        console.log(`Author ID: ${id}`);
    }

    getDateFormat(dateStart: string, dateEnd: string): string {
        return dateStart === dateEnd ? dateStart : `${dateStart}-${dateEnd}`;
    }
}
