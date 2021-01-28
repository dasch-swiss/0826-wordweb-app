import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Passage} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdatePassageComponent} from "./create-update-passage/create-update-passage.component";
import {FormControl, FormGroup} from "@angular/forms";
import {TreeTableService} from "../../services/tree-table.service";
import {KnoraService} from "../../services/knora.service";
import {ListService} from "../../services/list.service";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {Observable} from "rxjs";
import {ExportService} from "../../services/export.service";

@Component({
  selector: "app-passage",
  templateUrl: "./passage.component.html",
  styleUrls: ["../category2.scss"]
})
export class PassageComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    readonly PRIORITY = 0;
    readonly MAX_RESOURCE_PER_RESULT = 25;

    myPassage: IMainClass = {
        name: "passage",
        mainClass: {name: "passage", variable: "passage"},
        props: [
            {
                name: "hasText",
                priority: 0,
                res: null
            },
            {
                name: "hasTextHist",
                priority: 0,
                res: null
            },
            {
                name: "hasPrefixDisplayedTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasDisplayedTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasPage",
                priority: 0,
                res: null
            },
            {
                name: "hasPageHist",
                priority: 0,
                res: null
            },
            {
                name: "hasResearchField",
                priority: 0,
                res: null
            },
            {
                name: "hasFunctionVoice",
                priority: 0,
                res: null
            },
            {
                name: "hasMarking",
                priority: 0,
                res: null
            },
            {
                name: "hasStatus",
                priority: 0,
                res: null
            },
            {
                name: "hasInternalComment",
                priority: 0,
                res: null
            },
            {
                name: "hasPassageComment",
                priority: 0,
                res: null
            },
            {
                name: "occursIn",
                priority: 0,
                res: {
                    name: "book",
                    props: [
                        {
                            name: "hasPrefixBookTitle",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasBookTitle",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            },
            {
                name: "isMentionedIn",
                priority: 1,
                res: {
                    name: "passage",
                    props: [
                        {
                            name: "occursIn",
                            valVar: "sBook",
                            priority: 0,
                            res: {
                                name: "book",
                                props: [
                                    {
                                        name: "hasBookTitle",
                                        valVar: "sBookTitle",
                                        priority: 0,
                                        res: null
                                    },
                                    {
                                        name: "isWrittenBy",
                                        valVar: "sAuthor",
                                        priority: 1,
                                        res: {
                                            name: "person",
                                            props: [
                                                {
                                                    name: "hasFirstName",
                                                    valVar: "sFirstName",
                                                    priority: 1,
                                                    res: null
                                                },
                                                {
                                                    name: "hasLastName",
                                                    valVar: "sLastName",
                                                    priority: 1,
                                                    res: null
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                name: "wasContributedBy",
                priority: 1,
                res: {
                    name: "person",
                    props: [
                        {
                            name: "hasFirstName",
                            valVar: "cFirstName",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasLastName",
                            valVar: "cLastName",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            },
            {
                name: "contains",
                priority: 0,
                res: {
                    name: "lexia",
                    props: [
                        {
                            name: "hasLexiaTitle",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasLexiaDisplayedTitle",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            }
        ]
    };

    textRef: IDisplayedProperty = this.myPassage.props[0];
    textHistRef: IDisplayedProperty = this.myPassage.props[1];
    prefixDisptitleRef: IDisplayedProperty = this.myPassage.props[2];
    disptitleRef: IDisplayedProperty = this.myPassage.props[3];
    pageRef: IDisplayedProperty = this.myPassage.props[4];
    pageHistRef: IDisplayedProperty = this.myPassage.props[5];
    researchRef: IDisplayedProperty = this.myPassage.props[6];
    functionRef: IDisplayedProperty = this.myPassage.props[7];
    markingRef: IDisplayedProperty = this.myPassage.props[8];
    statusRef: IDisplayedProperty = this.myPassage.props[9];
    intCommentRef: IDisplayedProperty = this.myPassage.props[10];
    passCommentRef: IDisplayedProperty = this.myPassage.props[11];
    bookTitleRef: IDisplayedProperty = this.myPassage.props[12].res.props[1];
    secBookTitleRef: IDisplayedProperty = this.myPassage.props[13].res.props[0].res.props[0];
    contributorRef: IDisplayedProperty = this.myPassage.props[14].res.props[1];
    lexiaRef: IDisplayedProperty = this.myPassage.props[15];
    lexiaTitleRef: IDisplayedProperty = this.myPassage.props[15].res.props[0];

    searchResults = [];
    amountResult: Observable<number>;
    searchStarted = false;

    displayedColumns: string[] = ["row", "hasDisplayedTitle", "hasText", "hasTextHist", "contains", "action"];
    dataSource: MatTableDataSource<any>;
    value: string;
    form: FormGroup;
    researchFields: any[];
    functionVoices: any[];
    markings: any[];
    status: any[];

    static customFilter(item: any, filterValue: string): boolean {
        const containsDispTitle = item.hasDisplayedTitle[0].value.toLowerCase().indexOf(filterValue) > -1;
        const containsText = item.hasText[0].value.toLowerCase().indexOf(filterValue) > -1;
        const containsTextHist = item.hasTextHist ? item.hasTextHist[0].value.toLowerCase().indexOf(filterValue) > -1 : false;
        const containsLexia = item.contains ? item.contains.filter(lexia => {
            return lexia.hasLexiaTitle[0].value.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0 : false;

        return containsDispTitle || containsText || containsTextHist || containsLexia;
    }

    static customSorting(item: any, property: string) {
        switch (property) {
            case "hasDisplayedTitle":
                return item.hasDisplayedTitle[0].value;
            case "hasText":
                return item.hasText[0].value;
            case "hasTextHist":
                return item.hasTextHist ? item.hasTextHist[0].value : null;
            default:
                return item[property];
        }
    }

    constructor(private apiService: ApiService,
                private passageDialog: MatDialog,
                private editionDialog: MatDialog,
                public listService: ListService,
                private knoraService: KnoraService,
                private exportService: ExportService,
                private treeTableService: TreeTableService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            text: new FormControl("", []),
            textHistNull: new FormControl(false, []),
            textHist: new FormGroup({
                txh: new FormControl("", [])
            }),
            prefDisplayedTitleNull: new FormControl(false, []),
            prefDisplayedTitle: new FormGroup({
                prefdistit: new FormControl("", []),
            }),
            displayedTitle: new FormControl("", []),
            pageNull: new FormControl(false, []),
            page: new FormGroup({
                pg: new FormControl("", [])
            }),
            pagHistNull: new FormControl(false, []),
            pageHist: new FormGroup({
                pgh: new FormControl("", [])
            }),
            research: new FormControl("", []),
            function: new FormControl("", []),
            marking: new FormControl("", []),
            status: new FormControl("", []),
            intCommentNull: new FormControl(false, []),
            intComment: new FormGroup({
                intc: new FormControl("", [])
            }),
            passCommentNull: new FormControl(false, []),
            passComment: new FormGroup({
                pc: new FormControl("", [])
            }),
            bookTitle: new FormControl("", []),
            secBookTitleNull: new FormControl(false, []),
            secBookTitle: new FormGroup({
                secbt: new FormControl("", [])
            }),
            contributor: new FormControl("", []),
            lexiaNull: new FormControl(false, []),
            lexia: new FormGroup({
                lex: new FormControl("", [])
            }),
            // extraNull: new FormControl( false, []),
            // extra: new FormGroup({
            //     ex: new FormControl("", [])
            // })
        });

        const researchNode = this.listService.getList("researchField").nodes;
        this.researchFields = researchNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const functionNode = this.listService.getList("functionVoice").nodes;
        this.functionVoices = functionNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const markingNode = this.listService.getList("marking").nodes;
        this.markings = markingNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const statusNode = this.listService.getList("status").nodes;
        this.status = statusNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);
    }

    resetSearch() {
        this.form.get("text").reset("");
        this.form.controls.textHistNull.setValue(false);
        this.form.get("textHist").enable();
        this.form.get("textHist.txh").reset("");
        this.form.controls.prefDisplayedTitleNull.setValue(false);
        this.form.get("prefDisplayedTitle").enable();
        this.form.get("prefDisplayedTitle.prefdistit").reset("");
        this.form.controls.pageNull.setValue(false);
        this.form.get("displayedTitle").reset("");
        this.form.get("page").enable();
        this.form.get("page.pg").reset("");
        this.form.controls.pagHistNull.setValue(false);
        this.form.get("pageHist").enable();
        this.form.get("pageHist.pgh").reset("");
        this.form.get("research").reset("");
        this.form.get("function").reset("");
        this.form.get("marking").reset("");
        this.form.get("status").reset("");
        this.form.controls.intCommentNull.setValue(false);
        this.form.get("intComment").enable();
        this.form.get("intComment.intc").reset("");
        this.form.controls.passCommentNull.setValue(false);
        this.form.get("passComment").enable();
        this.form.get("passComment.pc").reset("");
        this.form.get("bookTitle").reset("");
        this.form.controls.secBookTitleNull.setValue(false);
        this.form.get("secBookTitle").enable();
        this.form.get("secBookTitle.secbt").reset("");
        this.form.get("contributor").reset("");
        this.form.controls.lexiaNull.setValue(false);
        this.form.get("lexia").enable();
        this.form.get("lexia.lex").reset("");
        // this.form.controls.extraNull.setValue(false);
        // this.form.get("extra").enable();
        // this.form.get("extra.ex").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    applyFilter(filterValue: string) {
        if (this.searchResults.length != 0) {
            this.dataSource.filterPredicate = PassageComponent.customFilter;
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    clearFilter() {
        this.dataSource.filter = this.value = "";
    }

    create() {
        // this.createOrEditResource(false);
    }

    edit(passage: Passage) {
        // this.createOrEditResource(true, passage);
    }

    createOrEditResource(editMod: boolean, resource: Passage = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource,
            editMod,
        };
        const dialogRef = this.passageDialog.open(CreateUpdatePassageComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                // TODO Refresh the table
                this.dataSource.sort = this.sort;
            }
        });
    }

    export() {
        const dataToExport = this.searchResults.map(p => {
            let passage = {};
            passage["ID"] = p.id;
            passage["Displayed Title"] = p.hasPrefixDisplayedTitle ? `${p.hasPrefixDisplayedTitle[0].value} ${p.hasDisplayedTitle[0].value}` : p.hasDisplayedTitle[0].value;
            passage["Book Title"] = p.occursIn[0].hasPrefixBookTitle ? `${p.occursIn[0].hasPrefixBookTitle[0].value} ${p.occursIn[0].hasBookTitle[0].value}` : p.occursIn[0].hasBookTitle[0].value;
            passage["Text"] = p.hasText[0].value;
            passage["Page"] = p.hasPage ? p.hasPage[0].value : null;
            passage["Text Hist."] = p.hasTextHist ? p.hasTextHist[0].value : null;
            passage["Page Hist."] = p.hasPageHist ? p.hasPageHist[0].value : null;
            passage["Lexia"] = p.contains ? p.contains.map(l => l.hasLexiaTitle[0].value).join("_") : null;
            passage["Research Field"] = this.listService.getNameOfNode(p.hasResearchField[0].listNode);
            passage["Function Voice"] = p.hasFunctionVoice.map(fv => this.listService.getNameOfNode(fv.listNode)).join("_");
            passage["Marking"] = p.hasMarking.map(m => this.listService.getNameOfNode(m.listNode)).join("_");
            passage["Status"] = this.listService.getNameOfNode(p.hasStatus[0].listNode);
            passage["Internal Comment"] = p.hasInternalComment ? p.hasInternalComment[0].value : null;
            passage["Passage Comment"] = p.hasPassageComment ? p.hasPassageComment[0].value : null
            return passage;
        });
        this.exportService.exportToCsv(dataToExport, "wordweb_passages");
    }

    search() {
        this.searchStarted = true;

        // Sets text property
        if (this.form.get("text").value) {
            this.textRef.searchVal1 = this.form.get("text").value;
        } else {
            this.textRef.searchVal1 = null;
        }
        // Sets text hist property
        if (this.form.controls.textHistNull.value) {
            this.textHistRef.isNull = true;
            this.textHistRef.searchVal1 = null;
        } else {
            this.textHistRef.isNull = false;
            if (this.form.get("textHist.txh").value) {
                this.textHistRef.searchVal1 = this.form.get("textHist.txh").value;
            } else {
                this.textHistRef.searchVal1 = null;
            }
        }
        // Sets prefix displayed title property
        if (this.form.controls.prefDisplayedTitleNull.value) {
            this.prefixDisptitleRef.isNull = true;
            this.prefixDisptitleRef.searchVal1 = null;
        } else {
            this.prefixDisptitleRef.isNull = false;
            if (this.form.get("prefDisplayedTitle.prefdistit").value) {
                this.prefixDisptitleRef.searchVal1 = this.form.get("prefDisplayedTitle.prefdistit").value;
            } else {
                this.prefixDisptitleRef.searchVal1 = null;
            }
        }
        // Sets displayed title property
        if (this.form.get("displayedTitle").value) {
            this.disptitleRef.searchVal1 = this.form.get("displayedTitle").value;
        } else {
            this.disptitleRef.searchVal1 = null;
        }
        // Sets page property
        if (this.form.controls.pageNull.value) {
            this.pageRef.isNull = true;
            this.pageRef.searchVal1 = null;
        } else {
            this.pageRef.isNull = false;
            if (this.form.get("page.pg").value) {
                this.pageRef.searchVal1 = this.form.get("page.pg").value;
            } else {
                this.pageRef.searchVal1 = null;
            }
        }
        // Sets page hist property
        if (this.form.controls.pagHistNull.value) {
            this.pageHistRef.isNull = true;
            this.pageHistRef.searchVal1 = null;
        } else {
            this.pageHistRef.isNull = false;
            if (this.form.get("pageHist.pgh").value) {
                this.pageHistRef.searchVal1 = this.form.get("pageHist.pgh").value;
            } else {
                this.pageHistRef.searchVal1 = null;
            }
        }
        // Sets research property
        if (this.form.get("research").value) {
            this.researchRef.searchVal1 = this.form.get("research").value;
        } else {
            this.researchRef.searchVal1 = null;
        }
        // Sets function property
        if (this.form.get("function").value) {
            this.functionRef.searchVal1 = this.form.get("function").value;
        } else {
            this.functionRef.searchVal1 = null;
        }
        // Sets marking property
        if (this.form.get("marking").value) {
            this.markingRef.searchVal1 = this.form.get("marking").value;
        } else {
            this.markingRef.searchVal1 = null;
        }
        // Sets status property
        if (this.form.get("status").value) {
            this.statusRef.searchVal1 = this.form.get("status").value;
        } else {
            this.statusRef.searchVal1 = null;
        }
        // Sets internal comment property
        if (this.form.controls.intCommentNull.value) {
            this.intCommentRef.isNull = true;
            this.intCommentRef.searchVal1 = null;
        } else {
            this.intCommentRef.isNull = false;
            if (this.form.get("intComment.intc").value) {
                this.intCommentRef.searchVal1 = this.form.get("intComment.intc").value;
            } else {
                this.intCommentRef.searchVal1 = null;
            }
        }
        // Sets passage comment property
        if (this.form.controls.passCommentNull.value) {
            this.passCommentRef.isNull = true;
            this.passCommentRef.searchVal1 = null;
        } else {
            this.passCommentRef.isNull = false;
            if (this.form.get("passComment.pc").value) {
                this.passCommentRef.searchVal1 = this.form.get("passComment.pc").value;
            } else {
                this.passCommentRef.searchVal1 = null;
            }
        }
        // Sets book title property
        if (this.form.get("bookTitle").value) {
            this.bookTitleRef.searchVal1 = this.form.get("bookTitle").value;
        } else {
            this.bookTitleRef.searchVal1 = null;
        }



        // Sets contributor name property
        if (this.form.get("contributor").value) {
            this.contributorRef.searchVal1 = this.form.get("contributor").value;
        } else {
            this.contributorRef.searchVal1 = null;
        }
        // Sets lexia property
        if (this.form.controls.lexiaNull.value) {
            this.lexiaRef.isNull = true;
            this.lexiaTitleRef.searchVal1 = null;
        } else {
            this.lexiaRef.isNull = false;
            if (this.form.get("lexia.lex").value) {
                this.lexiaTitleRef.searchVal1 = this.form.get("lexia.lex").value;
                this.lexiaRef.mandatory = true;
            } else {
                this.lexiaTitleRef.searchVal1 = null;
                this.lexiaRef.mandatory = false;
            }
        }

        this.amountResult = this.knoraService.gravsearchQueryCount(this.myPassage, this.PRIORITY);

        this.knoraService.gravseachQuery(this.myPassage, this.PRIORITY)
            .subscribe(data => {
                console.log("results", data);
                this.searchResults = data;
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = PassageComponent.customSorting;
                this.searchStarted = false;
            });
    }

    loadMoreResults() {
        this.clearFilter();
        this.searchStarted = true;

        const offset = Math.floor(this.searchResults.length / this.MAX_RESOURCE_PER_RESULT);

        this.knoraService.gravseachQuery(this.myPassage, this.PRIORITY, offset)
            .subscribe(data => {
                this.searchResults.push(...data);
                this.dataSource = new MatTableDataSource(this.searchResults);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = PassageComponent.customSorting;
                this.searchStarted = false;
            });
    }

}

