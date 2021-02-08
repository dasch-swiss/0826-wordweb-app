import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Venue} from "../../model/model";
import {CreateUpdateVenueComponent} from "./create-update-venue/create-update-venue.component";
import {FormControl, FormGroup} from "@angular/forms";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {ListService} from "../../services/list.service";
import {KnoraService} from "../../services/knora.service";
import {Observable} from "rxjs";
import {ExportService} from "../../services/export.service";
import {IListNode} from "../../model/ListModel";

@Component({
    selector: "app-venue",
    templateUrl: "./venue.component.html",
    styleUrls: ["../resource.scss"]
})
export class VenueComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    readonly PRIORITY = 0;
    readonly MAX_RESOURCE_PER_RESULT = 25;

    myVenue: IMainClass = {
        name: "venue",
        mainClass: {name: "venue", variable: "venue"},
        props: [
            {
                name: "hasVenueInternalId",
                priority: 0,
                res: null
            },
            {
                name: "hasPlaceVenue",
                priority: 0,
                res: null
            }
        ]
    };

    internalIDRef: IDisplayedProperty = this.myVenue.props[0];
    placeVenueRef: IDisplayedProperty = this.myVenue.props[1];

    searchResults = [];
    amountResult: Observable<number>;
    searchStarted = false;

    displayedColumns: string[] = ["row", "hasVenueInternalId", "hasPlaceVenue", "action"];
    dataSource: MatTableDataSource<Venue>;
    value: string;
    form: FormGroup;
    placeVenues: IListNode[];

    static customFilter(item: any, filterValue: string): boolean {
        return item.hasVenueInternalId[0].value.indexOf(filterValue) > -1;
    }

    static customSorting(item: any, property: string) {
        switch (property) {
            case "hasVenueInternalId":
                return item.hasVenueInternalId[0].value;
            default:
                return item[property];
        }
    }

    constructor(public listService: ListService,
                private _knoraService: KnoraService,
                private _exportService: ExportService,
                private _createVenueDialog: MatDialog) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalId: new FormControl("", []),
            placeVenue: new FormControl("", []),
            // extraNull: new FormControl("", []),
            // extra: new FormGroup({
            //     ex: new FormControl("", [])
            // })
        });

        this.placeVenues = this.listService.getFlattenList("placeVenue");
    }

    resetSearch() {
        this.form.get("internalId").reset("");
        this.form.get("placeVenue").reset("");
        // this.form.controls.extraNull.setValue(false);
        // this.form.get("extra").enable();
        // this.form.get("extra.ex").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    applyFilter(filterValue: string) {
        if (this.searchResults.length != 0) {
            this.dataSource.filterPredicate = VenueComponent.customFilter;
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    clearFilter() {
        this.dataSource.filter = this.value = "";
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(venue: Venue) {
        // this.createOrEditResource(true, venue);
    }

    createOrEditResource(editMod: boolean, resource: Venue = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this._createVenueDialog.open(CreateUpdateVenueComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                // TODO Refresh the table
                this.dataSource.sort = this.sort;
            }
        });
    }

    export() {
        const dataToExport = this.searchResults.map(v => {
            let venue = {};
            venue["ID"] = v.id;
            venue["Internal ID"] = v.hasVenueInternalId[0].value;
            venue["Place Venue"] = this.listService.getNameOfNode(v.hasPlaceVenue[0].listNode);
            return venue;
        });
        this._exportService.exportToCsv(dataToExport, "wordweb_venues");
    }

    search() {
        this.searchStarted = true;

        // Sets internal ID property
        if (this.form.get("internalId").value) {
            this.internalIDRef.searchVal1 = this.form.get("internalId").value;
        } else {
            this.internalIDRef.searchVal1 = null;
        }
        // Sets internal ID property
        if (this.form.get("placeVenue").value) {
            this.placeVenueRef.searchVal1 = this.form.get("placeVenue").value;
        } else {
            this.placeVenueRef.searchVal1 = null;
        }

        this.amountResult = this._knoraService.gravsearchQueryCount(this.myVenue, this.PRIORITY);

        this._knoraService.gravseachQuery(this.myVenue, this.PRIORITY)
            .subscribe(data => {
                console.log("results", data);
                this.searchResults = data;
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = VenueComponent.customSorting;
                this.searchStarted = false;
            });
    }

    loadMoreResults() {
        this.clearFilter();
        this.searchStarted = true;

        const offset = Math.floor(this.searchResults.length / this.MAX_RESOURCE_PER_RESULT);

        this._knoraService.gravseachQuery(this.myVenue, this.PRIORITY, offset)
            .subscribe(data => {
                this.searchResults.push(...data);
                this.dataSource = new MatTableDataSource(this.searchResults);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = VenueComponent.customSorting;
                this.searchStarted = false;
            });
    }

}
