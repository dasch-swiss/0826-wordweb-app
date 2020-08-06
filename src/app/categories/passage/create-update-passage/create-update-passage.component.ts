import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../services/api.service";
import {Book, Contributor, FunctionVoice, Lexia, Marking, Passage, ResearchField} from "../../../model/model";
import {CategoryRefComponent} from "../../../dialog/category-ref.component";

@Component({
    selector: "app-create-update-passage",
    templateUrl: "./create-update-passage.component.html",
    styleUrls: ["./create-update-passage.component.scss"]
})
export class CreateUpdatePassageComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    passage: any;
    form: FormGroup;
    statuses: any;
    lexiaList: Lexia[];
    passageList: Passage[];
    bookList: Book[];
    markingList: Marking[];
    researchFieldList: ResearchField[];
    functionVoiceList: FunctionVoice[];
    contributorList: Contributor[];

    constructor(private bookDialog: MatDialog,
                private lexiaDialog: MatDialog,
                private contributorDialog: MatDialog,
                private dialogRef: MatDialogRef<CreateUpdatePassageComponent>,
                @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService) {
        this.passage = JSON.parse(JSON.stringify(data.resource));
        console.log(this.passage);
    }

    ngOnInit() {
        this.form = new FormGroup({
            text: new FormControl(this.passage ? this.passage.text : "", []),
            textHist: new FormControl(this.passage ? this.passage.textHist : "", []),
            page: new FormControl(this.passage ? this.passage.page : "", []),
            pageHist: new FormControl(this.passage ? this.passage.pageHist : "", []),
            status: new FormControl(this.passage ? this.passage.status.id : "", [])
        });

        this.statuses = this.apiService.getStatuses();

        this.bookList = this.passage ? (this.passage.occursIn ? [this.passage.occursIn] : []) : [];
        this.markingList = this.passage ? (this.passage.marking ? [this.passage.marking] : []) : [];
        this.researchFieldList = this.passage ? (this.passage.researchField ? [this.passage.researchField] : []) : [];
        this.functionVoiceList = this.passage ? (this.passage.functionVoice ? [this.passage.functionVoice] : []) : [];
        this.contributorList = this.passage ? (this.passage.wasContributedBy ? [this.passage.wasContributedBy] : []) : [];
        this.lexiaList = this.passage ? this.passage.contains : [];
        this.passageList = this.passage ? this.passage.mentionedIn : [];
    }

    submit() {
        if (this.passage) {
            this.passage.text = this.form.get("text").value;
            this.passage.textHist = this.form.get("textHist").value;
            this.passage.page = this.form.get("page").value;
            this.passage.pageHist = this.form.get("pageHist").value;
            this.passage.status = this.form.get("status").value;
            // TODO: Implement update status request
            this.dialogRef.close({refresh: true});
        } else {
            const newPassage = {
                text: this.form.get("text").value,
                textHist: this.form.get("textHist").value,
                page: this.form.get("page").value,
                pageHist: this.form.get("pageHist").value,
                status: this.form.get("status").value
            };
            // TODO: Implement create status request
            this.dialogRef.close({refresh: true});
        }
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    addBook() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            res: this.bookList,
            resType: "book",
            props: ["internalID", "title"],
            filter: (book: Book, value: string): boolean => {
                const containsID = book.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsTitle = book.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
                // const containsAuthorName = book.authors.filter(author => {
                //     const fullName = `${author.firstName} ${author.lastName}`;
                //     return fullName.toLowerCase().indexOf(value.toLowerCase()) > -1;
                // }).length > 0;

                // return containsID || containsTitle || containsAuthorName;
                return containsID || containsTitle;
            },
            btnTxt: "select book",
            titleTxt: "Add Book",
            editMode: true
        };

        const dialogRef = this.bookDialog.open(CategoryRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.bookList = data.data;
            }
        });
    }

    removeBook(book: Book) {
    }

    addLexia() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            res: this.lexiaList,
            resType: "lexia",
            props: ["internalID", "name"],
            filter: (lexia: Lexia, value: string): boolean => {
                const containsID = lexia.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsName = lexia.name.toLowerCase().indexOf(value.toLowerCase()) > -1;

                return containsID || containsName;
            },
            btnTxt: "select lexia",
            titleTxt: "Add Lexia",
            editMode: true
        };

        const dialogRef = this.lexiaDialog.open(CategoryRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.lexiaList = data.data;
            }
        });
    }

    removeLexia(lexia: Lexia) {
    }

    addPassage() {
    }

    removePassage(passage: Passage) {
    }

    addMarking() {
    }

    removeMarking(marking: Marking) {
    }

    addResearchField() {
    }

    removeResearchField(researchField: ResearchField) {
    }

    addFunctionVoice() {
    }

    removeFunctionVoice(functionVoice: FunctionVoice) {
    }

    addContributor() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            res: this.contributorList,
            resType: "contributor",
            props: ["internalID", "firstName", "lastName"],
            filter: (con: Contributor, value: string): boolean => {
                const containsID = con.internalID.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsFirstName = con.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1;
                const containsLastName = con.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1;

                return containsID || containsFirstName || containsLastName;
            },
            btnTxt: "select contributor",
            titleTxt: "Add Contributor",
            editMode: true
        };

        const dialogRef = this.contributorDialog.open(CategoryRefComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => {
            if (data.submit) {
                this.contributorList = data.data;
            }
        });
    }

    removeContributor(contributor: Contributor) {
    }

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.passage ? "Edit passage" : "Create new passage";
    }

    getButtonText(): string {
        return this.passage ? "SAVE" : "CREATE";
    }

}
