import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {Author} from "../../model/model";
import {CreateAuthorComponent} from "../../create-resource/create-author/create-author.component";
import {SatPopover} from "@ncstate/sat-popover";

@Component({
    selector: "app-author",
    templateUrl: "./author.component.html",
    styleUrls: ["../category.component.scss"]
})
export class AuthorComponent implements OnInit {

    displayedColumns: string[] = ["internalID", "firstName", "lastName", "description", "birthDate", "deathDate", "activeDate", "order", "references", "action"];
    dataSource: MatTableDataSource<Author>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(public apiService: ApiService,
                private createAuthorDialog: MatDialog) {
        this.dataSource = new MatTableDataSource(this.apiService.getAuthors());
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource.filteredData.length;
    }

    updateProperty(event: string | number, property: string, author: Author, popover: SatPopover) {
        author[property] = event;
        this.apiService.updateAuthor(author.id, author);
        this.dataSource = new MatTableDataSource(this.apiService.getAuthors());
        popover.close();
    }

    openCreateAuthor() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "450px";
        this.createAuthorDialog.open(CreateAuthorComponent, dialogConfig);
    }

}
