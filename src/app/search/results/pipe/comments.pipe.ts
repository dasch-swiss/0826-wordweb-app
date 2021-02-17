import {Pipe, PipeTransform} from "@angular/core";
import {ListService} from "../../../services/list.service";

@Pipe({
    name: "comments"
})
export class CommentsPipe implements PipeTransform {

    transform(passage: any, listService: ListService): any {
        const passComment = passage.hasPassageComment ? passage.hasPassageComment[0].value : null;
        const bookComment = passage.occursIn[0].hasBookComment ? `${passage.occursIn[0].hasBookComment[0].value}<br>${this.generateBookComment(passage.occursIn[0], listService)}` : this.generateBookComment(passage.occursIn[0], listService);

        const comment = passComment ? `${passComment} <br>${bookComment}` : `${bookComment}`;

        return `${comment}`;
    }

    generateBookComment(book: any, listService: ListService): string {
        // TODO: What if there are more than one genre?
        const genre = listService.getNameOfNode(book.hasGenre[0].listNode).toLowerCase();
        const firstPerDate = book.hasFirstPerformanceDate ? (book.hasFirstPerformanceDate[0].start === book.hasFirstPerformanceDate[0].end ? `in ${book.hasFirstPerformanceDate[0].start}` : `between ${book.hasFirstPerformanceDate[0].start} and ${book.hasFirstPerformanceDate[0].end}`) : null;
        const firstPrintDate = book.hasPublicationDate ? (book.hasPublicationDate[0].start === book.hasPublicationDate[0].end ? `in ${book.hasPublicationDate[0].start}` : `between ${book.hasPublicationDate[0].start} and ${book.hasPublicationDate[0].end}`) : null;
        const perByCom = book.performedBy ? (book.performedBy.length === 2 ? `${book.performedBy[0].hasCompanyTitle[0].value} or ${book.performedBy[1].hasCompanyTitle[0].value}` : `${book.performedBy[0].hasCompanyTitle[0].value}`) : null;
        let perByActors = null;
        if (book.performedByActor) {
            const actors = book.performedByActor
                .map(author => (author.hasFirstName && author.hasFirstName[0].value !== "_") ? {firstName: author.hasFirstName[0].value, lastName: author.hasLastName[0].value} :
                    {lastName: author.hasLastName[0].value}
                )
                .sort((author1, author2) => author1.lastName < author2.lastName ? -1 : (author1.lastName > author2.lastName ? 1 : 0)
                )
                .map((author) =>
                    // Capitalize first name before string concatenation
                    author.firstName ? `${author.firstName.charAt(0).toUpperCase() + author.firstName.slice(1)} ${author.lastName}` : `${author.lastName.charAt(0).toUpperCase() + author.lastName.slice(1)}`
                );

            const numActors = actors.length;
            const lastAuthor = actors[actors.length - 1];
            // Concatenates last two authors with "and". Ignores if there is only one author.
            if (numActors > 1) {
                const secondLast = actors[numActors - 2];
                actors.splice(numActors - 2, 2, `${secondLast} and ${lastAuthor}`);
            }

            perByActors = actors
                .join(", ");
        }
        let perInVen = null;
        if (book.performedIn) {
            if (book.performedIn.length === 2) {
                const ven1Node = listService.getNode(book.performedIn[0].hasPlaceVenue[0].listNode);
                const ven2Node = listService.getNode(book.performedIn[1].hasPlaceVenue[0].listNode);
                // Checks if nodes are not null
                if (ven1Node && ven2Node) {
                    const ven1 = `${ven1Node.name} in ${listService.getNameOfNode(ven1Node.parentNodeId)}`;
                    const ven2 = `${ven2Node.name} in ${listService.getNameOfNode(ven2Node.parentNodeId)}`;
                    perInVen = `${ven1} or at ${ven2}`;
                }
            } else {
                const venNode = listService.getNode(book.performedIn[0].hasPlaceVenue[0].listNode);
                // Checks if node is not null
                if (venNode) {
                    perInVen = `${venNode.name} in ${listService.getNameOfNode(venNode.parentNodeId)}`;
                }
            }
        }

        const genreCode = genre ? "1" : "0";
        const firstPerDateCode = firstPerDate ? "1" : "0";
        const firstPrintDateCode = firstPrintDate ? "1" : "0";
        const perByComCode = perByCom ? "1" : "0";
        const perByActorsCode = perByActors ? "1" : "0";
        const perInVenCode = perInVen ? "1" : "0";

        const fullCode = `${firstPrintDateCode}${perInVenCode}${perByActorsCode}${perByComCode}${firstPerDateCode}${genreCode}`;

        const codeObject = {
            "000001": ``,
            "000011": `This ${genre} was first performed ${firstPerDate}.`,
            "000101": `This ${genre} was first performed by ${perByCom}.`,
            "000111": `This ${genre} was first performed by ${perByCom} ${firstPerDate}.`,
            "001001": `The cast of the first performance of this ${genre} included ${perByActors}.`,
            "001011": `This ${genre} was first performed ${firstPerDate}. The cast included ${perByActors}.`,
            "001101": `This ${genre} was first performed by ${perByCom}. The cast included ${perByActors}.`,
            "001111": `This ${genre} was first performed by ${perByCom} ${firstPerDate}. The cast included ${perByActors}.`,
            "010001": `This ${genre} was first performed at ${perInVen}.`,
            "010011": `This ${genre} was first performed at ${perInVen} ${firstPerDate}.`,
            "010101": `This ${genre} was first performed by ${perByCom} at ${perInVen}.`,
            "010111": `This ${genre} was first performed by ${perByCom} at ${perInVen} ${firstPerDate}.`,
            "011001": `This ${genre} was first performed at ${perInVen}. The cast included ${perByActors}.`,
            "011011": `This ${genre} was first performed at ${perInVen} ${firstPerDate}. The cast included ${perByActors}.`,
            "011101": `This ${genre} was first performed by ${perByCom} at ${perInVen}. The cast included ${perByActors}.`,
            "011111": `This ${genre} was first performed by ${perByCom} at ${perInVen} ${firstPerDate}. The cast included ${perByActors}.`,
            "100001": `This ${genre} was first printed ${firstPrintDate}`,
            "100011": `This ${genre} was first performed ${firstPerDate}. The text was first printed ${firstPrintDate}.`,
            "100101": `This ${genre} was first performed by ${perByCom}. The text was first printed ${firstPrintDate}.`,
            "100111": `This ${genre} was first performed by ${perByCom} ${firstPerDate}. The text was first printed ${firstPrintDate}.`,
            "101001": `The cast of the first performance of this ${genre} included ${perByActors}. The text was first printed ${firstPrintDate}.`,
            "101011": `This ${genre} was first performed ${firstPerDate}. The cast included ${perByActors}. The text was first printed ${firstPrintDate}.`,
            "101101": `This ${genre} was first performed by ${perByCom}. The cast included ${perByActors}. The text was first printed ${firstPrintDate}.`,
            "101111": `This ${genre} was first performed by ${perByCom} ${firstPerDate}. The cast included ${perByActors}. The text was first printed ${firstPrintDate}.`,
            "110001": `This ${genre} was first performed at ${perInVen}. The text was first printed ${firstPrintDate}.`,
            "110011": `This ${genre} was first performed at ${perInVen} ${firstPerDate}. The text was first printed ${firstPrintDate}.`,
            "110101": `This ${genre} was first performed by ${perByCom} at ${perInVen}. The text was first printed ${firstPrintDate}.`,
            "110111": `This ${genre} was first performed by ${perByCom} at ${perInVen} ${firstPerDate}. The text was first printed ${firstPrintDate}.`,
            "111001": `This ${genre} was first performed at ${perInVen}. The cast included ${perByActors}. The text was first printed ${firstPrintDate}.`,
            "111011": `This ${genre} was first performed at ${perInVen} ${firstPerDate}. The cast included ${perByActors}. The text was first printed ${firstPrintDate}.`,
            "111101": `This ${genre} was first performed by ${perByCom} at ${perInVen}. The cast included ${perByActors}. The text was first printed ${firstPrintDate}.`,
            "111111": `This ${genre} was first performed by ${perByCom} at ${perInVen} ${firstPerDate}. The cast included ${perByActors}. The text was first printed ${firstPrintDate}.`
        };

        return  codeObject[fullCode] ? codeObject[fullCode] : "";
    }

}
