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
import {ApiService} from "../services/api.service";

@Component({
    selector: "app-categories",
    templateUrl: "./categories.component.html",
    styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {

    readonly url = "http://rdfh.ch/projects/0826";
    readonly urlOntology = "http://www.knora.org/ontology/0826/teimww";

    constructor(
        private router: Router,
        private projectService: ProjectsService,
        private listService: ListsService,
        private ontologyService: OntologyService,
        private resourceService: ResourceService,
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
        // this.projectService.getProjectByShortcode("0826")
        //     .subscribe((data: Project) => {
        //             console.log("1", data);
        //         },
        //         (error: ApiServiceError) => {
        //             console.error("1", error);
        //         }
        //     );
        //
        // this.listService.getLists(this.url)
        //     .subscribe((data: ListNode[]) => {
        //         console.log("2", data);
        //     }, (error: ApiServiceError) => {
        //         console.error("2", error);
        //     });
        //
        // this.ontologyService.getProjectOntologies(this.url)
        //     .subscribe((result: ApiServiceResult) => {
        //         console.log("3", result);
        //     }, (error: ApiServiceError) => {
        //         console.error("3", error);
        //     });
        //
        // this.resourceService.getResource("http://rdfh.ch/lists/0826/8fwWdBH_Rd2hy26E1FIhQg")
        //     .subscribe((data: any) => {
        //         console.log("4", data);
        //     }, (error: ApiServiceError) => {
        //         console.error("4", error);
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

    showFormalClasses() {
        this.router.navigate(["formal"]);
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
