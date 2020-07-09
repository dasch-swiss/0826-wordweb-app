import {Component, OnInit} from "@angular/core";
import {KnoraService} from "./services/knora.service";
import {ListService} from "./services/list.service";
import {mergeMap} from "rxjs/operators";
import {forkJoin} from "rxjs";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    readonly EMAIL = "root@example.com";
    readonly PW = "test";

    constructor(
        private listService: ListService,
        private knoraService: KnoraService) {
    }

    ngOnInit() {
        this.knoraService.login(this.EMAIL, this.PW)
            .pipe(
                mergeMap(() => this.knoraService.getAllLists()),
                mergeMap((lists: Array<any>) => forkJoin<any>(lists.map(list => this.knoraService.getList(list.id)))),
            )
            .subscribe((data: Array<any>) => {
                data.map(list => this.listService.setAllLists(list));
            });
    }
}
