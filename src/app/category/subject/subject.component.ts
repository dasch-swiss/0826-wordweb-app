import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../../services/apiService/api.service";
import {CreateUpdateLanguageComponent} from "../../create-resource/create-update-language/create-update-language.component";
import {Subject} from "../../model/model";
import {SatPopover} from "@ncstate/sat-popover";

@Component({
    selector: "app-subject",
    templateUrl: "./subject.component.html",
    styleUrls: ["../category.component.scss"]
})
export class SubjectComponent implements OnInit {

    displayedColumns: string[] = ["name", "order", "references", "action"];
    dataSource: MatTableDataSource<Subject>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private createLanguageDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
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

    edit() {
    }

    delete() {
    }

    updateProperty(event: string | number, property: string, subject: Subject, popover: SatPopover) {
        subject[property] = event;
        this.apiService.updateSubject(subject.id, subject);
        this.resetTable();
        this.applyFilter(this.value ? this.value : "");
        popover.close();
    }

    openCreateLanguage() {
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // dialogConfig.width = "450px";
        // this.createLanguageDialog.open(CreateUpdateLanguageComponent, dialogConfig);
    }

}
