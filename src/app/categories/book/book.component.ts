import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Book} from "../../model/model";
import {CreateUpdateBookComponent} from "./create-update-book/create-update-book.component";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {ListService} from "../../services/list.service";
import {KnoraService} from "../../services/knora.service";
import {forkJoin, Observable} from "rxjs";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";
import {ExportService} from "../../services/export.service";
import {IListNode} from "../../model/listModel";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: "app-book",
    templateUrl: "./book.component.html",
    styleUrls: ["../resource.scss"]
})
export class BookComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    readonly PRIORITY = 0;
    readonly MAX_RESOURCE_PER_RESULT = 25;

    myBook: IMainClass = {
        name: "book",
        mainClass: {name: "book", variable: "book"},
        props: [
            {
                name: "hasBookInternalId",
                priority: 0,
                res: null
            },
            {
                name: "hasPrefixBookTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasBookTitle",
                priority: 0,
                res: null
            },
            {
                name: "hasEdition",
                priority: 0,
                res: null
            },
            {
                name: "hasEditionHist",
                priority: 0,
                res: null
            },
            {
                name: "hasLanguage",
                priority: 0,
                res: null
            },
            {
                name: "hasGenre",
                priority: 0,
                res: null
            },
            {
                name: "hasSubject",
                priority: 0,
                res: null
            },
            {
                name: "hasCreationDate",
                priority: 0,
                res: null
            },
            {
                name: "hasPublicationDate",
                priority: 0,
                res: null
            },
            {
                name: "hasFirstPerformanceDate",
                priority: 0,
                res: null
            },
            {
                name: "hasBookComment",
                priority: 0,
                res: null
            },
            {
                name: "isWrittenBy",
                priority: 0,
                res: {
                    name: "person",
                    props: [
                        {
                            name: "hasFirstName",
                            priority: 0,
                            mandatory: true,
                            res: null
                        },
                        {
                            name: "hasLastName",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            },
            {
                name: "performedBy",
                priority: 1,
                res: {
                    name: "company",
                    props: [
                        {
                            name: "hasCompanyTitle",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            },
            {
                name: "performedByActor",
                priority: 1,
                res: {
                    name: "person",
                    props: [
                        {
                            name: "hasFirstName",
                            valVar: "aHasFirstName",
                            priority: 0,
                            res: null
                        },
                        {
                            name: "hasLastName",
                            valVar: "aHasLastname",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            },
            {
                name: "performedIn",
                priority: 1,
                res: {
                    name: "venue",
                    props: [
                        {
                            name: "hasPlaceVenue",
                            priority: 0,
                            res: null
                        }
                    ]
                }
            }
        ]
    };

    bookInternalIDRef: IDisplayedProperty = this.myBook.props[0];
    prefixBookTitleRef: IDisplayedProperty = this.myBook.props[1];
    bookTitleRef: IDisplayedProperty = this.myBook.props[2];
    editionRef: IDisplayedProperty = this.myBook.props[3];
    editionHistRef: IDisplayedProperty = this.myBook.props[4];
    languageRef: IDisplayedProperty = this.myBook.props[5];
    genreRef: IDisplayedProperty = this.myBook.props[6];
    subjectRef: IDisplayedProperty = this.myBook.props[7];
    creationRef: IDisplayedProperty = this.myBook.props[8];
    publicationRef: IDisplayedProperty = this.myBook.props[9];
    firstPerformanceRef: IDisplayedProperty = this.myBook.props[10];
    bookCommentRef: IDisplayedProperty = this.myBook.props[11];
    authorLastNameRef: IDisplayedProperty = this.myBook.props[12].res.props[1];
    companyRef: IDisplayedProperty = this.myBook.props[13];
    actorRef: IDisplayedProperty = this.myBook.props[14];
    venueRef: IDisplayedProperty = this.myBook.props[15];

    searchResults = [];
    amountResult: Observable<number>;
    searchStarted = false;

    displayedColumns: string[] = ["row", "hasBookInternalId", "hasPrefixBookTitle", "hasBookTitle", "isWrittenBy", "hasEdition", "hasCreationDate", "action"];
    dataSource: MatTableDataSource<any>;

    value: string;
    form: UntypedFormGroup;
    languages: IListNode[];
    genres: IListNode[];
    subjects: IListNode[];
    companies: any[];
    venues: any[];
    actors: any[];

    constructor(public listService: ListService,
                private _spinner: NgxSpinnerService,
                private _knoraService: KnoraService,
                private _authorDialog: MatDialog,
                private _venueDialog: MatDialog,
                private _exportService: ExportService,
                private _organisationDialog: MatDialog,
                private _createBookDialog: MatDialog) {
    }

    static customFilter(item: any, filterValue: string): boolean {
        const containsInternalID = item.hasBookInternalId[0].value.indexOf(filterValue) > -1;
        const containsPrefix = item.hasPrefixBookTitle ? item.hasPrefixBookTitle[0].value.toLowerCase().indexOf(filterValue) > -1 : false;
        const containsTitle = item.hasBookTitle[0].value.toLowerCase().indexOf(filterValue) > -1;
        const containEdition = item.hasEdition[0].value.toLowerCase().indexOf(filterValue) > -1;
        const containsCreation = item.hasCreationDate ? item.hasCreationDate[0].start.toString().indexOf(filterValue) > -1 : false;
        const containsAuthorName = item.isWrittenBy.filter(author => {
            const containsFirstName = author.hasFirstName ? author.hasFirstName[0].value.toLowerCase().indexOf(filterValue) > -1 : false;
            const containsLastName = author.hasLastName[0].value.toLowerCase().indexOf(filterValue) > -1;
            return containsFirstName || containsLastName;
        }).length > 0;

        return containsInternalID || containsPrefix || containsTitle || containEdition || containsCreation || containsAuthorName;
    }

    static customSorting(item: any, property: string) {
        switch (property) {
            case "hasBookInternalId":
                return item.hasBookInternalId[0].value;
            case "hasPrefixBookTitle":
                return item.hasPrefixBookTitle ? item.hasPrefixBookTitle[0].value : null;
            case "hasBookTitle":
                return item.hasBookTitle[0].value;
            case "hasEdition":
                return item.hasEdition[0].value;
            case "hasCreationDate":
                return item.hasCreationDate[0].start;
            default:
                return item[property];
        }
    }

    ngOnInit() {
        this.form = new UntypedFormGroup({
            internalId: new UntypedFormControl("", []),
            prefBookTitleNull: new UntypedFormControl(false, []),
            prefBookTitle: new UntypedFormGroup({
                prefbt: new UntypedFormControl("", []),
            }),
            bookTitle: new UntypedFormControl("", []),
            edition: new UntypedFormControl("", []),
            editionHistNull: new UntypedFormControl(false, []),
            editionHist: new UntypedFormGroup({
                eh: new UntypedFormControl("", []),
            }),
            language: new UntypedFormControl("", []),
            genre: new UntypedFormControl("", []),
            subjectNull: new UntypedFormControl(false, []),
            subject: new UntypedFormGroup({
                sub: new UntypedFormControl("", []),
            }),
            creationDate: new UntypedFormControl("", []),
            publicNull: new UntypedFormControl(false, []),
            public: new UntypedFormGroup({
                pdate: new UntypedFormControl("", [])
            }),
            firstPerNull: new UntypedFormControl(false, []),
            firstPer: new UntypedFormGroup({
                fpdate: new UntypedFormControl("", [])
            }),
            bookCommentNull: new UntypedFormControl(false, []),
            bookComment: new UntypedFormGroup({
                bc: new UntypedFormControl("", [])
            }),
            authorName: new UntypedFormControl("", []),
            performedNull: new UntypedFormControl(false, []),
            performed: new UntypedFormGroup({
                perf: new UntypedFormControl("", [])
            }),
            performedActorNull: new UntypedFormControl(false, []),
            performedActor: new UntypedFormGroup({
                perfA: new UntypedFormControl("", [])
            }),
            performedInNull: new UntypedFormControl(false, []),
            performedIn: new UntypedFormGroup({
                perfI: new UntypedFormControl("", [])
            }),
            // extraNull: new FormControl(false, []),
            // extra: new FormGroup({
            //     ex: new FormControl("", [])
            // })
        });

        this.languages = this.listService.getFlattenList("language");
        this.genres = this.listService.getFlattenList("genre");
        this.subjects = this.listService.getFlattenList("subject");

        this.prepareCompanies();
        this.prepareVenues();
        this.prepareActors();
    }

    prepareCompanies() {
        this._knoraService.getCompaniesCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this._knoraService.getCompanies(offset));
                }

                forkJoin<any>(requests)
                    .subscribe((res: Array<Array<any>>) => {
                        this.companies = []
                            .concat(...res)
                            .map(company => {
                                if (company.hasCompanyTitle.length === 1) {
                                    company.hasCompanyTitle = company.hasCompanyTitle[0].value;
                                    return company;
                                }
                            })
                            .sort((res1, res2) => this.sortCompanies(res1, res2));
                    }, error => {
                        requests.map(a => a.unsubscribe());
                    });
            });
    }

    prepareVenues() {
        this._knoraService.getVenuesCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this._knoraService.getVenues(offset));
                }

                forkJoin<any>(requests)
                    .subscribe((res: Array<Array<any>>) => {
                        this.venues = []
                            .concat(...res)
                            .map(venue => {
                                if (venue.hasPlaceVenue.length === 1) {
                                    venue.value = this.listService.getNameOfNode(venue.hasPlaceVenue[0].listNode);
                                    venue.hasPlaceVenue = venue.hasPlaceVenue[0].listNode;
                                    return venue;
                                }
                            })
                            .sort((res1, res2) => this.sortVenues(res1, res2));
                    }, error => {
                        requests.map(a => a.unsubscribe());
                    });
            });
    }

    prepareActors() {
        this._knoraService.getActorsCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / this.MAX_RESOURCE_PER_RESULT);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this._knoraService.getActors(offset));
                }

                forkJoin<any>(requests)
                    .subscribe((res: Array<Array<any>>) => {
                        this.actors = []
                            .concat(...res)
                            .map(actor => {
                                if (actor.hasLastName.length === 1) {
                                    actor.hasLastName = actor.hasLastName[0].value;
                                }
                                if (actor.hasFirstName.length === 1) {
                                    actor.hasFirstName = actor.hasFirstName[0].value;
                                }
                                return actor;
                            })
                            .sort((res1, res2) => this.sortActors(res1, res2));
                    }, error => {
                        requests.map(a => a.unsubscribe());
                    });
            });
    }

    resetSearch() {
        this.form.get("internalId").reset("");
        this.form.controls.prefBookTitleNull.setValue(false);
        this.form.get("prefBookTitle").enable();
        this.form.get("prefBookTitle.prefbt").reset("");
        this.form.get("bookTitle").reset("");
        this.form.get("edition").reset("");
        this.form.controls.editionHistNull.setValue(false);
        this.form.get("editionHist").enable();
        this.form.get("editionHist.eh").reset("");
        this.form.get("language").reset("");
        this.form.get("genre").reset("");
        this.form.controls.subjectNull.setValue(false);
        this.form.get("subject").enable();
        this.form.get("subject.sub").reset("");
        this.form.get("creationDate").reset("");
        this.form.controls.publicNull.setValue(false);
        this.form.get("public").enable();
        this.form.get("public.pdate").reset("");
        this.form.controls.firstPerNull.setValue(false);
        this.form.get("firstPer").enable();
        this.form.get("firstPer.fpdate").reset("");
        this.form.controls.bookCommentNull.setValue(false);
        this.form.get("bookComment").enable();
        this.form.get("bookComment.bc").reset("");
        this.form.get("authorName").reset("");
        this.form.controls.performedNull.setValue(false);
        this.form.get("performed").enable();
        this.form.get("performed.perf").reset("");
        this.form.controls.performedActorNull.setValue(false);
        this.form.get("performedActor").enable();
        this.form.get("performedActor.perfA").reset("");
        this.form.controls.performedInNull.setValue(false);
        this.form.get("performedIn").enable();
        this.form.get("performedIn.perfI").reset("");
        // this.form.controls.extraNull.setValue(false);
        // this.form.get("extra").enable();
        // this.form.get("extra.ex").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    applyFilter(filterValue: string) {
        if (this.searchResults.length != 0) {
            this.dataSource.filterPredicate = BookComponent.customFilter;
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }

    clearFilter() {
        this.dataSource.filter = this.value = "";
    }

    create() {
        this.createOrEditResource(false);
    }

    edit(book: Book) {
        this.createOrEditResource(true, book);
    }

    createOrEditResource(editMod: boolean, resource: Book = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource,
            editMod,
        };
        const dialogRef = this._createBookDialog.open(CreateUpdateBookComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                // TODO Refresh the table
                this.dataSource.sort = this.sort;
            }
        });
    }

    export() {
        const dataToExport = this.searchResults.map(b => {
            let book = {};
            book["ID"] = b.id;
            book["Internal ID"] = b.hasBookInternalId[0].value;
            book["Title"] = b.hasPrefixBookTitle ? `${b.hasPrefixBookTitle[0].value} ${b.hasBookTitle[0].value}` : b.hasBookTitle[0].value;
            book["Author"] = b.isWrittenBy.map(a => a.hasFirstName ? `${a.hasFirstName[0].value} ${a.hasLastName[0].value}` : `${a.hasLastName[0].value}`).join("_");
            book["Edition"] = b.hasEdition[0].value;
            book["Edition Hist."] = b.hasEditionHist ? b.hasEditionHist[0].value : null;
            book["Language"] = this.listService.getNameOfNode(b.hasLanguage[0].listNode);
            book["Genre"] = b.hasGenre.map(genre => this.listService.getNameOfNode(genre.listNode)).join("_");
            book["Subject"] = b.hasSubject ? b.hasSubject.map(s => this.listService.getNameOfNode(s.listNode)).join("_") : null;
            book["Creation Date Start"] = b.hasCreationDate ? b.hasCreationDate[0].start : null;
            book["Creation Date End"] = b.hasCreationDate ? b.hasCreationDate[0].end : null;
            book["Publication Date Start"] = b.hasPublicationDate ? b.hasPublicationDate[0].start : null;
            book["Publication Date End"] = b.hasPublicationDate ? b.hasPublicationDate[0].end : null;
            book["First Performance Date Start"] = b.hasFirstPerformanceDate ? b.hasFirstPerformanceDate[0].start : null;
            book["First Performance Date End"] = b.hasFirstPerformanceDate ? b.hasFirstPerformanceDate[0].end : null;
            book["Book Comment"] = b.hasBookComment ? b.hasBookComment[0].value : null;
            // TODO Following data were not fetched in the search and are therefore not available for export
            // book["Performed By"] = b.performedBy ? b.performedBy.map(c => c.hasCompanyTitle[0].value).join("_") : null;
            // book["Performed By Actor"] = b.performedByActor ? b.performedByActor.map(a => a.hasFirstName ? `${a.hasFirstName[0].value} ${a.hasLastName[0].value}` : `${a.hasLastName[0].value}`).join("_") : null;
            // book["Performed In"] = b.performedIn ? b.performedIn.map(v => this.listService.getNameOfNode(v.hasPlaceVenue[0].listNode)).join("_") : null;
            return book;
        });
        this._exportService.exportToCsv(dataToExport, "wordweb_books");
    }

    getDateFormat(dateStart: string, dateEnd: string): string {
        return dateStart === dateEnd ? dateStart : `${dateStart}-${dateEnd}`;
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
            this.bookInternalIDRef.searchVal1 = this.form.get("internalId").value;
        } else {
            this.bookInternalIDRef.searchVal1 = null;
        }
        // Sets first name property
        if (this.form.controls.prefBookTitleNull.value) {
            this.prefixBookTitleRef.isNull = true;
            this.prefixBookTitleRef.searchVal1 = null;
        } else {
            this.prefixBookTitleRef.isNull = false;
            if (this.form.get("prefBookTitle.prefbt").value) {
                this.prefixBookTitleRef.searchVal1 = this.form.get("prefBookTitle.prefbt").value;
            } else {
                this.prefixBookTitleRef.searchVal1 = null;
            }
        }
        // Sets book title property
        if (this.form.get("bookTitle").value) {
            this.bookTitleRef.searchVal1 = this.form.get("bookTitle").value;
        } else {
            this.bookTitleRef.searchVal1 = null;
        }
        // Sets edition property
        if (this.form.get("edition").value) {
            this.editionRef.searchVal1 = this.form.get("edition").value;
        } else {
            this.editionRef.searchVal1 = null;
        }
        // Sets edition hist property
        if (this.form.controls.editionHistNull.value) {
            this.editionHistRef.isNull = true;
            this.editionHistRef.searchVal1 = null;
        } else {
            this.editionHistRef.isNull = false;
            if (this.form.get("editionHist.eh").value) {
                this.editionHistRef.searchVal1 = this.form.get("editionHist.eh").value;
            } else {
                this.editionHistRef.searchVal1 = null;
            }
        }
        // Sets language property
        if (this.form.get("language").value) {
            this.languageRef.searchVal1 = this.form.get("language").value;
        } else {
            this.languageRef.searchVal1 = null;
        }
        // Sets genre property
        if (this.form.get("genre").value) {
            this.genreRef.searchVal1 = this.form.get("genre").value;
        } else {
            this.genreRef.searchVal1 = null;
        }
        // Sets subject property
        if (this.form.controls.subjectNull.value) {
            this.subjectRef.isNull = true;
            this.subjectRef.searchVal1 = null;
        } else {
            this.subjectRef.isNull = false;
            if (this.form.get("subject.sub").value) {
                this.subjectRef.searchVal1 = this.form.get("subject.sub").value;
            } else {
                this.subjectRef.searchVal1 = null;
            }
        }
        // Sets creation date property
        if (this.form.get("creationDate").value) {
            this.creationRef.searchVal1 = this.form.get("creationDate").value;
        } else {
            this.creationRef.searchVal1 = null;
        }
        // Sets publication date property
        if (this.form.controls.publicNull.value) {
            this.publicationRef.isNull = true;
            this.publicationRef.searchVal1 = null;
        } else {
            this.publicationRef.isNull = false;
            if (this.form.get("public.pdate").value) {
                this.publicationRef.searchVal1 = this.form.get("public.pdate").value;
            } else {
                this.publicationRef.searchVal1 = null;
            }
        }
        // Sets first performance date property
        if (this.form.controls.firstPerNull.value) {
            this.firstPerformanceRef.isNull = true;
            this.firstPerformanceRef.searchVal1 = null;
        } else {
            this.firstPerformanceRef.isNull = false;
            if (this.form.get("firstPer.fpdate").value) {
                this.firstPerformanceRef.searchVal1 = this.form.get("firstPer.fpdate").value;
            } else {
                this.firstPerformanceRef.searchVal1 = null;
            }
        }
        // Sets book comment property
        if (this.form.controls.bookCommentNull.value) {
            this.bookCommentRef.isNull = true;
            this.bookCommentRef.searchVal1 = null;
        } else {
            this.bookCommentRef.isNull = false;
            if (this.form.get("bookComment.bc").value) {
                this.bookCommentRef.searchVal1 = this.form.get("bookComment.bc").value;
            } else {
                this.bookCommentRef.searchVal1 = null;
            }
        }
        // Sets author name property
        if (this.form.get("authorName").value) {
            this.authorLastNameRef.searchVal1 = this.form.get("authorName").value;
        } else {
            this.authorLastNameRef.searchVal1 = null;
        }
        // Sets company property
        if (this.form.controls.performedNull.value) {
            this.companyRef.isNull = true;
            this.companyRef.searchVal1 = null;
            this.companyRef.priority = 0;
        } else {
            this.companyRef.isNull = false;
            if (this.form.get("performed.perf").value) {
                this.companyRef.searchVal1 = this.form.get("performed.perf").value;
                this.companyRef.priority = 0;
            } else {
                this.companyRef.searchVal1 = null;
                this.companyRef.priority = 1;
            }
        }
        // Sets actor property
        if (this.form.controls.performedActorNull.value) {
            this.actorRef.isNull = true;
            this.actorRef.searchVal1 = null;
            this.actorRef.priority = 0;
        } else {
            this.actorRef.isNull = false;
            if (this.form.get("performedActor.perfA").value) {
                this.actorRef.searchVal1 = this.form.get("performedActor.perfA").value;
                this.actorRef.priority = 0;
            } else {
                this.actorRef.searchVal1 = null;
                this.actorRef.priority = 1;
            }
        }
        // Sets venue property
        if (this.form.controls.performedInNull.value) {
            this.venueRef.isNull = true;
            this.venueRef.searchVal1 = null;
            this.venueRef.priority = 0;
        } else {
            this.venueRef.isNull = false;
            if (this.form.get("performedIn.perfI").value) {
                this.venueRef.searchVal1 = this.form.get("performedIn.perfI").value;
                this.venueRef.priority = 0;
            } else {
                this.venueRef.searchVal1 = null;
                this.venueRef.priority = 1;
            }
        }

        this.amountResult = this._knoraService.gravsearchQueryCount(this.myBook, this.PRIORITY);

        this._knoraService.gravseachQuery(this.myBook, this.PRIORITY)
            .subscribe(data => {
                console.log(data);
                this.searchResults = data;
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = BookComponent.customSorting;
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

        this._knoraService.gravseachQuery(this.myBook, this.PRIORITY, offset)
            .subscribe(data => {
                this.searchResults.push(...data);
                this.dataSource = new MatTableDataSource(this.searchResults);
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = BookComponent.customSorting;
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            }, error => {
                this._spinner.hide("spinner-big");
                this.searchStarted = false;
            });
    }

    sortCompanies(comp1: any, comp2: any) {
        const companyTitle1 = comp1.hasCompanyTitle.toUpperCase();
        const companyTitle2 = comp2.hasCompanyTitle.toUpperCase();

        return companyTitle1 <= companyTitle2 ? (companyTitle1 === companyTitle2 ? 0 : -1) : 1;
    }

    sortVenues(ven1: any, ven2: any) {
        const placeVenue1 = ven1.value.toUpperCase();
        const placeVenue2 = ven2.value.toUpperCase();

        return placeVenue1 <= placeVenue2 ? (placeVenue1 === placeVenue2 ? 0 : -1) : 1;
    }

    sortActors(act1: any, act2: any) {
        const actorLastName1 = act1.hasLastName.toUpperCase();
        const actorLastName2 = act2.hasLastName.toUpperCase();

        return actorLastName1 <= actorLastName2 ? (actorLastName1 === actorLastName2 ? 0 : -1) : 1;
    }

}
