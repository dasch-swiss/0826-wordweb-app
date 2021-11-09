import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
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
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {OrganisationComponent} from "./categories/organisation/organisation.component";
import {PassageComponent} from "./categories/passage/passage.component";
import {ResearchFieldComponent} from "./categories/research-field/research-field.component";
import {StatusComponent} from "./categories/status/status.component";
import {SubjectComponent} from "./categories/subject/subject.component";
import {VenueComponent} from "./categories/venue/venue.component";
import {FormalClassComponent} from "./categories/formal-class/formal-class.component";
import {SearchComponent} from "./search/search.component";
import {SimpleSearchComponent} from "./search/simple-search/simple-search.component";
import {AdvancedSearchComponent} from "./search/advanced-search/advanced-search.component";
import {ExpertSearchComponent} from "./search/expert-search/expert-search.component";
import {BrowsingComponent} from "./search/browsing/browsing.component";
import {ResourceComponent} from "./resource/resource.component";

import {EditComponent} from "./edit/edit.component";
import {EditCompanyComponent} from "./edit/edit-company/edit-company.component";
import {EditPersonComponent} from "./edit/edit-person/edit-person.component";
import {EditLexiaComponent} from "./edit/edit-lexia/edit-lexia.component";
import {EditPassageComponent} from "./edit/edit-passage/edit-passage.component";
import {EditBookComponent} from "./edit/edit-book/edit-book.component";

const routes: Routes = [
  {path: "", redirectTo: "search", pathMatch: "full"},
  {
    path: "search",
    component: SearchComponent,
    children: [
      {path: "", redirectTo: "simple", pathMatch: "full"},
      {path: "simple", component: SimpleSearchComponent},
      {path: "advanced", component: AdvancedSearchComponent},
      {path: "expert", component: ExpertSearchComponent},
      {path: "browsing", component: BrowsingComponent},
    ]
  },
  {path: "resource/:id", component: ResourceComponent},
  {
    path: "categories",
    children: [
      {path: "", component: CategoriesComponent},
      {path: "author", component: AuthorComponent},
      {path: "book", component: BookComponent},
      {path: "contributor", component: ContributorComponent},
      {path: "formal", component: FormalClassComponent},
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
      {path: "", component: PageNotFoundComponent}
    ]
  },
  {path: "edit", component: EditComponent},
  {
    path: "edit",
    children: [
      {path: "company/:iri", component: EditCompanyComponent},
      {path: "company", component: EditCompanyComponent},
      {path: "person/:iri", component: EditPersonComponent},
      {path: "person", component: EditPersonComponent},
      {path: "lexia/:iri", component: EditLexiaComponent},
      {path: "lexia", component: EditLexiaComponent},
      {path: "passage/:iri", component: EditPassageComponent},
      {path: "passage", component: EditPassageComponent},
      {path: "book/:iri", component: EditBookComponent},
      {path: "book", component: EditBookComponent}
    ],
  },
  {path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: "enabled",
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
