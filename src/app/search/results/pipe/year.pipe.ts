import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "year"
})
export class YearPipe implements PipeTransform {

    transform(passage: any): any {
        const book = passage.occursIn[0];

        const year = book.hasCreationDate[0].start === book.hasCreationDate[0].end ? `${book.hasCreationDate[0].start} ${book.hasCreationDate[0].sEra}` :
            `${book.hasCreationDate[0].start} ${book.hasCreationDate[0].sEra} - ${book.hasCreationDate[0].end} ${book.hasCreationDate[0].eEra}`;

        return `(${year})`;

    }
}
