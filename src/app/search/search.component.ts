import {Component, OnInit} from "@angular/core";
import {KnoraService} from "../services/knora.service";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {

    constructor(private knoraService: KnoraService) {
    }

    ngOnInit() {
        this.knoraService.login("root@example.com", "test")
            .subscribe(bla => {
                console.log(bla);
                this.knoraService.getPassageWithText("Queen Margaret")
                    .subscribe(blabla => console.log(blabla));
                this.knoraService.getPassageWithBookTitle("Hamlet")
                    .subscribe(a => console.log(a));
            });
    }

}
