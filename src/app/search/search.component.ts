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
                    .subscribe(res1 => console.log(res1));
                // this.knoraService.getPassageWithBookTitle("Hamlet")
                //     .subscribe(res2 => console.log(res2));
                // this.knoraService.getAllBooks()
                //     .subscribe(res3 => console.log(res3));
                // this.knoraService.getSecBooks()
                //     .subscribe(sec => console.log(sec));
                this.knoraService.getPassageAuthor("http://rdfh.ch/0826/il495XbLTy-868vGZQj_fQ")
                    .subscribe(res4 => console.log(res4));
            });
    }

}
