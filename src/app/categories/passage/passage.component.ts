import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Passage} from "../../model/model";
import {ApiService} from "../../services/api.service";
import {SatPopover} from "@ncstate/sat-popover";
import {CreateUpdatePassageComponent} from "./create-update-passage/create-update-passage.component";
import {BookRefComponent} from "../../dialog/book-ref/book-ref.component";
import {animate, state, style, transition, trigger} from "@angular/animations";

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
    passages: any;
    dataSource: MatTableDataSource<Passage>;
    expandedElements: any[] = [];
    value: string;

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private apiService: ApiService,
                private passageDialog: MatDialog,
                private editionDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.passages = this.apiService.getPassages(true);
        this.dataSource = new MatTableDataSource(this.passages);
        console.log(this.apiService.getPassages(true));
    }

    ngOnInit() {
        this.dataSource.sortingDataAccessor = ((item, property) => {
            switch (property) {
                case "book": return item.book.title;
                default: return item[property];
            }
        });
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filterPredicate = this.customFilter;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    customFilter(passage: Passage, filterValue: string): boolean {
        const containsEdition = passage.book.title.toLowerCase().indexOf(filterValue) > -1;
        const containsText = passage.text.toLowerCase().indexOf(filterValue) > -1;

        return containsEdition || containsText;
    }

    clear() {
        this.dataSource.filter = this.value = "";
    }

    rowCount() {
        return this.dataSource.filteredData.length;
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

    updateProperty(event: string | number, property: string, passage: Passage, popover: SatPopover) {
        passage[property] = event;
        this.apiService.updatePassage(passage.id, passage);
        this.resetTable();
        this.applyFilter(this.value ? this.value : "");
        popover.close();
    }

    editBook(passage: Passage) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            list: [passage.book],
            editMod: [passage.book].length > 0,
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
        for (let i = 0; i < arr.length; i++) {
            if (JSON.stringify(obj) === JSON.stringify(arr[i])) {
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

