import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {
    MatButtonModule,
    MatCardModule,
    MatChipsModule, MatDialogModule, MatDividerModule, MatExpansionModule,
    MatIconModule, MatInputModule,
    MatProgressSpinnerModule, MatSelectModule, MatSortModule,
    MatTableModule, MatTooltipModule
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
import {CreateUpdateAuthorComponent} from "./create-resource/create-update-author/create-update-author.component";
import {CreateUpdateBookComponent} from "./create-resource/create-update-book/create-update-book.component";
import {CreateUpdateLanguageComponent} from "./create-resource/create-update-language/create-update-language.component";
import {RouterModule, Routes} from "@angular/router";
import {VenueRefComponent} from "./dialog/venue-ref/venue-ref.component";
import {OrganisationComponent} from "./category/organisation/organisation.component";
import {OrganisationRefComponent} from "./dialog/organisation-ref/organisation-ref.component";
import {GenreComponent} from "./category/genre/genre.component";
import {TreetableModule} from "ng-material-treetable";
import {SubjectComponent} from "./category/subject/subject.component";
import {LanguageRefComponent} from "./dialog/language-ref/language-ref.component";
import {BookRefComponent} from "./dialog/book-ref/book-ref.component";
import {PassageComponent} from "./category/passage/passage.component";
import {LexiaComponent} from "./category/lexia/lexia.component";
import {ContributorComponent} from "./category/contributor/contributor.component";
import {CreateUpdatePassageComponent} from "./create-resource/create-update-passage/create-update-passage.component";

const routes: Routes = [
    {path: "book", component: BookComponent},
    {path: "author", component: AuthorComponent},
    {path: "language", component: LanguageComponent},
    {path: "organisation", component: OrganisationComponent},
    {path: "subject", component: SubjectComponent},
    {path: "genre", component: GenreComponent},
    {path: "passage", component: PassageComponent},
    {path: "contributor", component: ContributorComponent},
    {path: "lexia", component: LexiaComponent},
];

@NgModule({
    declarations: [
        AppComponent,
        InlineEditComponent,
        AuthorComponent,
        BookComponent,
        LanguageComponent,
        OrganisationComponent,
        GenreComponent,
        SubjectComponent,
        PassageComponent,
        AuthorRefComponent,
        VenueRefComponent,
        OrganisationRefComponent,
        LanguageRefComponent,
        BookRefComponent,
        LexiaComponent,
        ContributorComponent,
        CreateUpdateAuthorComponent,
        CreateUpdateBookComponent,
        CreateUpdateLanguageComponent,
        CreateUpdatePassageComponent,
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
        MatSelectModule,
        TreetableModule,
        MatDividerModule,
        MatTooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        AuthorRefComponent,
        VenueRefComponent,
        OrganisationRefComponent,
        BookRefComponent,
        LanguageRefComponent,
        CreateUpdateAuthorComponent,
        CreateUpdateBookComponent,
        CreateUpdateLanguageComponent,
        CreateUpdatePassageComponent
    ]
})
export class AppModule {
}
