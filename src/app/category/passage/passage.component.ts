import {Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogConfig, MatSort, MatTableDataSource} from "@angular/material";
import {Passage} from "../../model/model";
import {ApiService} from "../../services/apiService/api.service";
import {SatPopover} from "@ncstate/sat-popover";
import {CreateUpdatePassageComponent} from "../../create-resource/create-update-passage/create-update-passage.component";

@Component({
    selector: "app-passage",
    templateUrl: "./passage.component.html",
    styleUrls: ["../category.component.scss"]
})
export class PassageComponent implements OnInit {

    displayedColumns: string[] = ["book", "text", "page", "order", "references", "action"];
    dataSource: MatTableDataSource<Passage>;
    value: string;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private apiService: ApiService,
                private passageDialog: MatDialog,
                private editionDialog: MatDialog) {
        this.resetTable();
    }

    resetTable() {
        this.dataSource = new MatTableDataSource(this.apiService.getPassages(true));
        console.log(this.apiService.getPassages(true));
    }

    ngOnInit() {
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
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // dialogConfig.data = {
        //     list: [passage.book],
        //     editMod: [passage.book].length > 0,
        //     max: 1
        // };
        // const dialogRef = this.editionDialog.open(EditionRefComponent, dialogConfig);
        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data.submit) {
        //         const copyPassage = JSON.parse(JSON.stringify(passage));
        //         copyPassage.edition = data.data[0];
        //         // update request
        //         this.apiService.updatePassage(copyPassage.id, copyPassage);
        //         this.resetTable();
        //     }
        // });
    }

}
