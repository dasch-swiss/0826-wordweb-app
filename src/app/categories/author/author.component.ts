import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Author} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateAuthorComponent} from "./create-update-author/create-update-author.component";
import {KnoraService} from "../../services/knora.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ListService} from "../../services/list.service";
import {TreeTableService} from "../../services/tree-table.service";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";

@Component({
    selector: "app-author",
    templateUrl: "./author.component.html",
    styleUrls: ["../category.scss"]
})
export class AuthorComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;

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

    internalIDRef: IDisplayedProperty;
    firstNameRef: IDisplayedProperty;
    lastNameRef: IDisplayedProperty;
    descriptionRef: IDisplayedProperty;
    birthRef: IDisplayedProperty;
    deathRef: IDisplayedProperty;
    activeRef: IDisplayedProperty;
    genderRef: IDisplayedProperty;

    priority = 0;

    // displayedColumns: string[] = ["internalID", "firstName", "lastName", "gender", "description", "birthDate", "deathDate", "activeDate", "lexia", "order", "references", "action"];
    displayedColumns: string[] = ["hasPersonInternalId", "hasFirstName", "hasLastName"];
    dataSource: MatTableDataSource<any>;
    value: string;
    form: FormGroup;
    genders: any[];

    constructor(public apiService: ApiService,
                private listService: ListService,
                private knoraService: KnoraService,
                private createAuthorDialog: MatDialog,
                private treeTableService: TreeTableService) {
    }

    ngOnInit() {
        this.internalIDRef = this.myAuthor.props[0].res.props[0];
        this.firstNameRef = this.myAuthor.props[0].res.props[1];
        this.lastNameRef = this.myAuthor.props[0].res.props[2];
        this.descriptionRef = this.myAuthor.props[0].res.props[3];
        this.birthRef = this.myAuthor.props[0].res.props[4];
        this.deathRef = this.myAuthor.props[0].res.props[5];
        this.activeRef = this.myAuthor.props[0].res.props[6];
        this.genderRef = this.myAuthor.props[0].res.props[7];

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
            extraNull: new FormControl(false, []),
            extra: new FormGroup({
                ex: new FormControl("", [])
            })
        });

        const genderNode = this.listService.getList("gender").nodes;
        this.genders = genderNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        this.resetTable();
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
        this.form.controls.extraNull.setValue(false);
        this.form.get("extra").enable();
        this.form.get("extra.ex").reset("");
    }

    clear(formControlName: string) {
        this.form.get(formControlName).reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    resetTable() {
        // this.apiService.getAuthors(true).subscribe((authors) => {
        //     console.log(authors);
        //     this.dataSource = new MatTableDataSource(authors);
        //     this.dataSource.sort = this.sort;
        // });

        this.knoraService.getAllAuthors()
            .subscribe(data => {
                console.log(data);
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.sort = this.sort;
            });

        this.knoraService.getAllAuthorsCount()
            .subscribe(amount => console.log(amount));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    clearFilter() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource ? this.dataSource.filteredData.length : 0;
    }

    create() {
        this.createOrEditResource(false);
    }

    edit(author: Author) {
        this.createOrEditResource(true, author);
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
        const dialogRef = this.createAuthorDialog.open(CreateUpdateAuthorComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    delete(id: number) {
        console.log(`Author ID: ${id}`);
    }

    getDateFormat(dateStart: string, dateEnd: string): string {
        return dateStart === dateEnd ? dateStart : `${dateStart}-${dateEnd}`;
    }

    search() {
        console.log("searching...");

        // Checks if nothing was filled in

        // Fills in the parameter
        if (this.form.controls.firstNameNull.value) {
            console.log("first Name is null");
            this.firstNameRef.isNull = true;
        } else {
            this.firstNameRef.isNull = false;
            console.log("first Name not null", this.form.get("firstName").value);
        }

        if (this.form.controls.birthNull.value) {
            console.log("birth is null");
            this.birthRef.isNull = true;
        } else {
            this.birthRef.isNull = false;
            console.log("birth not null", );
            if (this.form.get("birth").get("bdate").value) {
                this.birthRef.searchVal1 = this.form.get("birth").get("bdate").value;
            } else {
                this.birthRef.searchVal1 = null;
            }
        }

        this.knoraService.gravseachQuery(this.myAuthor, this.priority)
            .subscribe(data => console.log("second", data));
    }
}
