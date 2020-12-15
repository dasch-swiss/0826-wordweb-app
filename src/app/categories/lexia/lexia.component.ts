import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Lexia} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateLexiaComponent} from "./create-update-lexia/create-update-lexia.component";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: "app-lexia",
    templateUrl: "./lexia.component.html",
    styleUrls: ["../category.scss"]
})
export class LexiaComponent implements OnInit {
    displayedColumns: string[] = ["internalID", "name", "order", "references", "action"];
    dataSource: MatTableDataSource<Lexia>;
    value: string;
    form: FormGroup;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private createLexiaDialog: MatDialog) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalId: new FormControl("", []),
            lexiaTitle: new FormControl("", []),
            displayedTitleNull: new FormControl("", []),
            displayedTitle: new FormGroup({
                distit: new FormControl("", []),
            }),
            formalClass: new FormControl("", []),
            imageNull: new FormControl("", []),
            image: new FormGroup({
                img: new FormControl("", []),
            }),
            extraNull: new FormControl("", []),
            extra: new FormGroup({
                ex: new FormControl("", [])
            })
        });
        this.resetTable();
    }

    resetSearch() {
        // this.form.get("internalId").reset("");
        // this.form.get("creationDate").reset("");
        // this.form.controls.firstNameNull.setValue(false);
        // this.form.get("firstName").enable();
        // this.form.get("firstName.fn").reset("");
        // this.form.get("lastName").reset("");
        // this.form.get("description").reset("");
        // this.form.controls.birthNull.setValue(false);
        // this.form.get("birth").enable();
        // this.form.get("birth.bdate").reset("");
        // this.form.controls.deathNull.setValue(false);
        // this.form.get("death").enable();
        // this.form.get("death.ddate").reset("");
        // this.form.controls.activeNull.setValue(false);
        // this.form.get("active").enable();
        // this.form.get("active.adate").reset("");
        // this.form.controls.extraNull.setValue(false);
        // this.form.get("extra").enable();
        // this.form.get("extra.ex").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    resetTable() {
        this.apiService.getLexias(true).subscribe((lexias) => {
            console.log(lexias);
            this.dataSource = new MatTableDataSource(lexias);
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

    editRow(lexia: Lexia) {
        this.createOrEditResource(true, lexia);
    }

    createOrEditResource(editMod: boolean, resource: Lexia = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createLexiaDialog.open(CreateUpdateLexiaComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    deleteRow(id: number) {
    }

}
