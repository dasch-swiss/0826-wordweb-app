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

            const sBooks = detailPas.isMentionedIn
                .map(sPassage => sPassage.occursIn);

            const full = `${firstLine}<br> is not yet implemented`;

            return `${full}`;
        } else {
            return `[Research is missing!]`;
        }
    }

}
