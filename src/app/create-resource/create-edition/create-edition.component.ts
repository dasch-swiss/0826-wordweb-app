import { Component, OnInit } from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ApiService} from "../../services/apiService/api.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Router} from "@angular/router";
import {AuthorRefComponent} from "../../dialog/author-ref/author-ref.component";
import {BookRefComponent} from "../../dialog/book-ref/book-ref.component";
import {LanguageRefComponent} from "../../dialog/language-ref/language-ref.component";

@Component({
  selector: "app-create-edition",
  templateUrl: "./create-edition.component.html",
  styleUrls: ["./create-edition.component.scss"]
})
export class CreateEditionComponent implements OnInit {
  form: FormGroup;
  bookList: any[];
  languageList: any[];

  constructor(private apiService: ApiService,
              private bookDialog: MatDialog,
              private languageDialog: MatDialog,
              private router: Router) {
    this.form = new FormGroup({
      publicationInfo: new FormControl("", []),
      book: new FormControl("", []),
      language: new FormControl("", [])
    });
  }

  ngOnInit() {
    this.languageList = [];
    this.bookList = [];
  }

  cancel() {
    this.router.navigate(["/edition"]);
  }

  create() {
    this.router.navigate(["/edition"]);
  }

  addBook() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      values: this.bookList,
      editMod: false,
      max: 1
    };
    const dialogRef = this.bookDialog.open(BookRefComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (!data.cancel) {
        this.bookList = data.data;
      }
    });
  }

  addLanguage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      values: this.languageList,
      editMod: false,
      max: 1
    };
    const dialogRef = this.languageDialog.open(LanguageRefComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (!data.cancel) {
        this.languageList = data.data;
      }
    });
  }

  addOrEdit(list: any[]): string {
    return list.length === 0 ? "Hinzufügen" : "Bearbeiten";
  }

}
