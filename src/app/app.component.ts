import {Component, OnInit} from "@angular/core";
import {KnoraService} from "./services/knora.service";
import {ListService} from "./services/list.service";

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
            .subscribe(loginData => {
                console.log(loginData);
                this.prepareLists();
            });
    }

    prepareLists() {
        this.knoraService.getAllLists()
            .subscribe(lists => {
                lists.map(list => {
                    this.knoraService.getList(list.id)
                        .subscribe(data => {
                            this.listService.setAllLists(data);
                            // this.listService.print();
                        });
                });
            });
    }
}
