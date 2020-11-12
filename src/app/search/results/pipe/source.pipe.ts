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

        if (listService.searchNodeById(detailPas.hasResearchField[0].listNode) === "Reading") {
            return `<b>Passage identified by</b> ${contributor}`;
        } else if (listService.searchNodeById(detailPas.hasResearchField[0].listNode) === "Electronic Search") {
            const titles = sPassages
                .map(sPassage => sPassage.hasDisplayedTitle[0].value)
                .sort((sPassage1, sPassage2) => sPassage1 < sPassage2 ? -1 : (sPassage1 > sPassage2 ? 1 : 0))
                .join(" ,");

            return `<b>Passage identified by</b> ${contributor} <b>using</b> ${titles}`;
        } else if (listService.searchNodeById(detailPas.hasResearchField[0].listNode) === "Previous Research") {
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
                    .map(sAuthor => sAuthor.firstName ? `${sAuthor.lastName} ${sAuthor.firstName}` : `${sAuthor.lastName}`)
                    .join(", ");

                const sEdition = sPassage.occursIn[0].hasEdition[0].value;
                const sPage = sPassage.hasPage ? sPassage.hasPage[0].value : "";
                const sEditionPage = `${sEdition} ${sPage}`;

                sources.push(`${sAuthors}. ${sEditionPage}`);
            }

            let full = `${firstLine}`;

            sources.map(source => {
                full = `${full}<br>${source}`;
            });

            return `${full}`;
        } else {
            return `[Research is missing!]`;
        }
    }

}
