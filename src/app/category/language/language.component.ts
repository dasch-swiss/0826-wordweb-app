import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {Language} from "../../model/model";
import {CreateLanguageComponent} from "../../create-resource/create-language/create-language.component";
import {SatPopover} from "@ncstate/sat-popover";

@Component({
    selector: "app-language",
    templateUrl: "./language.component.html",
    styleUrls: ["../category.component.scss"]
})
export class LanguageComponent implements OnInit {

    displayedColumns: string[] = ["name", "order", "references", "action"];
    dataSource: MatTableDataSource<Language>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private createLanguageDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getLanguages());
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

    updateProperty(event: string | number, property: string, language: Language, popover: SatPopover) {
        language[property] = event;
        this.apiService.updateLanguage(language.id, language);
        this.resetTable();
        popover.close();
    }

    openCreateLanguage() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "450px";
        this.createLanguageDialog.open(CreateLanguageComponent, dialogConfig);
    }

}
