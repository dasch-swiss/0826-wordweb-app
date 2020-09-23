import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "title"
})
export class TitlePipe implements PipeTransform {

    transform(passage: any): any {
        const book = passage.occursIn[0];

        const authors = book.isWrittenBy
            .map(author => (author.hasFirstName && author.hasFirstName[0].value !== "_") ? {firstName: author.hasFirstName[0].value, lastName: author.hasLastName[0].value} :
                {lastName: author.hasLastName[0].value}
            )
            .sort((author1, author2) => author1.lastName < author2.lastName ? -1 : (author1.lastName > author2.lastName ? 1 : 0)
            )
            .map(author => author.firstName ? `${author.firstName} ${author.lastName}` : `${author.lastName}`)
            .join(", ");

        const title = passage.hasDisplayedTitle[0].value === book.hasBookTitle[0].value ? `<i>${passage.hasDisplayedTitle[0].value}</i>` :
            `"${passage.hasDisplayedTitle[0].value}"`;

        const year = book.hasCreationDate[0].start === book.hasCreationDate[0].end ? `${book.hasCreationDate[0].start}` :
            `${book.hasCreationDate[0].start}-${book.hasCreationDate[0].end}`;

        return `${authors}: ${title} (${year})`;
    }

}
