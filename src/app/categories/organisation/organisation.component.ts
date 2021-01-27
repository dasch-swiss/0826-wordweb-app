import {Component, OnInit, ViewChild} from "@angular/core";
import {Organisation} from "../../model/model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {CreateUpdateOrganisationComponent} from "./create-update-organisation/create-update-organisation.component";
import {FormControl, FormGroup} from "@angular/forms";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {KnoraService} from "../../services/knora.service";
import {forkJoin, Observable} from "rxjs";

@Component({
    selector: "app-organisation",
    templateUrl: "./organisation.component.html",
    styleUrls: ["../category2.scss"]
})
export class OrganisationComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    readonly PRIORITY = 0;
    readonly MAX_RESOURCE_PER_RESULT = 25;

    myCompany: IMainClass = {
        name: "company",
        mainClass: {name: "company", variable: "company"},
        props: [
            {
                name: "hasCompanyInternalId",
                priority: 0,
                res: null
            },
            {
                name: "hasCompanyTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasMember",
                priority: 0,
                res: {
                    name: "person",
                    props: [
                        {
                            name: "hasFirstName",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasLastName",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            }
        ]
    };

    internalIDRef: IDisplayedProperty = this.myCompany.props[0];
    companyTitleRef: IDisplayedProperty = this.myCompany.props[1];
    memberRef: IDisplayedProperty = this.myCompany.props[2];

    searchResults = [];
    amountResult: Observable<number>;
    searchStarted = false;

    displayedColumns: string[] = ["row", "hasCompanyInternalId", "hasCompanyTitle", "action"];
    dataSource: MatTableDataSource<any>;
    value: string;
    form: FormGroup;
    members: any[];

    static customFilter(item: any, filterValue: string): boolean {
        const containsInternalID = item.hasCompanyInternalId[0].value.indexOf(filterValue) > -1;
        const containsTitle = item.hasCompanyTitle[0].value.toLowerCase().indexOf(filterValue) > -1;

        return containsInternalID || containsTitle;
    }

    static customSorting(item: any, property: string) {
        switch (property) {
            case "hasCompanyInternalId":
                return item.hasCompanyInternalId[0].value;
            case "hasCompanyTitle":
                return item.hasCompanyTitle[0].value;
            default:
                return item[property];
        }
    }

    constructor(private apiService: ApiService,
                private knoraService: KnoraService,
                private createOrganisationDialog: MatDialog) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalId: new FormControl("", []),
            companyTitle: new FormControl("", []),
            memberNull: new FormControl(false, []),
            member: new FormGroup({
                mem: new FormControl("", [])
            }),
            // extraNull: new FormControl("", []),
            // extra: new FormGroup({
            //     ex: new FormControl("", [])
            // })
        });

        this.prepareMembers();
    }

    prepareMembers() {
        this.knoraService.getMembersCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this.knoraService.getMembers(offset));
                }

                forkJoin<any>(requests)
                    .subscribe((res: Array<Array<any>>) => {
                        this.members = []
                            .concat(...res)
                            .map(member => {
                                if (member.hasLastName.length === 1) {
                                    member.hasLastName = member.hasLastName[0].value;
                                }
                                if (member.hasFirstName.length === 1) {
                                    member.hasFirstName = member.hasFirstName[0].value;
                                }
                                return member;
                            })
                            .sort((res1, res2) => this.sortMembers(res1, res2));
                    }, error => {
                        requests.map(a => a.unsubscribe());
                    });
            });
    }

    resetSearch() {
        this.form.get("internalId").reset("");
        this.form.get("companyTitle").reset("");
        this.form.controls.memberNull.setValue(false);
        this.form.get("member").enable();
        this.form.get("member.mem").reset("");
        // this.form.controls.extraNull.setValue(false);
        // this.form.get("extra").enable();
        // this.form.get("extra.ex").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    applyFilter(filterValue: string) {
        if (this.searchResults.length != 0) {
            this.dataSource.filterPredicate = OrganisationComponent.customFilter;
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    clearFilter() {
        this.dataSource.filter = this.value = "";
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(organisation: Organisation) {
        // this.createOrEditResource(true, organisation);
    }

    createOrEditResource(editMod: boolean, resource: Organisation = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            resource,
            editMod,
        };
        const dialogRef = this.createOrganisationDialog.open(CreateUpdateOrganisationComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                // TODO Refresh the table
                this.dataSource.sort = this.sort;
            }
        });
    }

    export() {
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
        if (this.form.get("companyTitle").value) {
            this.companyTitleRef.searchVal1 = this.form.get("companyTitle").value;
        } else {
            this.companyTitleRef.searchVal1 = null;
        }
        // Sets member property
        if (this.form.controls.memberNull.value) {
            this.memberRef.isNull = true;
            this.memberRef.searchVal1 = null;
        } else {
            this.memberRef.isNull = false;
            if (this.form.get("member.mem").value) {
                this.memberRef.searchVal1 = this.form.get("member.mem").value;
            } else {
                this.memberRef.searchVal1 = null;
            }
        }

        this.amountResult = this.knoraService.gravsearchQueryCount(this.myCompany, this.PRIORITY);

        this.knoraService.gravseachQuery(this.myCompany, this.PRIORITY)
            .subscribe(data => {
                console.log("results", data);
                this.searchResults = data;
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = OrganisationComponent.customSorting;
                this.searchStarted = false;
            });
    }

    loadMoreResults() {
        this.clearFilter();
        this.searchStarted = true;

        const offset = Math.floor(this.searchResults.length / this.MAX_RESOURCE_PER_RESULT);

        this.knoraService.gravseachQuery(this.myCompany, this.PRIORITY, offset)
            .subscribe(data => {
                this.searchResults.push(...data);
                this.dataSource = new MatTableDataSource(this.searchResults);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = OrganisationComponent.customSorting;
                this.searchStarted = false;
            });
    }

    sortMembers(mem1: any, mem2: any) {
        const memberLastName1 = mem1.hasLastName.toUpperCase();
        const memberLastName2 = mem2.hasLastName.toUpperCase();

        return memberLastName1 <= memberLastName2 ? (memberLastName1 === memberLastName2 ? 0 : -1) : 1;
    }

}

