import {Component, Inject, OnInit} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {MatLegacySnackBar as MatSnackBar} from "@angular/material/legacy-snack-bar";
import {ApiService} from "../../../services/api.service";
import {CustomValidators} from "../../../customValidators";
import {Lexia} from "../../../model/model";
import {CategoryRefComponent} from "../../../dialog/category-ref.component";

@Component({
    selector: "app-create-update-author",
    templateUrl: "./create-update-author.component.html",
    styleUrls: ["./create-update-author.component.scss"]
})
export class CreateUpdateAuthorComponent implements OnInit {
    readonly MAX_CHIPS: number = 4;
    author: any;
    form: UntypedFormGroup;
    genders: any;
    lexiaList: Lexia[];

    constructor(private lexiaDialog: MatDialog,
                private dialogRef: MatDialogRef<CreateUpdateAuthorComponent>,
                @Inject(MAT_DIALOG_DATA) data,
                private apiService: ApiService,
                private snackBar: MatSnackBar) {
        this.author = JSON.parse(JSON.stringify(data.resource));
    }

    ngOnInit() {
        this.genders = this.apiService.getGenders();

        this.form = new UntypedFormGroup({
            internalID: new UntypedFormControl(this.author ? this.author.internalID : "", [Validators.required]),
            firstName: new UntypedFormControl(this.author ? this.author.firstName : "", [Validators.required]),
            lastName: new UntypedFormControl(this.author ? this.author.lastName : "", [Validators.required]),
            description: new UntypedFormControl(this.author ? this.author.description : "", []),
            gender: new UntypedFormControl(this.author ? this.author.gender.id : "", [Validators.required]),
            birthCheck: new UntypedFormControl(this.author && this.author.birthStartDate, []),
            birth: new UntypedFormGroup({
                birthStartDate: new UntypedFormControl(this.author ? this.author.birthStartDate : "", [Validators.required]),
                birthEndDate: new UntypedFormControl(this.author ? this.author.birthEndDate : "", [Validators.required]),
            }, [CustomValidators.correctYearSpan("birthStartDate", "birthEndDate")]),
            deathCheck: new UntypedFormControl(this.author && this.author.deathStartDate, []),
            death: new UntypedFormGroup({
                deathStartDate: new UntypedFormControl(this.author ? this.author.deathStartDate : "", [Validators.required]),
                deathEndDate: new UntypedFormControl(this.author ? this.author.deathEndDate : "", [Validators.required]),
            }, [CustomValidators.correctYearSpan("deathStartDate", "deathEndDate")]),
            flCheck: new UntypedFormControl(this.author && this.author.flStartDate, []),
            fl: new UntypedFormGroup({
                flStartDate: new UntypedFormControl(this.author ? this.author.flStartDate : "", [Validators.required]),
                flEndDate: new UntypedFormControl(this.author ? this.author.flEndDate : "", [Validators.required])
            }, [CustomValidators.correctYearSpan("flStartDate", "flEndDate")])
        });

        this.lexiaList = this.author ? this.author.humanAsLexia  ? [this.author.humanAsLexia] : [] : [];

        if (!this.author) {
            this.form.get("birth").disable();
            this.form.get("death").disable();
            this.form.get("fl").disable();
        }

        if (this.author && !this.author.birthStartDate) {
            this.form.get("birth").disable();
        }

        if (this.author && !this.author.deathStartDate) {
            this.form.get("death").disable();
        }

        if (this.author && !this.author.flStartDate) {
            this.form.get("fl").disable();
        }
    }

    submit() {
        if (this.author) {
            this.author.internalID = this.form.get("internalID").value;
            this.author.firstName = this.form.get("firstName").value;
            this.author.lastName = this.form.get("lastName").value;
            this.author.description = this.form.get("description").value;
            this.author.gender = this.form.get("gender").value;
            this.author.birthStartDate = this.form.get("birth").status === "DISABLED" ? "" : this.form.get("birth").get("birthStartDate").value;
            this.author.birthEndDate = this.form.get("birth").status === "DISABLED" ? "" : this.form.get("birth").get("birthEndDate").value;
            this.author.deathStartDate = this.form.get("death").status === "DISABLED" ? "" : this.form.get("death").get("deathStartDate").value;
            this.author.deathEndDate = this.form.get("death").status === "DISABLED" ? "" : this.form.get("death").get("deathEndDate").value;
            this.author.flStartDate = this.form.get("fl").status === "DISABLED" ? "" : this.form.get("fl").get("flStartDate").value;
            this.author.flEndDate = this.form.get("fl").status === "DISABLED" ? "" : this.form.get("fl").get("flEndDate").value;
            this.author.humanAsLexia = "";
            this.author.internalComment = "";
            // update request
            this.apiService.updateAuthor(this.author.id, this.author)
                .subscribe(data => {
                    this.dialogRef.close({refresh: true});
                    this.snackBar.open("Author edited");
                });
        } else {
            const newAuthor = {
                internalID: this.form.get("internalID").value,
                firstName: this.form.get("firstName").value,
                lastName: this.form.get("lastName").value,
                description: this.form.get("description").value,
                gender: this.form.get("gender").value,
                birthStartDate: this.form.get("birth").status === "DISABLED" ? "" : this.form.get("birth").get("birthStartDate").value,
                birthEndDate: this.form.get("birth").status === "DISABLED" ? "" : this.form.get("birth").get("birthEndDate").value,
                deathStartDate: this.form.get("death").status === "DISABLED" ? "" : this.form.get("death").get("deathStartDate").value,
                deathEndDate: this.form.get("death").status === "DISABLED" ? "" : this.form.get("death").get("deathEndDate").value,
                flStartDate: this.form.get("fl").status === "DISABLED" ? "" : this.form.get("fl").get("flStartDate").value,
                flEndDate: this.form.get("fl").status === "DISABLED" ? "" : this.form.get("fl").get("flEndDate").value,
                humanAsLexia: "",
                internalComment: ""
            };
            // create request
            this.apiService.createAuthor(newAuthor)
                .subscribe(data => {
                    this.dialogRef.close({refresh: true});
                    this.snackBar.open("Author Created");
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

    onChange(event, groupName: string) {
        event.checked ? this.form.get(groupName).enable() : this.form.get(groupName).disable();
    }

    addOrEdit(list: any[]): string {
        return list.length === 0 ? "add" : "edit";
    }

    getTitle(): string {
        return this.author ? "Edit author" : "Create new author";
    }

    getButtonText(): string {
        return this.author ? "SAVE" : "CREATE";
    }

}
