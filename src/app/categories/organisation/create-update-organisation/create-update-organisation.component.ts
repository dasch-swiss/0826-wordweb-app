import {Component, Inject, OnInit} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../services/api.service";
import {Lexia} from "../../../model/model";
import {CategoryRefComponent} from "../../../dialog/category-ref.component";

@Component({
    selector: "app-create-update-organisation",
    templateUrl: "./create-update-organisation.component.html",
    styleUrls: ["./create-update-organisation.component.scss"]
})
export class CreateUpdateOrganisationComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    organisation: any;
    form: UntypedFormGroup;
    lexiaList: Lexia[];

    constructor(private lexiaDialog: MatDialog,
                private dialogRef: MatDialogRef<CreateUpdateOrganisationComponent>,
                @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.organisation = JSON.parse(JSON.stringify(data.resource));
    }

    ngOnInit() {
        this.form = new UntypedFormGroup({
            internalID: new UntypedFormControl(this.organisation ? this.organisation.internalID : "", []),
            name: new UntypedFormControl(this.organisation ? this.organisation.name : "", [Validators.required])
        });

        this.lexiaList = this.organisation ? this.organisation.organisationAsLexia  ? [this.organisation.organisationAsLexia] : [] : [];
    }

    submit() {
        if (this.organisation) {
            this.organisation.internalID = this.form.get("internalID").value;
            this.organisation.name = this.form.get("name").value;
            // update request
            this.apiService.updateOrganisation(this.organisation.id, this.organisation)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        } else {
            const newOrganisation = {
                internalID: this.form.get("internalID").value,
                name: this.form.get("name").value
            };
            // create request
            this.apiService.createOrganistaion(newOrganisation)
                .subscribe((data) => {
                    this.dialogRef.close({refresh: true});
                });
        }
    }

    cancel() {
        this.dialogRef.close({refresh: false});
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

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.organisation ? "Edit company" : "Create new company";
    }

    getButtonText(): string {
        return this.organisation ? "SAVE" : "CREATE";
    }

}
