import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "bibliography"
})
export class BibliographyPipe implements PipeTransform {

    transform(detailPas: any): any {
        const book = detailPas.occursIn[0];

        const authors = book.isWrittenBy
            .map(author => (author.hasFirstName && author.hasFirstName[0].value !== "_") ? {firstName: author.hasFirstName[0].value, lastName: author.hasLastName[0].value} :
                {lastName: author.hasLastName[0].value}
            )
            .sort((author1, author2) => author1.lastName < author2.lastName ? -1 : (author1.lastName > author2.lastName ? 1 : 0)
            )
            .map(author => author.firstName ? `${author.lastName} ${author.firstName}` : `${author.lastName}`)
            .join(", ");

        const edition = detailPas.occursIn[0].hasEdition[0].value;
        const page = detailPas.hasPage ? detailPas.hasPage[0].value : "";
        const editionPage = `${edition} ${page}`;

        const editionHist = detailPas.occursIn[0].hasEditionHist ? detailPas.occursIn[0].hasEditionHist[0].value : null;
        const pageHist = detailPas.hasPageHist ? detailPas.hasPageHist[0].value : "";
        const editionHistPageHist = editionHist ? `${editionHist} ${pageHist}` : `No Edition Hist found`;

        const bibliography = detailPas.original ? editionHistPageHist : editionPage;

        return `${authors}. ${bibliography}`;
    }

}
