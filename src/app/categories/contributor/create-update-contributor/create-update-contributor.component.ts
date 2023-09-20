import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../services/api.service";
import {Contributor, Lexia} from "../../../model/model";
import {CategoryRefComponent} from "../../../dialog/category-ref.component";

@Component({
    selector: "app-create-update-contributor",
    templateUrl: "./create-update-contributor.component.html",
    styleUrls: ["./create-update-contributor.component.scss"]
})
export class CreateUpdateContributorComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    contributor: any;
    form: UntypedFormGroup;
    lexiaList: Lexia[];
    genders: any;

    constructor(private lexiaDialog: MatDialog,
                private dialogRef: MatDialogRef<CreateUpdateContributorComponent>,
                @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.contributor = JSON.parse(JSON.stringify(data.resource)) as Contributor;
    }

    ngOnInit() {
        this.genders = this.apiService.getGenders();

        this.form = new UntypedFormGroup({
            internalID: new UntypedFormControl(this.contributor ? this.contributor.internalID : "", [Validators.required]),
            firstName: new UntypedFormControl(this.contributor ? this.contributor.firstName : "", [Validators.required]),
            lastName: new UntypedFormControl(this.contributor ? this.contributor.lastName : "", [Validators.required]),
            gender: new UntypedFormControl(this.contributor ? this.contributor.gender.id : "", [Validators.required]),
            email: new UntypedFormControl(this.contributor ? this.contributor.email : "", [])
        });

        this.lexiaList = this.contributor ? this.contributor.humanAsLexia  ? [this.contributor.humanAsLexia] : [] : [];
    }

    submit() {
        if (this.contributor) {
            this.contributor.internalID = this.form.get("internalID").value;
            this.contributor.firstName = this.form.get("firstName").value;
            this.contributor.lastName = this.form.get("lastName").value;
            this.contributor.email = this.form.get("email").value;
            this.contributor.gender = this.form.get("gender").value;
            this.contributor.humanAsLexia = this.lexiaList;
            // update request
            this.apiService.updateContributor(this.contributor.id, this.contributor)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        } else {
            const newContributor = {
                internalID: this.form.get("internalID").value,
                firstName: this.form.get("firstName").value,
                lastName: this.form.get("lastName").value,
                gender: this.form.get("gender").value,
                email: this.form.get("email").value,
                humanAsLexia : this.lexiaList
            };
            // create request
            this.apiService.createContributor(newContributor)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
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

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.contributor ? "Edit contributor" : "Create new contributor";
    }

    getButtonText(): string {
        return this.contributor ? "SAVE" : "CREATE";
    }

}

