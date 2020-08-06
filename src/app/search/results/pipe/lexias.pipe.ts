import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "lexias"
})
export class LexiasPipe implements PipeTransform {

    transform(passage: any): any {
        return passage.contains
            .map(lexia => lexia.hasLexiaDisplayedTitle ? lexia.hasLexiaDisplayedTitle[0].value :
                `${lexia.hasLexiaTitle[0].value} (No displayed Title)`)
            .join("<br>");
    }

}
