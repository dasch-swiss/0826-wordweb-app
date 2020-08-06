import {Component, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../services/api.service";

@Component({
    selector: "app-create-update-genre",
    templateUrl: "./create-update-genre.component.html",
    styleUrls: ["./create-update-genre.component.scss"]
})
export class CreateUpdateGenreComponent implements OnInit {
    genre: any;
    form: FormGroup;

    constructor(private dialogRef: MatDialogRef<CreateUpdateGenreComponent>, @Inject(MAT_DIALOG_DATA) data, private apiService: ApiService) {
        this.genre = JSON.parse(JSON.stringify(data.resource));
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(this.genre ? this.genre.name : "", [Validators.required])
        });
    }

    submit() {
        if (this.genre) {
            // this.genre.name = this.form.get("name").value;
            // // update request
            // this.apiService.updateGenre(this.genre.id, this.genre)
            //     .subscribe((data) => {
            //         this.dialogRef.close({refresh: true});
            //     });
            // const newGenre = {
            //     name: this.form.get("name").value,
            // };
            // // create request
            // this.apiService.createGenre(newGenre)
            //     .subscribe((data) => {
            //         this.dialogRef.close({refresh: true});
            //     });
        }
    }

    cancel() {
        this.dialogRef.close({refresh: false});
    }

    getTitle(): string {
        return this.genre ? "Edit genre" : "Create new genre";
    }

    getButtonText(): string {
        return this.genre ? "SAVE" : "CREATE";
    }

}
