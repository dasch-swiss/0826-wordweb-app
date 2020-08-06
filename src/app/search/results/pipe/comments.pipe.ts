import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "comments"
})
export class CommentsPipe implements PipeTransform {

    transform(passage: any): any {
        const passComment = passage.hasPassageComment ? passage.hasPassageComment[0].value : "";
        const bookComment = passage.occursIn[0].hasBookComment ? passage.occursIn[0].hasBookComment[0].value : "";

        const comments = `${passComment} <br>${bookComment}`;

        return `${comments}`;
    }

}
