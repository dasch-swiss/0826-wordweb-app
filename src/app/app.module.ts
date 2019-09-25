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
import { CategoriesComponent } from "./categories/categories.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { FunctionVoiceComponent } from "./category/function-voice/function-voice.component";
import { GenderComponent } from "./category/gender/gender.component";
import { ImageComponent } from "./category/image/image.component";
import { MarkingComponent } from "./category/marking/marking.component";
import { ResearchFieldComponent } from "./category/research-field/research-field.component";
import { StatusComponent } from "./category/status/status.component";
import { VenueComponent } from "./category/venue/venue.component";

const routes: Routes = [
    {path: "categories", component: CategoriesComponent},
    {path: "", redirectTo: "categories", pathMatch: "full"},
    {path: "author", component: AuthorComponent},
    {path: "book", component: BookComponent},
    {path: "contributor", component: ContributorComponent},
    {path: "function", component: FunctionVoiceComponent},
    {path: "gender", component: GenderComponent},
    {path: "genre", component: GenreComponent},
    {path: "image", component: ImageComponent},
    {path: "language", component: LanguageComponent},
    {path: "lexia", component: LexiaComponent},
    {path: "marking", component: MarkingComponent},
    {path: "organisation", component: OrganisationComponent},
    {path: "passage", component: PassageComponent},
    {path: "research", component: ResearchFieldComponent},
    {path: "status", component: StatusComponent},
    {path: "subject", component: SubjectComponent},
    {path: "venue", component: VenueComponent},
    {path: "**", component: PageNotFoundComponent}
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
        CategoriesComponent,
        PageNotFoundComponent,
        FunctionVoiceComponent,
        GenderComponent,
        ImageComponent,
        MarkingComponent,
        ResearchFieldComponent,
        StatusComponent,
        VenueComponent,
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
