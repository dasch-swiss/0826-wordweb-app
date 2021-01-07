import {Component, OnInit, ViewChild} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Book} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdateBookComponent} from "./create-update-book/create-update-book.component";
import {FormControl, FormGroup} from "@angular/forms";
import {ListService} from "../../services/list.service";
import {KnoraService} from "../../services/knora.service";
import {TreeTableService} from "../../services/tree-table.service";
import {forkJoin} from "rxjs";
import {IDisplayedProperty, IMainClass} from "../../model/displayModel";

@Component({
    selector: "app-book",
    templateUrl: "./book.component.html",
    styleUrls: ["./book.component.scss"],
    animations: [
        trigger("detailExpand", [
            state("collapsed, void", style({height: "0px", minHeight: "0"})),
            state("expanded", style({height: "*"})),
            transition("expanded <=> collapsed, void => expanded", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
        ]),
    ]
})
export class BookComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) sort: MatSort;

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
    priority = 0;

    dataSource: MatTableDataSource<Book>;
    columnsToDisplay = ["detail", "internalID", "title", "authors", "createdDate", "publishDate", "order", "references", "action"];
    expandedElements: any[] = [];
    value: string;
    form: FormGroup;
    languages: any[];
    genres: any[];
    subjects: any[];
    companies: any[];
    venues: any[];
    actors: any[];

    constructor(private apiService: ApiService,
                private listService: ListService,
                private knoraService: KnoraService,
                private authorDialog: MatDialog,
                private venueDialog: MatDialog,
                private organisationDialog: MatDialog,
                private createBookDialog: MatDialog,
                private treeTableService: TreeTableService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            internalId: new FormControl("", []),
            prefBookTitleNull: new FormControl(false, []),
            prefBookTitle: new FormGroup({
                prefbt: new FormControl("", []),
            }),
            bookTitle: new FormControl("", []),
            edition: new FormControl("", []),
            editionHistNull: new FormControl(false, []),
            editionHist: new FormGroup({
                eh: new FormControl("", []),
            }),
            language: new FormControl("", []),
            genre: new FormControl("", []),
            subjectNull: new FormControl(false, []),
            subject: new FormGroup({
                sub: new FormControl("", []),
            }),
            creationDate: new FormControl("", []),
            publicNull: new FormControl(false, []),
            public: new FormGroup({
                pdate: new FormControl("", [])
            }),
            firstPerNull: new FormControl(false, []),
            firstPer: new FormGroup({
                fpdate: new FormControl("", [])
            }),
            bookCommentNull: new FormControl(false, []),
            bookComment: new FormGroup({
                bc: new FormControl("", [])
            }),
            authorName: new FormControl("", []),
            performedNull: new FormControl(false, []),
            performed: new FormGroup({
                perf: new FormControl("", [])
            }),
            performedActorNull: new FormControl(false, []),
            performedActor: new FormGroup({
                perfA: new FormControl("", [])
            }),
            performedInNull: new FormControl(false, []),
            performedIn: new FormGroup({
                perfI: new FormControl("", [])
            }),
            // extraNull: new FormControl(false, []),
            // extra: new FormGroup({
            //     ex: new FormControl("", [])
            // })
        });

        const languageNode = this.listService.getList("language").nodes;
        this.languages = languageNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const genreNode = this.listService.getList("genre").nodes;
        this.genres = genreNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        const subjectNode = this.listService.getList("subject").nodes;
        this.subjects = subjectNode.reduce((acc, list) => this.treeTableService.flattenTree(acc, list), []);

        this.prepareCompanies();
        this.prepareVenues();
        this.prepareActors();

        this.resetTable();
    }

    prepareCompanies() {
        this.knoraService.getCompaniesCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / 25);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this.knoraService.getCompanies(offset));
                }

                forkJoin<any>(...requests)
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
        this.knoraService.getVenuesCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / 25);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this.knoraService.getVenues(offset));
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
        this.knoraService.getActorsCount()
            .subscribe(amount => {
                const maxOffset = Math.ceil(amount / 25);

                const requests = [];

                for (let offset = 0; offset < maxOffset; offset++) {
                    requests.push(this.knoraService.getActors(offset));
                }

                forkJoin<any>(...requests)
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
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    resetTable() {
        this.apiService.getBooks(true).subscribe((books) => {
            console.log(books);
            this.dataSource = new MatTableDataSource(books);
            this.dataSource.sort = this.sort;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filterPredicate = this.customFilter;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    customFilter(book: any, filterValue: string): boolean {
        const containsInternalID = book.internalID.indexOf(filterValue) > -1;
        const containsTitle = book.title.toLowerCase().indexOf(filterValue) > -1;
        const containEdition = book.edition.toLowerCase().indexOf(filterValue) > -1;
        const containEditionHist = book.editionHist.toLowerCase().indexOf(filterValue) > -1;
        const containsAuthorName = book.authors.filter(author => {
            const fullName = `${author.firstName} ${author.lastName}`;
            return fullName.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;
        const containsVenue = book.venues.filter(venue => {
            const fullName = `${venue.name}, ${venue.place}`;
            return fullName.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;
        const containsOrganisation = book.organisations.filter(organisation => {
            return organisation.name.toLowerCase().indexOf(filterValue) > -1;
        }).length > 0;

        return containsInternalID || containsTitle || containEdition || containEditionHist || containsAuthorName || containsVenue || containsOrganisation;
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
        const dialogRef = this.createBookDialog.open(CreateUpdateBookComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    delete(id: number) {
        console.log(`Book ID: ${id}`);
    }

    contains(obj: any, arr: any[]) {
        for (const i of arr) {
            if (JSON.stringify(obj) === JSON.stringify(i)) {
                return true;
            }
        }
        return false;
    }

    addElement(obj: any, arr: any[]) {
        arr.push(obj);
    }

    removeElement(obj: any, arr: any[]) {
        return arr.filter((element => JSON.stringify(obj) !== JSON.stringify(element)));
    }

    expansion(element) {
        this.contains(element, this.expandedElements) ? this.expandedElements = this.removeElement(element, this.expandedElements) : this.addElement(element, this.expandedElements);
    }

    getDateFormat(dateStart: string, dateEnd: string): string {
        return dateStart === dateEnd ? dateStart : `${dateStart}-${dateEnd}`;
    }

    search() {
        console.log("Searching starts...");

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

        this.knoraService.gravsearchQueryCount(this.myBook, this.priority)
            .subscribe(numb => console.log("amount", numb));

        this.knoraService.gravseachQuery(this.myBook, this.priority)
            .subscribe(data => console.log("results", data));
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
