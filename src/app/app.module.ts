import {BrowserModule} from "@angular/platform-browser";
import {APP_INITIALIZER, NgModule} from "@angular/core";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CategoriesComponent} from "./categories/categories.component";
import {AuthorComponent} from "./categories/author/author.component";
import {BookComponent} from "./categories/book/book.component";
import {ContributorComponent} from "./categories/contributor/contributor.component";
import {FunctionVoiceComponent} from "./categories/function-voice/function-voice.component";
import {GenderComponent} from "./categories/gender/gender.component";
import {GenreComponent} from "./categories/genre/genre.component";
import {ImageComponent} from "./categories/image/image.component";
import {LanguageComponent} from "./categories/language/language.component";
import {LexiaComponent} from "./categories/lexia/lexia.component";
import {MarkingComponent} from "./categories/marking/marking.component";
import {OrganisationComponent} from "./categories/organisation/organisation.component";
import {PassageComponent} from "./categories/passage/passage.component";
import {ResearchFieldComponent} from "./categories/research-field/research-field.component";
import {StatusComponent} from "./categories/status/status.component";
import {SubjectComponent} from "./categories/subject/subject.component";
import {VenueComponent} from "./categories/venue/venue.component";
import {FormalClassComponent} from "./categories/formal-class/formal-class.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {
    MAT_SNACK_BAR_DEFAULT_OPTIONS,
    MatButtonModule,
    MatCardModule, MatCheckboxModule,
    MatChipsModule,
    MatDialogModule, MatDividerModule,
    MatIconModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule,
    MatTableModule
} from "@angular/material";
import {SatPopoverModule} from "@ncstate/sat-popover";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material";
import {InlineEditComponent} from "./inline-edit/inline-edit.component";
import {MatExpansionModule} from "@angular/material";
import {CreateUpdateAuthorComponent} from "./categories/author/create-update-author/create-update-author.component";
import {CreateUpdateBookComponent} from "./categories/book/create-update-book/create-update-book.component";
import {CreateUpdateContributorComponent} from "./categories/contributor/create-update-contributor/create-update-contributor.component";
import {CreateUpdateLanguageComponent} from "./categories/language/create-update-language/create-update-language.component";
import {CreateUpdateLexiaComponent} from "./categories/lexia/create-update-lexia/create-update-lexia.component";
import {CreateUpdateOrganisationComponent} from "./categories/organisation/create-update-organisation/create-update-organisation.component";
import {CreateUpdateVenueComponent} from "./categories/venue/create-update-venue/create-update-venue.component";
import {CreateUpdatePassageComponent} from "./categories/passage/create-update-passage/create-update-passage.component";
import {CreateUpdateGenderComponent} from "./categories/gender/create-update-gender/create-update-gender.component";
import {CreateUpdateStatusComponent} from "./categories/status/create-update-status/create-update-status.component";
import {CreateUpdateGenreComponent} from "./categories/genre/create-update-genre/create-update-genre.component";
import {AuthorRefComponent} from "./dialog/author-ref/author-ref.component";
import {BookRefComponent} from "./dialog/book-ref/book-ref.component";
import {PassageRefComponent} from "./dialog/passage-ref/passage-ref.component";
import {TreeRefComponent} from "./dialog/tree-ref/tree-ref.component";
import {CategoryRefComponent} from "./dialog/category-ref.component";
import {AppInitService} from "./app-init.service";
import {KuiCoreConfigToken} from "@knora/core";
import {HttpClientModule} from "@angular/common/http";

export function initializeApp(appInitService: AppInitService) {
    return (): Promise<any> => {
        return appInitService.Init();
    };
}

@NgModule({
    declarations: [
        AppComponent,
        CategoriesComponent,
        AuthorComponent,
        BookComponent,
        ContributorComponent,
        FunctionVoiceComponent,
        GenderComponent,
        GenreComponent,
        ImageComponent,
        LanguageComponent,
        LexiaComponent,
        MarkingComponent,
        OrganisationComponent,
        PassageComponent,
        ResearchFieldComponent,
        StatusComponent,
        SubjectComponent,
        VenueComponent,
        PageNotFoundComponent,
        InlineEditComponent,
        CreateUpdateAuthorComponent,
        CreateUpdateBookComponent,
        CreateUpdateContributorComponent,
        CreateUpdateLanguageComponent,
        CreateUpdateLexiaComponent,
        CreateUpdateOrganisationComponent,
        CreateUpdateVenueComponent,
        CreateUpdatePassageComponent,
        CreateUpdateGenderComponent,
        CreateUpdateStatusComponent,
        AuthorRefComponent,
        BookRefComponent,
        PassageRefComponent,
        TreeRefComponent,
        CategoryRefComponent,
        FormalClassComponent,
        CreateUpdateGenreComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatCardModule,
        MatSortModule,
        MatInputModule,
        MatExpansionModule,
        MatSelectModule,
        MatDialogModule,
        MatTableModule,
        MatDividerModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        SatPopoverModule,
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule
    ],
    providers: [
        AppInitService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppInitService],
            multi: true
        },
        {
            provide: KuiCoreConfigToken,
            useFactory: () => AppInitService.coreConfig
        },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000}
        }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        CreateUpdateAuthorComponent,
        CreateUpdateBookComponent,
        CreateUpdateContributorComponent,
        CreateUpdateLanguageComponent,
        CreateUpdateLexiaComponent,
        CreateUpdateOrganisationComponent,
        CreateUpdatePassageComponent,
        CreateUpdateVenueComponent,
        CreateUpdateGenderComponent,
        CreateUpdateStatusComponent,
        CreateUpdateGenreComponent,
        AuthorRefComponent,
        BookRefComponent,
        TreeRefComponent,
        CategoryRefComponent
    ]
})
export class AppModule {
}
