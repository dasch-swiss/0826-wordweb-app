import {Component, EventEmitter, OnInit, Output} from "@angular/core";

@Component({
    selector: "app-abc-index",
    templateUrl: "./abc-index.component.html",
    styleUrls: ["./abc-index.component.scss"]
})
export class AbcIndexComponent implements OnInit {
    char: Array<string>;

    @Output()
    charChange = new EventEmitter();

    constructor() {
        this.char = AbcIndexComponent.getCharacterRange("A", "Z");
    }

    static getCharacterRange(start: string, end: string) {
        const arr: string[] = [];
        let i = start.charCodeAt(0);
        while (i <= end.charCodeAt(0)) {
            arr.push(String.fromCharCode(i));
            i++;
        }
        return arr;
    }

    ngOnInit() {
    }

    charClicked(event) {
        this.charChange.emit(event.value);
    }

}
