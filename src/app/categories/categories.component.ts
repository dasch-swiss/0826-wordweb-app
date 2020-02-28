import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {
    ListNode,
    ListsService,
    OntologyService,
    Project,
    ProjectsService,
    ResourceService
} from "@knora/core";
import {ApiService} from "../services/api.service";
import {KnoraApiConfig, KnoraApiConnection, ReadListValue, ReadResource} from "@knora/api";

@Component({
    selector: "app-categories",
    templateUrl: "./categories.component.html",
    styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {

    readonly url = "http://rdfh.ch/projects/0826";
    readonly urlOntology = "http://www.knora.org/ontology/0826/teimww";

    knoraApiConnection: KnoraApiConnection;

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

        const config = new KnoraApiConfig("http", "0.0.0.0", 3333);
        this.knoraApiConnection = new KnoraApiConnection(config);
        console.log(this.knoraApiConnection);

        this.knoraApiConnection.v2.auth.login("email", "root@example.com", "test").subscribe(
            login => {

                this.knoraApiConnection.v2.res.getResource("http://rdfh.ch/0826/-9mv4JbRQwKjA1lyCM6B1g").subscribe(
                    (res: ReadResource) => {
                        console.log(res);

                        const vals1 = res.getValues("http://0.0.0.0:3333/ontology/0826/teimww/v2#hasGenre");

                        const vals = res.getValuesAs("http://0.0.0.0:3333/ontology/0826/teimww/v2#hasGenre", ReadListValue);

                        console.log(vals);
                    },
                    (error) => {
                        console.log(error);
                    }
                );

                const gravsearch = `
                PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
                PREFIX teimww: <http://0.0.0.0:3333/ontology/0826/teimww/simple/v2#>

                CONSTRUCT {
                    ?book knora-api:isMainResource true .
                    ?book teimww:bookInternalId ?internalID .
                    ?book teimww:bookTitle ?bookTitle .
                    ?book teimww:edition ?edition .
                    ?book teimww:editionHist ?editionHist .
                    ?book teimww:isWrittenBy ?writtenBy .
                    #?book teimww:createdDate ?createdDate .
                    ?book teimww:publishDate ?publishDate .
                    #?book teimww:firstPerformanceDate ?firstPerformanceDate .
                    ?book teimww:hasLanguage ?hasLanguage .
                    ?book teimww:hasGenre ?hasGenre .
                    ?book teimww:hasSubject ?hasSubject .
                    #?book teimww:performedBy ?performedBy .
                    #?book teimww:performedIn ?performedIn .
                    #?book teimww:lexiaAsBook ?lexiaAsBook .
                } WHERE {
                    ?book a teimww:book .
                    OPTIONAL {
                        ?book teimww:bookInternalId ?internalID .
                        ?book teimww:bookTitle ?bookTitle .
                        ?book teimww:edition ?edition .
                        ?book teimww:editionHist ?editionHist .
                        ?book teimww:isWrittenBy ?writtenBy .
                        #?book teimww:createdDate ?createdDate .
                        ?book teimww:publishDate ?publishDate .
                        #?book teimww:firstPerformanceDate ?firstPerformanceDate .
                        ?book teimww:hasLanguage ?hasLanguage .
                        ?book teimww:hasGenre ?hasGenre .
                        ?book teimww:hasSubject ?hasSubject .
                        #?book teimww:performedBy ?performedBy .
                        #?book teimww:performedIn ?performedIn .
                        #?book teimww:lexiaAsBook ?lexiaAsBook .
                    }
                }

                OFFSET 0

                `;

                this.knoraApiConnection.v2.search.doExtendedSearch(gravsearch).subscribe(
                    searchRes => {
                        console.log(searchRes);
                    }
                );

            }
        );
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
