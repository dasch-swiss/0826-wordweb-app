import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Lexia} from "../../model/model";
import {CreateUpdateLexiaComponent} from "./create-update-lexia/create-update-lexia.component";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {ListService} from "../../services/list.service";
import {KnoraService} from "../../services/knora.service";
import {Observable} from "rxjs";
import {ExportService} from "../../services/export.service";
import {IListNode} from "../../model/listModel";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: "app-lexia",
    templateUrl: "./lexia.component.html",
    styleUrls: ["../resource.scss"]
})
export class LexiaComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    readonly PRIORITY = 0;
    readonly MAX_RESOURCE_PER_RESULT = 25;

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

    searchResults = [];
    amountResult: Observable<number>;
    searchStarted = false;

    displayedColumns: string[] = ["row", "hasLexiaInternalId", "hasLexiaTitle", "hasFormalClass", "action"];
    dataSource: MatTableDataSource<any>;
    value: string;
    form: UntypedFormGroup;
    formalClasses: IListNode[];
    images: IListNode[];

    constructor(public listService: ListService,
                private _spinner: NgxSpinnerService,
                private _knoraService: KnoraService,
                private _exportService: ExportService,
                private _createLexiaDialog: MatDialog) {
    }

    static customFilter(item: any, filterValue: string): boolean {
        const containsInternalID = item.hasLexiaInternalId[0].value.indexOf(filterValue) > -1;
        const containsTitle = item.hasLexiaTitle[0].value.toLowerCase().indexOf(filterValue) > -1;

        return containsInternalID || containsTitle;
    }

    static customSorting(item: any, property: string) {
        switch (property) {
            case "hasLexiaInternalId":
                return item.hasLexiaInternalId[0].value;
            case "hasLexiaTitle":
                return item.hasLexiaTitle[0].value;
            default:
                return item[property];
        }
    }

    ngOnInit() {
        this.form = new UntypedFormGroup({
            internalId: new UntypedFormControl("", []),
            lexiaTitle: new UntypedFormControl("", []),
            displayedTitleNull: new UntypedFormControl(false, []),
            displayedTitle: new UntypedFormGroup({
                distit: new UntypedFormControl("", []),
            }),
            formalClass: new UntypedFormControl("", []),
            imageNull: new UntypedFormControl(false, []),
            image: new UntypedFormGroup({
                img: new UntypedFormControl("", []),
            }),
            // extraNull: new FormControl(false, []),
            // extra: new FormGroup({
            //     ex: new FormControl("", [])
            // })
        });

        this.formalClasses = this.listService.getFlattenList("formalClass");
        this.images = this.listService.getFlattenList("image");
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
        // this.form.controls.extraNull.setValue(false);
        // this.form.get("extra").enable();
        // this.form.get("extra.ex").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    applyFilter(filterValue: string) {
        if (this.searchResults.length != 0) {
            this.dataSource.filterPredicate = LexiaComponent.customFilter;
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    clearFilter() {
        this.dataSource.filter = this.value = "";
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(lexia: Lexia) {
        // this.createOrEditResource(true, lexia);
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
        const dialogRef = this._createLexiaDialog.open(CreateUpdateLexiaComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                // TODO Refresh the table
                this.dataSource.sort = this.sort;
            }
        });
    }

    export() {
        const dataToExport = this.searchResults.map(l => {
            let lexia = {};
            lexia["ID"] = l.id;
            lexia["Internal ID"] = l.hasLexiaInternalId[0].value;
            lexia["Title"] = l.hasLexiaTitle[0].value;
            lexia["Displayed Title"] = l.hasLexiaDisplayedTitle ? l.hasLexiaDisplayedTitle[0].value : null;
            lexia["Formal Class"] = l.hasFormalClass.map(fc => this.listService.getNameOfNode(fc.listNode)).join("_");
            lexia["Image"] = l.hasImage ? l.hasImage.map(img => this.listService.getNameOfNode(img.listNode)).join("_") : null;
            return lexia;
        });
        this._exportService.exportToCsv(dataToExport, "wordweb_lexias");
    }

    search() {
        this.dataSource = null;

        this._spinner.show("spinner-big", {
            fullScreen: false,
            bdColor: "rgba(255, 255, 255, 0)",
            color: "rgb(159, 11, 11)",
            size: "medium"
        });

        this.searchStarted = true;

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

        this.amountResult = this._knoraService.gravsearchQueryCount(this.myLexia, this.PRIORITY);

        this._knoraService.gravseachQuery(this.myLexia, this.PRIORITY)
            .subscribe(data => {
                console.log("results", data);
                this.searchResults = data;
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = LexiaComponent.customSorting;
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
            size: "medium"
        });
        this.searchStarted = true;

        const offset = Math.floor(this.searchResults.length / this.MAX_RESOURCE_PER_RESULT);

        this._knoraService.gravseachQuery(this.myLexia, this.PRIORITY, offset)
            .subscribe(data => {
                this.searchResults.push(...data);
                this.dataSource = new MatTableDataSource(this.searchResults);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = LexiaComponent.customSorting;
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            }, error => {
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            });
    }

}
