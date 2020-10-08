import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "title"
})
export class TitlePipe implements PipeTransform {

    transform(passage: any): any {
        const book = passage.occursIn[0];

        const title = passage.hasDisplayedTitle[0].value === book.hasBookTitle[0].value ? `<i>${passage.hasDisplayedTitle[0].value}</i>` :
            `"${passage.hasDisplayedTitle[0].value}"`;

        return `${title}`;
    }

}
