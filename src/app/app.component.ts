import {Component, OnInit} from "@angular/core";
import packageInfo from "../../package.json";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    public version: string = packageInfo.version;

    constructor() {
    }

    ngOnInit() {
    }
}
