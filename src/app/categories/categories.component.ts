import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {
  ApiServiceError,
  ApiServiceResult,
  ListNode,
  ListsService,
  OntologyService,
  Project,
  ProjectsService,
  ResourceService
} from "@knora/core";

@Component({
    selector: "app-categories",
    templateUrl: "./categories.component.html",
    styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {

    constructor(
        private router: Router,
        private projectService: ProjectsService,
        private listService: ListsService,
        private ontologyService: OntologyService,
        private resourceService: ResourceService
    ) {
    }

    ngOnInit() {
        // this.projectService.getProjectByShortcode("0826")
        //     .subscribe((data: Project) => {
        //             console.log(data);
        //         },
        //         (error: ApiServiceError) => {
        //             console.error(error);
        //         }
        //     );
        //
        // this.listService.getLists("http://rdfh.ch/projects/0826")
        //     .subscribe((data: ListNode[]) => {
        //         console.log(data);
        //     }, (error: ApiServiceError) => {
        //         console.error(error);
        //     });
        //
        // this.ontologyService.getProjectOntologies("http://rdfh.ch/projects/0826")
        //     .subscribe((result: ApiServiceResult) => {
        //       console.log(result);
        //     }, (error: ApiServiceError) => {
        //       console.error(error);
        //     });
        //
        // this.resourceService.getResource("http://rdfh.ch/0826/MfU3t95jQiqQ72dmI_bzdQ")
        //     .subscribe((data: any) => {
        //       console.log(data);
        //     }, (error: ApiServiceError) => {
        //       console.error(error);
        //     });
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
