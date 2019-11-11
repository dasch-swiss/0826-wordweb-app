import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../../../services/api.service";
import {Book, Contributor, FunctionVoice, Lexia, Marking, Passage, ResearchField} from "../../../model/model";

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

    constructor(private dialogRef: MatDialogRef<CreateUpdatePassageComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
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
    }

    removeBook(book: Book) {
    }

    addLexia() {
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
