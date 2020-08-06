import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "numbering"
})
export class NumberingPipe implements PipeTransform {

    transform(index: number): any {
        return `[${index + 1}]`;
    }

}
