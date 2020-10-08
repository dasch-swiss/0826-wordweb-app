import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "authors"
})
export class AuthorsPipe implements PipeTransform {

    transform(author: any): any {
        const a = (author.hasFirstName && author.hasFirstName[0].value !== "_") ? {firstName: author.hasFirstName[0].value, lastName: author.hasLastName[0].value} :
                {lastName: author.hasLastName[0].value};

        const formatedAuthor = a.firstName ? `${a.firstName} ${a.lastName}` : `${a.lastName}`;

        return `${formatedAuthor}`;
    }

}
