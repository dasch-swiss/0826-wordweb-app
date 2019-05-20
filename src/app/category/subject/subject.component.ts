import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {CreateLanguageComponent} from "../../create-resource/create-language/create-language.component";
import {Subject} from "../../model/model";

@Component({
    selector: "app-subject",
    templateUrl: "./subject.component.html",
    styleUrls: ["../category.component.scss"]
})
export class SubjectComponent implements OnInit {

    displayedColumns: string[] = ["subject", "order", "references", "action"];
    dataSource: MatTableDataSource<Subject>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private createLanguageDialog: MatDialog) {
        this.dataSource = new MatTableDataSource(this.apiService.getSubjects());
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

    openCreateLanguage() {
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // dialogConfig.width = "450px";
        // this.createLanguageDialog.open(CreateLanguageComponent, dialogConfig);
    }

}