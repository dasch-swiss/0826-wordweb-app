import {BrowserModule} from "@angular/platform-browser";
import {APP_INITIALIZER, NgModule} from "@angular/core";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {ResourceComponent} from "./resource/resource.component";
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

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

import {NgxSpinnerModule} from "ngx-spinner";

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

import {HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";

import {SearchComponent} from "./search/search.component";
import {SimpleSearchComponent} from "./search/simple-search/simple-search.component";
import {AdvancedSearchComponent} from "./search/advanced-search/advanced-search.component";
import {ExpertSearchComponent} from "./search/expert-search/expert-search.component";
import {BrowsingComponent} from "./search/browsing/browsing.component";
import {HelpComponent} from "./search/dialog/help/help.component";
import {ResultsComponent} from "./search/results/results.component";
import {FillInComponent} from "./search/dialog/fill-in/fill-in.component";
import {CitationComponent} from "./search/results/citation/citation.component";
import {PassageInfoComponent} from "./resource/passage-info/passage-info.component";

import {NumberingPipe} from "./search/results/pipe/numbering.pipe";
import {TitlePipe} from "./search/results/pipe/title.pipe";
import {TextPipe} from "./search/results/pipe/text.pipe";
import {CommentsPipe} from "./search/results/pipe/comments.pipe";
import {SourcePipe} from "./search/results/pipe/source.pipe";
import {LexiasPipe} from "./search/results/pipe/lexias.pipe";
import {AuthorsPipe} from "./search/results/pipe/authors.pipe";
import {YearPipe} from "./search/results/pipe/year.pipe";

import {AppInitService} from "./app-init.service";
import {KnoraService} from "./services/knora.service";
import {ListService} from "./services/list.service";
import {GravsearchBuilderService} from "./services/gravsearch-builder.service";
import { EditCompanyComponent } from './edit/edit-company/edit-company.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { EditComponent } from './edit/edit.component';
import { ConfirmationComponent } from './edit/confirmation/confirmation.component';
import { EditPersonComponent } from './edit/edit-person/edit-person.component';
import {DatePipe} from '@angular/common';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from '@angular/material/core';
import { DateValueComponent } from './edit/date-value/date-value.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { EditLexiaComponent } from './edit/edit-lexia/edit-lexia.component';

export function initializeApp(appInitService: AppInitService) {
    return (): Promise<any> => appInitService.Init();
}

@NgModule({
    declarations: [
        AppComponent,
        ResourceComponent,
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
        CreateUpdateGenreComponent,
        SearchComponent,
        SimpleSearchComponent,
        AdvancedSearchComponent,
        ExpertSearchComponent,
        BrowsingComponent,
        HelpComponent,
        ResultsComponent,
        CitationComponent,
        FillInComponent,
        PassageInfoComponent,
        NumberingPipe,
        TitlePipe,
        TextPipe,
        CommentsPipe,
        SourcePipe,
        LexiasPipe,
        AuthorsPipe,
        YearPipe,
        EditCompanyComponent,
        EditComponent,
        ConfirmationComponent,
        EditPersonComponent,
        DateValueComponent,
        EditLexiaComponent,
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
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatTabsModule,
        MatButtonToggleModule,
        MatDialogModule,
        NgxSpinnerModule,
        MatProgressBarModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
    ],
    providers: [
        AppInitService,
        ListService,
        GravsearchBuilderService,
        DatePipe,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppInitService, GravsearchBuilderService, KnoraService],
            multi: true
        },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {duration: 2000}
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
        CategoryRefComponent,
        HelpComponent
    ]
})
export class AppModule {
}
