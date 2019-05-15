import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {
    MatButtonModule,
    MatCardModule,
    MatChipsModule, MatDialogModule, MatExpansionModule,
    MatIconModule, MatInputModule,
    MatProgressSpinnerModule, MatSelectModule, MatSortModule,
    MatTableModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SatPopoverModule} from "@ncstate/sat-popover";
import {MatFormFieldModule} from "@angular/material";
import {InlineEditComponent} from "./category/inline-edit/inline-edit.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthorComponent} from "./category/author/author.component";
import {BookComponent} from "./category/book/book.component";
import {LanguageComponent} from "./category/language/language.component";
import {AuthorRefComponent} from "./dialog/author-ref/author-ref.component";
import {CreateAuthorComponent} from "./create-resource/create-author/create-author.component";
import {CreateBookComponent} from "./create-resource/create-book/create-book.component";
import { CreateLanguageComponent } from "./create-resource/create-language/create-language.component";
import {RouterModule, Routes} from "@angular/router";
import { VenueRefComponent } from "./dialog/venue-ref/venue-ref.component";
import { EditionComponent } from "./category/edition/edition.component";
import { OrganisationComponent } from "./category/organisation/organisation.component";

const routes: Routes = [
    {path: "book", component: CreateBookComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        InlineEditComponent,
        AuthorComponent,
        BookComponent,
        LanguageComponent,
        AuthorRefComponent,
        CreateAuthorComponent,
        CreateBookComponent,
        CreateLanguageComponent,
        VenueRefComponent,
        EditionComponent,
        OrganisationComponent
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
        MatExpansionModule,
        MatSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        AuthorRefComponent,
        VenueRefComponent,
        CreateAuthorComponent,
        CreateBookComponent,
        CreateLanguageComponent
    ]
})
export class AppModule {
}
