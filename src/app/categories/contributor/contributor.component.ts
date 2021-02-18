import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Contributor} from "../../model/model";
import {CreateUpdateContributorComponent} from "./create-update-contributor/create-update-contributor.component";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {Observable} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {IListNode} from "../../model/listModel";
import {ListService} from "../../services/list.service";
import {KnoraService} from "../../services/knora.service";
import {ExportService} from "../../services/export.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: "app-contributor",
    templateUrl: "./contributor.component.html",
    styleUrls: ["../resource.scss"]
})
export class ContributorComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    readonly PRIORITY = 0;
    readonly MAX_RESOURCE_PER_RESULT = 25;

    myContributor: IMainClass = {
        name: "passage",
        mainClass: {name: "person", variable: "contributor"},
        props: [
            {
                name: "wasContributedBy",
                priority: 0,
                res: {
                    name: "person",
                    props: [
                        {
                            name: "hasPersonInternalId",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasFirstName",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasLastName",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasDescription",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasGender",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            }
        ]
    };

    internalIDRef: IDisplayedProperty = this.myContributor.props[0].res.props[0];
    firstNameRef: IDisplayedProperty = this.myContributor.props[0].res.props[1];
    lastNameRef: IDisplayedProperty = this.myContributor.props[0].res.props[2];
    descriptionRef: IDisplayedProperty = this.myContributor.props[0].res.props[3];
    genderRef: IDisplayedProperty = this.myContributor.props[0].res.props[4];

    searchResults = [];
    amountResult: Observable<number>;
    searchStarted = false;

    displayedColumns: string[] = ["row", "hasPersonInternalId", "hasFirstName", "hasLastName", "hasDescription", "hasGender", "action"];
    dataSource: MatTableDataSource<any>;
    value: string;
    form: FormGroup;
    genders: IListNode[];

    constructor(public listService: ListService,
                private _spinner: NgxSpinnerService,
                private _knoraService: KnoraService,
                private _exportService: ExportService,
                private createContributorDialog: MatDialog) {
    }

    static customFilter(item: any, filterValue: string): boolean {
        const containsInternalID = item.hasPersonInternalId[0].value.indexOf(filterValue) > -1;
        const containsFirstName = item.hasFirstName ? item.hasFirstName[0].value.toLowerCase().indexOf(filterValue) > -1 : false;
        const containsLastName = item.hasLastName[0].value.toLowerCase().indexOf(filterValue) > -1;
        const containsDescription = item.hasDescription[0].value.toLowerCase().indexOf(filterValue) > -1;

        return containsInternalID || containsFirstName || containsLastName || containsDescription;
    }

    static customSorting(item: any, property: string) {
        switch (property) {
            case "hasPersonInternalId":
                return item.hasPersonInternalId[0].value;
            case "hasFirstName":
                return item.hasFirstName ? item.hasFirstName[0].value : null;
            case "hasLastName":
                return item.hasLastName[0].value;
            case "hasDescription":
                return item.hasDescription[0].value;
            default:
                return item[property];
        }
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalId: new FormControl("", []),
            firstNameNull: new FormControl(false, []),
            firstName: new FormGroup({
                fn: new FormControl("", []),
            }),
            lastName: new FormControl("", []),
            description: new FormControl("", []),
            gender: new FormControl("", []),
            // extraNull: new FormControl(false, []),
            // extra: new FormGroup({
            //     ex: new FormControl("", [])
            // })
        });

        this.genders = this.listService.getFlattenList("gender");
    }

    resetSearch() {
        this.form.get("internalId").reset("");
        this.form.controls.firstNameNull.setValue(false);
        this.form.get("firstName").enable();
        this.form.get("firstName.fn").reset("");
        this.form.get("lastName").reset("");
        this.form.get("description").reset("");
        this.form.get("gender").reset("");
        // this.form.controls.extraNull.setValue(false);
        // this.form.get("extra").enable();
        // this.form.get("extra.ex").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    applyFilter(filterValue: string) {
        if (this.searchResults.length != 0) {
            this.dataSource.filterPredicate = ContributorComponent.customFilter;
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    clearFilter() {
        this.dataSource.filter = this.value = "";
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(contributor: Contributor) {
        // this.createOrEditResource(true, contributor);
    }

    createOrEditResource(editMod: boolean, resource: Contributor = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createContributorDialog.open(CreateUpdateContributorComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                // TODO Refresh the table
                this.dataSource.sort = this.sort;
            }
        });
    }

    export() {
        const dataToExport = this.searchResults.map(c => {
            let contributor = {};
            contributor["ID"] = c.id;
            contributor["Internal ID"] = c.hasPersonInternalId[0].value;
            contributor["First Name"] = c.hasFirstName ? c.hasFirstName[0].value : null;
            contributor["Last Name"] = c.hasLastName[0].value;
            contributor["Description"] = c.hasDescription[0].value;
            contributor["Gender"] = this.listService.getNameOfNode(c.hasGender[0].listNode);
            return contributor;
        });
        this._exportService.exportToCsv(dataToExport, "wordweb_contributors");
    }

    search() {
        this.dataSource = null;

        this._spinner.show("spinner-big", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            type: "ball-spin-clockwise",
            size: "medium"
        });

        this.searchStarted = true;

        // Sets internal ID property
        if (this.form.get("internalId").value) {
            this.internalIDRef.searchVal1 = this.form.get("internalId").value;
        } else {
            this.internalIDRef.searchVal1 = null;
        }
        // Sets first name property
        if (this.form.controls.firstNameNull.value) {
            this.firstNameRef.isNull = true;
            this.firstNameRef.searchVal1 = null;
        } else {
            this.firstNameRef.isNull = false;
            if (this.form.get("firstName.fn").value) {
                this.firstNameRef.searchVal1 = this.form.get("firstName.fn").value;
            } else {
                this.firstNameRef.searchVal1 = null;
            }
        }
        // Sets last name property
        if (this.form.get("lastName").value) {
            this.lastNameRef.searchVal1 = this.form.get("lastName").value;
        } else {
            this.lastNameRef.searchVal1 = null;
        }
        // Sets description property
        if (this.form.get("description").value) {
            this.descriptionRef.searchVal1 = this.form.get("description").value;
        } else {
            this.descriptionRef.searchVal1 = null;
        }
        // Sets gender property
        if (this.form.get("gender").value) {
            this.genderRef.searchVal1 = this.form.get("gender").value;
        } else {
            this.genderRef.searchVal1 = null;
        }

        this.amountResult = this._knoraService.gravsearchQueryCount(this.myContributor, this.PRIORITY);

        this._knoraService.gravseachQuery(this.myContributor, this.PRIORITY)
            .subscribe(data => {
                this.searchResults = data;
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = ContributorComponent.customSorting;
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            }, error => {
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            });
    }

    loadMoreResults() {
        this.clearFilter();
        this._spinner.show("spinner-big", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            type: "ball-spin-clockwise",
            size: "medium"
        });
        this.searchStarted = true;

        const offset = Math.floor(this.searchResults.length / this.MAX_RESOURCE_PER_RESULT);

        this._knoraService.gravseachQuery(this.myContributor, this.PRIORITY, offset)
            .subscribe(data => {
                this.searchResults.push(...data);
                this.dataSource = new MatTableDataSource(this.searchResults);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = ContributorComponent.customSorting;
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            }, error => {
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            });
    }

}
