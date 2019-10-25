import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Venue} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateVenueComponent} from "./create-update-venue/create-update-venue.component";

@Component({
    selector: "app-venue",
    templateUrl: "./venue.component.html",
    styleUrls: ["../category.scss"]
})
export class VenueComponent implements OnInit {
    displayedColumns: string[] = ["internalID", "name", "place", "order", "references", "action"];
    dataSource: MatTableDataSource<Venue>;
    value: string;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                private createVenueDialog: MatDialog) {
    }

    ngOnInit() {
        this.resetTable();
    }

    resetTable() {
        this.apiService.getVenues(true).subscribe((venues) => {
            this.dataSource = new MatTableDataSource(venues);
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

    edit(venue: Venue) {
        this.createOrEditResource(true, venue);
    }

    createOrEditResource(editMod: boolean, resource: Venue = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createVenueDialog.open(CreateUpdateVenueComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    delete(id: number) {
        console.log(`Venue ID: ${id}`);
    }

}
