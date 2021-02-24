import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: "app-categories",
    templateUrl: "./categories.component.html",
    styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {

    constructor(private router: Router, private route: ActivatedRoute
    ) {
    }

    ngOnInit() {}

    showAuthors() {
        this.router.navigate(["author"], {relativeTo: this.route});
    }

    showBooks() {
        this.router.navigate(["book"], {relativeTo: this.route});
    }

    showContributors() {
        this.router.navigate(["contributor"], {relativeTo: this.route});
    }

    showFormalClasses() {
        this.router.navigate(["formal"], {relativeTo: this.route});
    }

    showFunctionVoices() {
        this.router.navigate(["function"], {relativeTo: this.route});
    }

    showGenders() {
        this.router.navigate(["gender"], {relativeTo: this.route});
    }

    showGenres() {
        this.router.navigate(["genre"], {relativeTo: this.route});
    }

    showImages() {
        this.router.navigate(["image"], {relativeTo: this.route});
    }

    showLanguages() {
        this.router.navigate(["language"], {relativeTo: this.route});
    }

    showLexias() {
        this.router.navigate(["lexia"], {relativeTo: this.route});
    }

    showMarkings() {
        this.router.navigate(["marking"], {relativeTo: this.route});
    }

    showOrganisations() {
        this.router.navigate(["organisation"], {relativeTo: this.route});
    }

    showPassages() {
        this.router.navigate(["passage"], {relativeTo: this.route});
    }

    showResearchFields() {
        this.router.navigate(["research"], {relativeTo: this.route});
    }

    showStatus() {
        this.router.navigate(["status"], {relativeTo: this.route});
    }

    showSubjects() {
        this.router.navigate(["subject"], {relativeTo: this.route});
    }

    showVenues() {
        this.router.navigate(["venue"], {relativeTo: this.route});
    }

}
