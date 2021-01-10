import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Venue} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateVenueComponent} from "./create-update-venue/create-update-venue.component";
import {FormControl, FormGroup} from "@angular/forms";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {ListService} from "../../services/list.service";
import {KnoraService} from "../../services/knora.service";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-venue",
    templateUrl: "./venue.component.html",
    styleUrls: ["../category.scss"]
})
export class VenueComponent implements OnInit {
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
    priority = 0;
    searchResults = [];

    displayedColumns: string[] = ["internalID", "name", "place", "order", "references", "action"];
    dataSource: MatTableDataSource<Venue>;
    value: string;
    form: FormGroup;
    placeVenues: any[];

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                public listService: ListService,
                private knoraService: KnoraService,
                private createVenueDialog: MatDialog,
                private treeTableService: TreeTableService) {
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

        const placeVenueNode = this.listService.getList("placeVenue").nodes
        this.placeVenues = placeVenueNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        this.resetTable();
    }

    resetSearch() {
        this.form.get("internalId").reset("");
        this.form.get("placeVenue").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
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

    search() {
        console.log("Searching starts...");

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

        this.knoraService.gravsearchQueryCount(this.myVenue, this.priority)
            .subscribe(numb => console.log("amount", numb));

        this.knoraService.gravseachQuery(this.myVenue, this.priority)
            .subscribe(data => {
                console.log("results", data);
                this.searchResults = data;
            });
    }

}
