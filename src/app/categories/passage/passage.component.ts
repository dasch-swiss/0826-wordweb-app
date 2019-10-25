import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Book, Passage} from "../../model/model";
import {ApiService} from "../../services/api.service";
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
    dataSource: MatTableDataSource<Passage>;
    expandedElements: any[] = [];
    value: string;

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
        this.resetTable();
    }

    resetTable() {
        this.apiService.getPassages(true).subscribe((passages) => {
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

