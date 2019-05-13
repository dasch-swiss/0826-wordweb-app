import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {
    MatButtonModule,
    MatCardModule,
    MatChipsModule, MatDialogModule, MatExpansionModule,
    MatIconModule, MatInputModule,
    MatProgressSpinnerModule, MatSortModule,
    MatTableModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SatPopoverModule} from "@ncstate/sat-popover";
import {MatFormFieldModule} from "@angular/material";
import {InlineEditComponent} from "./inline-edit/inline-edit.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthorCategoryComponent} from "./category/author-category/author-category.component";
import {BookCategoryComponent} from "./category/book-category/book-category.component";
import {LanguageCategoryComponent} from "./category/language-category/language-category.component";
import {AuthorSetComponent} from "./author-set/author-set.component";
import {CreateAuthorComponent} from "./create-author/create-author.component";
import {CreateBookComponent} from "./create-book/create-book.component";
import { CreateLanguageComponent } from "./create-language/create-language.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
    {path: "book", component: CreateBookComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        InlineEditComponent,
        AuthorCategoryComponent,
        BookCategoryComponent,
        LanguageCategoryComponent,
        AuthorSetComponent,
        CreateAuthorComponent,
        CreateBookComponent,
        CreateLanguageComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
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
        MatDialogModule,
        MatExpansionModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        AuthorSetComponent,
        CreateAuthorComponent,
        CreateBookComponent,
        CreateLanguageComponent
    ]
})
export class AppModule {
}
