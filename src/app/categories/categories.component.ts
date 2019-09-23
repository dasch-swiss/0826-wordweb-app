import { Component, OnInit } from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  showAuthors() {
    this.router.navigate(["author"]);
  }

  showBooks() {
    this.router.navigate(["book"]);
  }

  showContributors() {
    this.router.navigate(["contributor"]);
  }

  showFunctionVoices() {
    this.router.navigate(["function"]);
  }

  showGenders() {
    this.router.navigate(["gender"]);
  }

  showGenres() {
    this.router.navigate(["genre"]);
  }

  showImages() {
    this.router.navigate(["image"]);
  }

  showLanguages() {
    this.router.navigate(["language"]);
  }

  showLexias() {
    this.router.navigate(["lexia"]);
  }

  showMarkings() {
    this.router.navigate(["marking"]);
  }

  showOrganisations() {
    this.router.navigate(["organisation"]);
  }

  showPassages() {
    this.router.navigate(["passage"]);
  }

  showResearchFields() {
    this.router.navigate(["research"]);
  }

  showStatus() {
    this.router.navigate(["status"]);
  }

  showSubjects() {
    this.router.navigate(["subject"]);
  }

  showVenues() {
    this.router.navigate(["venue"]);
  }

}
