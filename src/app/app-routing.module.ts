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
  {path: "categories", component: CategoriesComponent},
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
  {path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
