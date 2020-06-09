import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app-browsing",
    templateUrl: "./browsing.component.html",
    styleUrls: ["./browsing.component.scss"]
})
export class BrowsingComponent implements OnInit {
    chars: Array<string>;
    charSelected: string;

    static getCharacterRange() {
        const start = "A";
        const end = "Z";
        const arr: string[] = [];
        let i = start.charCodeAt(0);
        while (i <= end.charCodeAt(0)) {
            arr.push(String.fromCharCode(i));
            i++;
        }
        return arr;
    }

    constructor() {
    }

    ngOnInit() {
        this.chars = BrowsingComponent.getCharacterRange();
    }

}
