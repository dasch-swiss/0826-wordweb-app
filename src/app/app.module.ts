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
import {CreateAuthorComponent} from "./create-resource/create-author/create-author.component";
import {CreateBookComponent} from "./create-resource/create-book/create-book.component";
import { CreateLanguageComponent } from "./create-resource/create-language/create-language.component";
import {RouterModule, Routes} from "@angular/router";
import { VenueRefComponent } from "./dialog/venue-ref/venue-ref.component";
import { EditionComponent } from "./category/edition/edition.component";
import { OrganisationComponent } from "./category/organisation/organisation.component";
import { OrganisationRefComponent } from "./dialog/organisation-ref/organisation-ref.component";
import { GenreComponent } from "./category/genre/genre.component";
import {TreetableModule} from "ng-material-treetable";
import { CreateEditionComponent } from "./create-resource/create-edition/create-edition.component";
import { SubjectComponent } from "./category/subject/subject.component";
import { LanguageRefComponent } from "./dialog/language-ref/language-ref.component";
import { BookRefComponent } from "./dialog/book-ref/book-ref.component";
import { PassageComponent } from "./category/passage/passage.component";
import { EditionRefComponent } from "./dialog/edition-ref/edition-ref.component";
import { LexiaComponent } from "./category/lexia/lexia.component";
import { ContributorComponent } from "./category/contributor/contributor.component";

const routes: Routes = [
    {path: "book", component: BookComponent},
    {path: "book/new", component: CreateBookComponent},
    {path: "author", component: AuthorComponent},
    // {path: "author/new", component: CreateAuthorComponent},
    {path: "language", component: LanguageComponent},
    // {path: "language/new", component: CreateLanguageComponent},
    {path: "edition", component: EditionComponent},
    {path: "edition/new", component: CreateEditionComponent},
    {path: "organisation", component: OrganisationComponent},
    // {path: "organisation/new", component: CreateOrganisation},
    {path: "subject", component: SubjectComponent},
    // {path: "genre/new", component: CreateSubjectComponent},
    {path: "genre", component: GenreComponent},
    // {path: "genre/new", component: CreateGenreComponent},
    {path: "passage", component: PassageComponent},
    // {path: "passage/new", component: CreatePassageComponent },
    {path: "contributor", component: ContributorComponent},
    // {path: "passage/new", component: CreateContributorComponent },
    {path: "lexia", component: LexiaComponent},
    // {path: "lexia/new", component: CreateLexiaComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        InlineEditComponent,
        AuthorComponent,
        BookComponent,
        LanguageComponent,
        EditionComponent,
        OrganisationComponent,
        GenreComponent,
        SubjectComponent,
        PassageComponent,
        AuthorRefComponent,
        VenueRefComponent,
        OrganisationRefComponent,
        LanguageRefComponent,
        BookRefComponent,
        EditionRefComponent,
        CreateAuthorComponent,
        CreateBookComponent,
        CreateLanguageComponent,
        CreateEditionComponent,
        LexiaComponent,
        ContributorComponent
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
        EditionRefComponent,
        CreateAuthorComponent,
        CreateBookComponent,
        CreateLanguageComponent
    ]
})
export class AppModule {
}
