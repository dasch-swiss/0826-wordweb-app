import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule, MatDialogModule,
  MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSortModule,
  MatTableModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SatPopoverModule} from "@ncstate/sat-popover";
import {MatFormFieldModule} from "@angular/material";
import {InlineEditComponent } from "./inline-edit/inline-edit.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EditAuthorsComponent } from "./edit-authors/edit-authors.component";
import { EditBooksComponent } from "./edit-books/edit-books.component";
import { EditLanguagesComponent } from "./edit-languages/edit-languages.component";
import { DragboxComponent } from "./dragbox/dragbox.component";
import { CreateAuthorComponent } from "./create-author/create-author.component";
import { CreateBookComponent } from "./create-book/create-book.component";

@NgModule({
  declarations: [
    AppComponent,
    InlineEditComponent,
    EditAuthorsComponent,
    EditBooksComponent,
    EditLanguagesComponent,
    DragboxComponent,
    CreateAuthorComponent,
    CreateBookComponent
  ],
  imports: [
    BrowserModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    SatPopoverModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
      DragboxComponent,
      CreateAuthorComponent
  ]
})
export class AppModule { }
