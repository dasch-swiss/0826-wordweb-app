import {Pipe, PipeTransform} from "@angular/core";
import {ListService} from "../../../services/list.service";

@Pipe({
    name: "source"
})
export class SourcePipe implements PipeTransform {

    transform(detailPas: any, listService: ListService): any {
        const contributor = detailPas.wasContributedBy[0].hasFirstName ?
            `${detailPas.wasContributedBy[0].hasFirstName[0].value} ${detailPas.wasContributedBy[0].hasLastName[0].value}` :
            `${detailPas.wasContributedBy[0].hasLastName[0].value}`;

        const sPassages = detailPas.isMentionedIn;

        if (listService.getNameOfNode(detailPas.hasResearchField[0].listNode) === "Reading") {
            return `<b>Passage identified by</b> ${contributor}`;
        } else if (listService.getNameOfNode(detailPas.hasResearchField[0].listNode) === "Electronic Search") {
            const titles = sPassages
                .map(sPassage => sPassage.hasDisplayedTitle[0].value)
                .sort((sPassage1, sPassage2) => sPassage1 < sPassage2 ? -1 : (sPassage1 > sPassage2 ? 1 : 0))
                .join(" ,");

            return `<b>Passage identified by</b> ${contributor} <b>using</b> ${titles}`;
        } else if (listService.getNameOfNode(detailPas.hasResearchField[0].listNode) === "Previous Research") {
            const firstLine = `<b>Passage uploaded by</b> ${contributor} <b>and mentioned in:</b>`;
            const sources = [];

            for (const sPassage of detailPas.isMentionedIn) {
                const sBook = sPassage.occursIn[0];

                const sAuthors = sBook.isWrittenBy
                    .map(sAuthor => (sAuthor.hasFirstName && sAuthor.hasFirstName[0].value !== "_") ? {firstName: sAuthor.hasFirstName[0].value, lastName: sAuthor.hasLastName[0].value} :
                        {lastName: sAuthor.hasLastName[0].value}
                    )
                    .sort((sAuthor1, sAuthor2) => sAuthor1.lastName < sAuthor2.lastName ? -1 : (sAuthor1.lastName > sAuthor2.lastName ? 1 : 0)
                    )
                    .map((sAuthor, index) => {
                        if (index === 0) {
                            // Capitalize last name before string concatenation
                            return sAuthor.firstName ? `${sAuthor.lastName.charAt(0).toUpperCase() + sAuthor.lastName.slice(1)}, ${sAuthor.firstName}` : `${sAuthor.lastName.charAt(0).toUpperCase() + sAuthor.lastName.slice(1)}`;
                        } else {
                            // Capitalize first name before string concatenation
                            return sAuthor.firstName ? `${sAuthor.firstName.charAt(0).toUpperCase() + sAuthor.firstName.slice(1)} ${sAuthor.lastName}` : `${sAuthor.lastName.charAt(0).toUpperCase() + sAuthor.lastName.slice(1)}`;
                        }
                    });

                const numsSAuthors = sAuthors.length;
                const lastAuthor = sAuthors[sAuthors.length - 1];
                // Concatenates last two authors with "and". Ignores if there is only one author.
                if (numsSAuthors > 1) {
                    const secondLast = sAuthors[numsSAuthors - 2];
                    sAuthors.splice(numsSAuthors - 2, 2, `${secondLast} and ${lastAuthor}`);
                }

                let sAuthorString = sAuthors
                    .join(", ");
                // Adds a full stop if there is none
                sAuthorString = sAuthorString.charAt(sAuthorString.length - 1) === "." ? sAuthorString : `${sAuthorString}.`;

                const sEdition = sPassage.occursIn[0].hasEdition[0].value;
                const sPage = sPassage.hasPage ? sPassage.hasPage[0].value : "";
                const sEditionPage = `${sEdition} ${sPage}`;

                sources.push(`<div class="indent">${sAuthorString} ${sEditionPage}</div>`);
            }

            // Sorts sources alphabetically and joins with a <br> html tag
            const sourceString = sources
                .sort((source1, source2) => source1 < source2 ? -1 : (source1 > source2 ? 1 : 0))
                .join("");

            return `${firstLine}<br>${sourceString}`;
        }
    }

}
