import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "text"
})
export class TextPipe implements PipeTransform {

    transform(passage: any): any {
        return passage.original ? `${passage.hasTextHist[0].value}` : `${passage.hasText[0].value}`;
    }

}
