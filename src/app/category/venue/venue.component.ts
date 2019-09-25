import {Component, OnInit, ViewChild} from "@angular/core";
import {MatSort, MatTableDataSource} from "@angular/material";
import {Book, Venue} from "../../model/model";
import {ApiService} from "../../services/apiService/api.service";
import {SatPopover} from "@ncstate/sat-popover";

@Component({
    selector: "app-venue",
    templateUrl: "./venue.component.html",
    styleUrls: ["../category.component.scss"]
})
export class VenueComponent implements OnInit {
    displayedColumns: string[] = ["internalID", "name", "place", "order", "references", "action"];
    dataSource: MatTableDataSource<Book>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getVenues(true));
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        // this.dataSource.filterPredicate = this.customFilter;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource.filteredData.length;
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(book: Book) {
        // this.createOrEditResource(true, book);
    }

    delete(id: number) {
        console.log(`Venue ID: ${id}`);
    }

    updateProperty(event: string | number, property: string, venue: Venue, popover: SatPopover) {
        venue[property] = event;
        this.apiService.updateVenue(venue.id, venue);
        this.resetTable();
        this.applyFilter(this.value ? this.value : "");
        popover.close();
    }

}
