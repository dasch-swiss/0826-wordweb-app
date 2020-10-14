import {Component, Input, OnInit} from "@angular/core";

@Component({
    selector: "app-citation",
    templateUrl: "./citation.component.html",
    styleUrls: ["./citation.component.scss"]
})
export class CitationComponent implements OnInit {
    @Input() set original(value: boolean) {
        this.showOriginal = value;
        if (this.passage) {
            this.bibliography = this.buildBibliography();
        }
    }
    @Input() passage: any;
    private showOriginal: boolean;
    bibliography: string;

    constructor() {
    }

    ngOnInit(): void {
    }

    buildBibliography() {
        const book = this.passage.occursIn[0];

        const authors = book.isWrittenBy
            .map(author => (author.hasFirstName && author.hasFirstName[0].value !== "_") ? {firstName: author.hasFirstName[0].value, lastName: author.hasLastName[0].value} :
                {lastName: author.hasLastName[0].value}
            )
            .sort((author1, author2) => author1.lastName < author2.lastName ? -1 : (author1.lastName > author2.lastName ? 1 : 0)
            )
            .map(author => author.firstName ? `${author.lastName} ${author.firstName}` : `${author.lastName}`)
            .join(", ");

        const edition = this.passage.occursIn[0].hasEdition[0].value;
        const page = this.passage.hasPage ? this.passage.hasPage[0].value : "";
        const editionPage = `${edition} ${page}`;

        const editionHist = this.passage.occursIn[0].hasEditionHist ? this.passage.occursIn[0].hasEditionHist[0].value : null;
        const pageHist = this.passage.hasPageHist ? this.passage.hasPageHist[0].value : "";
        const editionHistPageHist = editionHist ? `${editionHist} ${pageHist}` : `No Edition Hist found`;

        const bibliography = this.showOriginal ? editionHistPageHist : editionPage;

        return `${authors}. ${bibliography}`;
    }

}
