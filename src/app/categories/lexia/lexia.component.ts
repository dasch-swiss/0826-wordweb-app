import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Lexia} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateLexiaComponent} from "./create-update-lexia/create-update-lexia.component";
import {FormControl, FormGroup} from "@angular/forms";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {TreeTableService} from "../../services/tree-table.service";
import {ListService} from "../../services/list.service";
import {KnoraService} from "../../services/knora.service";

@Component({
    selector: "app-lexia",
    templateUrl: "./lexia.component.html",
    styleUrls: ["../category.scss"]
})
export class LexiaComponent implements OnInit {
    myLexia: IMainClass = {
        name: "lexia",
        mainClass: {name: "lexia", variable: "lexia"},
        props: [
            {
                name: "hasLexiaInternalId",
                priority: 0,
                res: null
            },
            {
                name: "hasLexiaTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasLexiaDisplayedTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasFormalClass",
                priority: 0,
                res: null
            },
            {
                name: "hasImage",
                priority: 0,
                res: null
            }
        ]
    };

    lexiaInternalIDRef: IDisplayedProperty = this.myLexia.props[0];
    lexiaTitleRef: IDisplayedProperty = this.myLexia.props[1];
    lexiaDisplayedTitleRef: IDisplayedProperty = this.myLexia.props[2];
    formalClassRef: IDisplayedProperty = this.myLexia.props[3];
    imageRef: IDisplayedProperty = this.myLexia.props[4];
    priority = 0;
    searchResults = [];

    displayedColumns: string[] = ["internalID", "name", "order", "references", "action"];
    dataSource: MatTableDataSource<Lexia>;
    value: string;
    form: FormGroup;
    formalClasses: any[];
    images: any[];

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private apiService: ApiService,
                public listService: ListService,
                private knoraService: KnoraService,
                private createLexiaDialog: MatDialog,
                private treeTableService: TreeTableService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalId: new FormControl("", []),
            lexiaTitle: new FormControl("", []),
            displayedTitleNull: new FormControl(false, []),
            displayedTitle: new FormGroup({
                distit: new FormControl("", []),
            }),
            formalClass: new FormControl("", []),
            imageNull: new FormControl(false, []),
            image: new FormGroup({
                img: new FormControl("", []),
            }),
            // extraNull: new FormControl(false, []),
            // extra: new FormGroup({
            //     ex: new FormControl("", [])
            // })
        });

        const formalClassNode = this.listService.getList("formalClass").nodes;
        this.formalClasses = formalClassNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const imageNode = this.listService.getList("image").nodes;
        this.images = imageNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        this.resetTable();
    }

    resetSearch() {
        this.form.get("internalId").reset("");
        this.form.get("lexiaTitle").reset("");
        this.form.controls.displayedTitleNull.setValue(false);
        this.form.get("displayedTitle").enable();
        this.form.get("displayedTitle.distit").reset("");
        this.form.get("formalClass").reset("");
        this.form.controls.imageNull.setValue(false);
        this.form.get("image").enable();
        this.form.get("image.img").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    resetTable() {
        this.apiService.getLexias(true).subscribe((lexias) => {
            console.log(lexias);
            this.dataSource = new MatTableDataSource(lexias);
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

    editRow(lexia: Lexia) {
        this.createOrEditResource(true, lexia);
    }

    createOrEditResource(editMod: boolean, resource: Lexia = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.createLexiaDialog.open(CreateUpdateLexiaComponent, dialogConfig);
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
            this.lexiaInternalIDRef.searchVal1 = this.form.get("internalId").value;
        } else {
            this.lexiaInternalIDRef.searchVal1 = null;
        }
        // Sets lexia title property
        if (this.form.get("lexiaTitle").value) {
            this.lexiaTitleRef.searchVal1 = this.form.get("lexiaTitle").value;
        } else {
            this.lexiaTitleRef.searchVal1 = null;
        }
        // Sets first name property
        if (this.form.controls.displayedTitleNull.value) {
            this.lexiaDisplayedTitleRef.isNull = true;
            this.lexiaDisplayedTitleRef.searchVal1 = null;
        } else {
            this.lexiaDisplayedTitleRef.isNull = false;
            if (this.form.get("displayedTitle.distit").value) {
                this.lexiaDisplayedTitleRef.searchVal1 = this.form.get("displayedTitle.distit").value;
            } else {
                this.lexiaDisplayedTitleRef.searchVal1 = null;
            }
        }
        // Sets lexia title property
        if (this.form.get("formalClass").value) {
            this.formalClassRef.searchVal1 = this.form.get("formalClass").value;
        } else {
            this.formalClassRef.searchVal1 = null;
        }
        // Sets first name property
        if (this.form.controls.imageNull.value) {
            this.imageRef.isNull = true;
            this.imageRef.searchVal1 = null;
        } else {
            this.imageRef.isNull = false;
            if (this.form.get("image.img").value) {
                this.imageRef.searchVal1 = this.form.get("image.img").value;
            } else {
                this.imageRef.searchVal1 = null;
            }
        }

        this.knoraService.gravsearchQueryCount(this.myLexia, this.priority)
            .subscribe(numb => console.log("amount", numb));

        this.knoraService.gravseachQuery(this.myLexia, this.priority)
            .subscribe(data => {
                console.log("results", data);
                this.searchResults = data;
            });
    }

}
