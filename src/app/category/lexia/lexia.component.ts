import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Lexia} from "../../model/model";
import {ApiService} from "../../services/apiService/api.service";
import {CreateLanguageComponent} from "../../create-resource/create-language/create-language.component";

@Component({
    selector: "app-lexia",
    templateUrl: "./lexia.component.html",
    styleUrls: ["../category.component.scss"]
})
export class LexiaComponent implements OnInit {

    displayedColumns: string[] = ["internalID", "lexia", "order", "references", "action"];
    dataSource: MatTableDataSource<Lexia>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private createLexiaDialog: MatDialog) {
        this.dataSource = new MatTableDataSource(this.apiService.getLexias());
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

    openCreateLexia() {
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // dialogConfig.width = "450px";
        // this.createLexiaDialog.open(CreateLexiaComponent, dialogConfig);
    }

}
