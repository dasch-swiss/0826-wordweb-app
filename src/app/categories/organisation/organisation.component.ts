import {Component, OnInit, ViewChild} from "@angular/core";
import {Organisation} from "../../model/model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {CreateUpdateOrganisationComponent} from "./create-update-organisation/create-update-organisation.component";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: "app-organisation",
    templateUrl: "./organisation.component.html",
    styleUrls: ["../category.scss"]
})
export class OrganisationComponent implements OnInit {
    displayedColumns: string[] = ["internalID", "name", "order", "references", "action"];
    dataSource: MatTableDataSource<Organisation>;
    value: string;
    form: FormGroup;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private createOrganisationDialog: MatDialog) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalId: new FormControl("", []),
            companyTitle: new FormControl("", []),
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
        this.apiService.getOrganisations(true).subscribe((organisations) => {
            console.log(organisations);
            this.dataSource = new MatTableDataSource(organisations);
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

    editRow(organisation: Organisation) {
        this.createOrEditResource(true, organisation);
    }

    createOrEditResource(editMod: boolean, resource: Organisation = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createOrganisationDialog.open(CreateUpdateOrganisationComponent, dialogConfig);
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

