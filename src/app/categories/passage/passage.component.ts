import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Book, Passage} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {CreateUpdatePassageComponent} from "./create-update-passage/create-update-passage.component";
import {BookRefComponent} from "../../dialog/book-ref/book-ref.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: "app-passage",
  templateUrl: "./passage.component.html",
  styleUrls: ["./passage.component.scss"],
    animations: [
        trigger("detailExpand", [
            state("collapsed, void", style({height: "0px", minHeight: "0"})),
            state("expanded", style({height: "*"})),
            transition("expanded <=> collapsed, void => expanded", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
        ]),
    ]
})
export class PassageComponent implements OnInit {
    columnsToDisplay: string[] = ["detail", "book", "text", "textHist", "page", "pageHist", "order", "references", "action"];
    dataSource: MatTableDataSource<Passage>;
    expandedElements: any[] = [];
    value: string;
    form: FormGroup;

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private apiService: ApiService,
                private passageDialog: MatDialog,
                private editionDialog: MatDialog) {
    }

    static customFilter(passage: Passage, filterValue: string): boolean {
        const containsEdition = (passage.occursIn as Book).title.toLowerCase().indexOf(filterValue) > -1;
        const containsText = passage.text.toLowerCase().indexOf(filterValue) > -1;

        return containsEdition || containsText;
    }

    ngOnInit() {
        this.form = new FormGroup({
            text: new FormControl("", []),
            textHistNull: new FormControl("", []),
            textHist: new FormGroup({
                txh: new FormControl("", [])
            }),
            prefDisplayedTitleNull: new FormControl("", []),
            prefDisplayedTitle: new FormGroup({
                prefdistit: new FormControl("", []),
            }),
            pageNull: new FormControl("", []),
            page: new FormGroup({
                pg: new FormControl("", [])
            }),
            pagHistNull: new FormControl("", []),
            pageHist: new FormGroup({
                pgh: new FormControl("", [])
            }),
            research: new FormControl("", []),
            function: new FormControl("", []),
            marking: new FormControl("", []),
            status: new FormControl("", []),
            intCommentNull: new FormControl("", []),
            intComment: new FormGroup({
                intc: new FormControl("", [])
            }),
            passCommentNull: new FormControl("", []),
            passComment: new FormGroup({
                pc: new FormControl("", [])
            }),
            bookTitle: new FormControl("", []),
            secBookTitleNull: new FormControl("", []),
            secBookTitle: new FormGroup({
                secbt: new FormControl("", [])
            }),
            contributor: new FormControl("", []),
            lexiaNull: new FormControl("", []),
            lexia: new FormGroup({
                lex: new FormControl("", [])
            }),
            extraNull: new FormControl("", []),
            extra: new FormGroup({
                ex: new FormControl("", [])
            })
        });
        this.resetTable();
    }

    resetSearch() {
        // this.form.get("internalId").reset("");
        // this.form.get("creationDate").reset("");
        // this.form.controls.firstNameNull.setValue(false);
        // this.form.get("firstName").enable();
        // this.form.get("firstName.fn").reset("");
        // this.form.get("lastName").reset("");
        // this.form.get("description").reset("");
        // this.form.controls.birthNull.setValue(false);
        // this.form.get("birth").enable();
        // this.form.get("birth.bdate").reset("");
        // this.form.controls.deathNull.setValue(false);
        // this.form.get("death").enable();
        // this.form.get("death.ddate").reset("");
        // this.form.controls.activeNull.setValue(false);
        // this.form.get("active").enable();
        // this.form.get("active.adate").reset("");
        // this.form.controls.extraNull.setValue(false);
        // this.form.get("extra").enable();
        // this.form.get("extra.ex").reset("");
    }

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).disable() : this.form.get(groupName).enable();
    }

    resetTable() {
        this.apiService.getPassages(true).subscribe((passages) => {
            console.log(passages);
            this.dataSource = new MatTableDataSource(passages);
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = ((item: any, property) => {
                switch (property) {
                    case "book": return item.occursIn.title;
                    default: return item[property];
                }
            });
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filterPredicate = PassageComponent.customFilter;
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

    edit(passage: Passage) {
        this.createOrEditResource(true, passage);
    }

    createOrEditResource(editMod: boolean, resource: Passage = null) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "650px";
        dialogConfig.data = {
            resource: resource,
            editMod: editMod,
        };
        const dialogRef = this.passageDialog.open(CreateUpdatePassageComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.refresh) {
                this.resetTable();
                this.dataSource.sort = this.sort;
            }
        });
    }

    delete(id: number) {
        console.log(`Passage ID: ${id}`);
    }

    editBook(passage: Passage) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: [passage.occursIn],
            editMod: [passage.occursIn].length > 0,
            max: 1
        };
        const dialogRef = this.editionDialog.open(BookRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                const copyPassage = JSON.parse(JSON.stringify(passage));
                copyPassage.edition = data.data[0];
                // update request
                this.apiService.updatePassage(copyPassage.id, copyPassage);
                this.resetTable();
            }
        });
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

}

