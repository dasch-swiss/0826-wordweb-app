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
            .map((author, index) => {
                if (index === 0) {
                    // Capitalize last name before string concatenation
                    return author.firstName ? `${author.lastName.charAt(0).toUpperCase() + author.lastName.slice(1)}, ${author.firstName}` : `${author.lastName.charAt(0).toUpperCase() + author.lastName.slice(1)}`;
                } else {
                    // Capitalize first name before string concatenation
                    return author.firstName ? `${author.firstName.charAt(0).toUpperCase() + author.firstName.slice(1)} ${author.lastName}` : `${author.lastName.charAt(0).toUpperCase() + author.lastName.slice(1)}`;
                }
            });

        const numAuthors = authors.length;
        const lastAuthor = authors[authors.length - 1];
        // Concatenates last two authors with "and". Ignores if there is only one author.
        if (numAuthors > 1) {
            const secondLast = authors[numAuthors - 2];
            authors.splice(numAuthors - 2, 2, `${secondLast} and ${lastAuthor}`);
        }

        let authorString = authors
            .join(", ");

        // Adds a full stop if there is none
        authorString = authorString.charAt(authorString.length - 1) === "." ? authorString : `${authorString}.`;

        const edition = this.passage.occursIn[0].hasEdition[0].value;
        const page = this.passage.hasPage ? this.passage.hasPage[0].value : "";
        const editionPage = `${edition} ${page}`;

        const editionHist = this.passage.occursIn[0].hasEditionHist ? this.passage.occursIn[0].hasEditionHist[0].value : null;
        const pageHist = this.passage.hasPageHist ? this.passage.hasPageHist[0].value : "";
        const editionHistPageHist = editionHist ? `${editionHist} ${pageHist}` : `No Edition Hist found`;

        const bibliography = this.showOriginal ? editionHistPageHist : editionPage;

        return `${authorString} ${bibliography}`;
    }

}
