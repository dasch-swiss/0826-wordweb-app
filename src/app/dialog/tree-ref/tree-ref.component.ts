import {Component, Inject, OnInit} from "@angular/core";
import {IRefInfo, TreeCategory} from "../../model/model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../services/api.service";
import {Observable} from "rxjs";
import {TreeTableService} from "../../services/tree-table.service";

@Component({
    selector: "app-language-ref",
    templateUrl: "./tree-ref.component.html",
    styleUrls: ["../category-ref.scss"]
})
export class TreeRefComponent implements OnInit {
    refInfo: IRefInfo;
    tree: TreeCategory[];
    treeTable: any[];
    flattenTreeTable: any[];
    listOpen: boolean;
    selectionChanged: boolean;
    selectedCat: TreeCategory[];

    static validateData(data: any): IRefInfo {
        const newRefInfo = {
            res: Array.isArray(data.res) ? data.res : [data.res],
            resType: data.resType,
            props: data.props,
            btnTxt: data.btnTxt,
            titleTxt: data.titleTxt,
            editMode: data.editMode,
        };

        if (data.maxRes) {
            newRefInfo["maxRes"] = data.maxRes;
        }

        if (data.filter) {
            newRefInfo["filter"] = data.filter;
        }

        return newRefInfo;
    }

    constructor(private dialogRef: MatDialogRef<TreeRefComponent>,
                @Inject(MAT_DIALOG_DATA) public data,
                private apiService: ApiService,
                private treeTableService: TreeTableService) {
        this.selectionChanged = false;
        this.selectedCat = [];
    }

    ngOnInit() {
        this.refInfo = TreeRefComponent.validateData(this.data);

        let tempTree: Observable<TreeCategory>;

        switch (this.refInfo.resType) {
            case "genre": {
                tempTree = this.apiService.getGenre(0, true);
                break;
            }
            case "image": {
                tempTree = this.apiService.getImage(0, true);
                break;
            }
            case "status": {
                tempTree = this.apiService.getStatus(0, true);
                break;
            }
            case "marking": {
                tempTree = this.apiService.getMarking(0, true);
                break;
            }
            case "formalClass": {
                tempTree = this.apiService.getFormalClass(0, true);
                break;
            }
            case "functionVoice": {
                tempTree = this.apiService.getFunctionVoice(0, true);
                break;
            }
            case "researchField": {
                tempTree = this.apiService.getResearchField(0, true);
                break;
            }
            case "subject": {
                tempTree = this.apiService.getSubject(0, true);
                break;
            }
            case "language": {
                tempTree = this.apiService.getLanguage(0, true);
                break;
            }
        }

        tempTree.subscribe(treeCat => {
            this.tree = treeCat.nodes as TreeCategory[];
            this.treeTable = this.tree.map(t => this.treeTableService.toTreeTable(t));
            this.flattenTreeTable = this.flattenTree(this.treeTable);
        });

        if (this.refInfo.editMode) {
            this.selectedCat = [...this.refInfo.res];
            this.closeList();
        } else {
            this.selectedCat = this.refInfo.res.length !== 0 ? [...this.refInfo.res] : [];
            this.openList();
        }
    }

    openList() {
        this.listOpen = true;
    }

    closeList() {
        this.listOpen = false;
    }

    flattenTree(treeTable): any {
        return treeTable.reduce((acc, bla) => this.treeTableService.flattenTree(acc, bla), []);
    }

    addCategory(category: TreeCategory) {
        this.selectedCat.push(category);
        this.selectionChanged = true;
    }

    removeCategory(id: number) {
        this.selectedCat = this.selectedCat.filter((category) => category.id !== id);
        this.selectionChanged = true;
    }

    isUsed(id: number): boolean {
        return this.selectedCat.filter((category) => category.id === id).length !== 0;
    }

    hasMaximum(): boolean | null {
        return this.refInfo.maxRes ? this.selectedCat.length === this.refInfo.maxRes : null;
    }

    formatIndentation(node: any): string {
        return "&nbsp;".repeat(node.depth * 4);
    }

    nodeClick(element: any) {
        element.isExpanded ? this.treeTableService.close(element) : this.treeTableService.expand(element);
        this.flattenTreeTable = this.flattenTree(this.treeTable);
    }

    cancel() {
        this.dialogRef.close({submit: false, data: []});
    }

    save() {
        this.dialogRef.close({submit: true, data: [...this.selectedCat]});
    }
}
