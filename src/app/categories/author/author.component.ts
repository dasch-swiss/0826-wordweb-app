import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Author} from "../../model/model";
import {CreateUpdateAuthorComponent} from "./create-update-author/create-update-author.component";
import {KnoraService} from "../../services/knora.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ListService} from "../../services/list.service";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {Observable} from "rxjs";
import {ExportService} from "../../services/export.service";
import {IListNode} from "../../model/ListModel";

@Component({
    selector: "app-author",
    templateUrl: "./author.component.html",
    styleUrls: ["../resource.scss"]
})
export class AuthorComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    readonly PRIORITY = 0;
    readonly MAX_RESOURCE_PER_RESULT = 25;

    myAuthor: IMainClass = {
        name: "book",
        mainClass: {name: "person", variable: "author"},
        props: [
            {
                name: "isWrittenBy",
                priority: 0,
                valVar: "author",
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
                            name: "hasBirthDate",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasDeathDate",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasActiveDate",
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

    internalIDRef: IDisplayedProperty = this.myAuthor.props[0].res.props[0];
    firstNameRef: IDisplayedProperty = this.myAuthor.props[0].res.props[1];
    lastNameRef: IDisplayedProperty = this.myAuthor.props[0].res.props[2];
    descriptionRef: IDisplayedProperty = this.myAuthor.props[0].res.props[3];
    birthRef: IDisplayedProperty = this.myAuthor.props[0].res.props[4];
    deathRef: IDisplayedProperty = this.myAuthor.props[0].res.props[5];
    activeRef: IDisplayedProperty = this.myAuthor.props[0].res.props[6];
    genderRef: IDisplayedProperty = this.myAuthor.props[0].res.props[7];

    searchResults = [];
    amountResult: Observable<number>;
    searchStarted = false;

    displayedColumns: string[] = ["row", "hasPersonInternalId", "hasFirstName", "hasLastName", "hasDescription", "hasGender", "hasBirthDate", "hasDeathDate", "hasActiveDate", "action"];
    dataSource: MatTableDataSource<any>;
    value: string;
    form: FormGroup;
    genders: IListNode[];

    constructor(public listService: ListService,
                private _knoraService: KnoraService,
                private _exportService: ExportService,
                private _createAuthorDialog: MatDialog) {
    }

    static customFilter(item: any, filterValue: string): boolean {
        const containsInternalID = item.hasPersonInternalId[0].value.indexOf(filterValue) > -1;
        const containsFirstName = item.hasFirstName ? item.hasFirstName[0].value.toLowerCase().indexOf(filterValue) > -1 : false;
        const containsLastName = item.hasLastName[0].value.toLowerCase().indexOf(filterValue) > -1;
        const containsDescription = item.hasDescription[0].value.toLowerCase().indexOf(filterValue) > -1;
        const containsBirth = item.hasBirthDate ? item.hasBirthDate[0].start.toString().indexOf(filterValue) > -1 : false;
        const containsDeath = item.hasDeathDate ? item.hasDeathDate[0].start.toString().indexOf(filterValue) > -1 : false;
        const containsActive = item.hasActiveDate ? item.hasActiveDate[0].start.toString().indexOf(filterValue) > -1 : false;

        return containsInternalID || containsFirstName || containsLastName || containsDescription ||
            containsBirth || containsDeath || containsActive;
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
            case "hasBirthDate":
                return item.hasBirthDate ? item.hasBirthDate[0].start : null;
            case "hasDeathDate":
                return item.hasDeathDate ? item.hasDeathDate[0].start : null;
            case "hasActiveDate":
                return item.hasActiveDate ? item.hasActiveDate[0].start : null;
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
            birthNull: new FormControl(false, []),
            birth: new FormGroup({
                bdate: new FormControl("", [])
            }),
            deathNull: new FormControl(false, []),
            death: new FormGroup({
                ddate: new FormControl("", [])
            }),
            activeNull: new FormControl(false, []),
            active: new FormGroup({
                adate: new FormControl("", [])
            }),
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
        this.form.controls.birthNull.setValue(false);
        this.form.get("birth").enable();
        this.form.get("birth.bdate").reset("");
        this.form.controls.deathNull.setValue(false);
        this.form.get("death").enable();
        this.form.get("death.ddate").reset("");
        this.form.controls.activeNull.setValue(false);
        this.form.get("active").enable();
        this.form.get("active.adate").reset("");
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
            this.dataSource.filterPredicate = AuthorComponent.customFilter;
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    clearFilter() {
        this.dataSource.filter = this.value = "";
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(author: Author) {
        // this.createOrEditResource(true, author);
    }

    createOrEditResource(editMod: boolean, resource: Author = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource,
            editMod,
        };
        const dialogRef = this._createAuthorDialog.open(CreateUpdateAuthorComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                // TODO Refresh the table
                this.dataSource.sort = this.sort;
            }
        });
    }

    export() {
        const dataToExport = this.searchResults.map(a => {
            let author = {};
            author["ID"] = a.id;
            author["Internal ID"] = a.hasPersonInternalId[0].value;
            author["First Name"] = a.hasFirstName ? a.hasFirstName[0].value : null;
            author["Last Name"] = a.hasLastName[0].value;
            author["Description"] = a.hasDescription[0].value;
            author["Birth Date Start"] = a.hasBirthDate ? a.hasBirthDate[0].start : null;
            author["Birth Date End"] = a.hasBirthDate ? a.hasBirthDate[0].end : null;
            author["Death Date Start"] = a.hasDeathDate ? a.hasDeathDate[0].start : null;
            author["Death Date End"] = a.hasDeathDate ? a.hasDeathDate[0].end : null;
            author["Active Date Start"] = a.hasActiveDate ? a.hasActiveDate[0].start : null;
            author["Active Date End"] = a.hasActiveDate ? a.hasActiveDate[0].end : null;
            author["Gender"] = this.listService.getNameOfNode(a.hasGender[0].listNode);
            return author;
        });
        this._exportService.exportToCsv(dataToExport, "wordweb_authors");
    }

    getDateFormat(dateStart: string, dateEnd: string): string {
        return dateStart === dateEnd ? dateStart : `${dateStart}-${dateEnd}`;
    }

    search() {
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
        // Sets birth date property
        if (this.form.controls.birthNull.value) {
            this.birthRef.isNull = true;
            this.birthRef.searchVal1 = null;
        } else {
            this.birthRef.isNull = false;
            if (this.form.get("birth.bdate").value) {
                this.birthRef.searchVal1 = this.form.get("birth.bdate").value;
            } else {
                this.birthRef.searchVal1 = null;
            }
        }
        // Sets death date property
        if (this.form.controls.deathNull.value) {
            this.deathRef.isNull = true;
            this.deathRef.searchVal1 = null;
        } else {
            this.deathRef.isNull = false;
            if (this.form.get("death.ddate").value) {
                this.deathRef.searchVal1 = this.form.get("death.ddate").value;
            } else {
                this.deathRef.searchVal1 = null;
            }
        }
        // Sets active date property
        if (this.form.controls.activeNull.value) {
            this.activeRef.isNull = true;
            this.activeRef.searchVal1 = null;
        } else {
            this.activeRef.isNull = false;
            if (this.form.get("active.adate").value) {
                this.activeRef.searchVal1 = this.form.get("active.adate").value;
            } else {
                this.activeRef.searchVal1 = null;
            }
        }
        // Sets gender property
        if (this.form.get("gender").value) {
            this.genderRef.searchVal1 = this.form.get("gender").value;
        } else {
            this.genderRef.searchVal1 = null;
        }

        this.amountResult = this._knoraService.gravsearchQueryCount(this.myAuthor, this.PRIORITY);

        this._knoraService.gravseachQuery(this.myAuthor, this.PRIORITY)
            .subscribe(data => {
                this.searchResults = data;
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = AuthorComponent.customSorting;
                this.searchStarted = false;
            });
    }

    loadMoreResults() {
        this.clearFilter();
        this.searchStarted = true;

        const offset = Math.floor(this.searchResults.length / this.MAX_RESOURCE_PER_RESULT);

        this._knoraService.gravseachQuery(this.myAuthor, this.PRIORITY, offset)
            .subscribe(data => {
                this.searchResults.push(...data);
                this.dataSource = new MatTableDataSource(this.searchResults);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = AuthorComponent.customSorting;
                this.searchStarted = false;
            });
    }
}
