import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "title"
})
export class TitlePipe implements PipeTransform {

    transform(passage: any): any {
        const book = passage.occursIn[0];
        const fullDisplayedTitle = passage.hasPrefixDisplayedTitle ? `${passage.hasPrefixDisplayedTitle[0].value} ${passage.hasDisplayedTitle[0].value}` : `${passage.hasDisplayedTitle[0].value}`;

        const title = passage.hasDisplayedTitle[0].value === book.hasBookTitle[0].value ? `<i>${fullDisplayedTitle}</i>` :
            `"${fullDisplayedTitle}"`;

        return `${title}`;
    }

}
