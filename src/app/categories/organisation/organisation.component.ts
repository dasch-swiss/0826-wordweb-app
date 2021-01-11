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
import {forkJoin} from "rxjs";

@Component({
    selector: "app-organisation",
    templateUrl: "./organisation.component.html",
    styleUrls: ["../category.scss"]
})
export class OrganisationComponent implements OnInit {
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
    priority = 0;
    searchResults = [];

    displayedColumns: string[] = ["internalID", "name", "order", "references", "action"];
    dataSource: MatTableDataSource<Organisation>;
    value: string;
    form: FormGroup;
    members: any[];

    @ViewChild(MatSort, {static: true}) sort: MatSort;

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

        this.resetTable();
    }

    prepareMembers() {
        this.knoraService.getMembersCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / 25);

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
            resource,
            editMod,
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

    search() {
        console.log("Searching starts...");
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

        this.knoraService.gravsearchQueryCount(this.myCompany, this.priority)
            .subscribe(numb => console.log("amount", numb));

        this.knoraService.gravseachQuery(this.myCompany, this.priority)
            .subscribe(data => {
                console.log("results", data);
                this.searchResults = data;
            });
    }

    sortMembers(mem1: any, mem2: any) {
        const memberLastName1 = mem1.hasLastName.toUpperCase();
        const memberLastName2 = mem2.hasLastName.toUpperCase();

        return memberLastName1 <= memberLastName2 ? (memberLastName1 === memberLastName2 ? 0 : -1) : 1;
    }

}

