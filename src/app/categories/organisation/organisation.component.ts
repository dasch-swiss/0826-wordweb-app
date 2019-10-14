import {Component, OnInit, ViewChild} from "@angular/core";
import {Organisation} from "../../model/model";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {SatPopover} from "@ncstate/sat-popover";
import {ApiService} from "../../services/api.service";
import {CreateUpdateOrganisationComponent} from "./create-update-organisation/create-update-organisation.component";

@Component({
    selector: "app-organisation",
    templateUrl: "./organisation.component.html",
    styleUrls: ["../category.scss"]
})
export class OrganisationComponent implements OnInit {
    displayedColumns: string[] = ["internalID", "name", "order", "references", "action"];
    dataSource: MatTableDataSource<Organisation>;
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private createOrganisationDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getOrganisations());
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

    delete() {
    }

    updateProperty(event: string | number, property: string, organisation: Organisation, popover: SatPopover) {
        organisation[property] = event;
        this.apiService.updateOrganisation(organisation.id, organisation);
        this.resetTable();
        this.applyFilter(this.value ? this.value : "");
        popover.close();
    }

}

